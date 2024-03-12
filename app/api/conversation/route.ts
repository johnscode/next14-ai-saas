import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Configuration from "openai";
import OpenAI from "openai"
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
// import ChatCompletionUserMessageParam = OpenAI.ChatCompletionUserMessageParam;
// import ChatCompletionAssistantMessageParam = OpenAI.ChatCompletionAssistantMessageParam;
// import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;
// import ChatCompletionContentPart = OpenAI.ChatCompletionContentPart;

import {checkApiLimit, incrementApiLimit} from "@/lib/api-limit";
import {createMsg} from "@/lib/gptutils";
import {checkSubscription} from "@/lib/subscription";

// class UserMsg implements ChatCompletionUserMessageParam {
//     content: string|ChatCompletionContentPart[];
//     role: 'user';
//     constructor(content: string|ChatCompletionContentPart[]) {
//         this.content = content;
//         this.role = 'user'
//     }
// }
// class AsstMsg implements ChatCompletionAssistantMessageParam {
//     content: string|null|undefined;
//     role: 'assistant';
//     constructor(content: string|null|undefined) {
//         this.content = content;
//         this.role = 'assistant'
//     }
// }
// class SysMsg implements ChatCompletionSystemMessageParam {
//     content: string;
//     role: 'system';
//     constructor(content: string) {
//         this.content = content;
//         this.role = 'system'
//     }
// }
//
// export function createMsg(msg: ChatCompletionMessageParam): ChatCompletionMessageParam|null {
//     switch (msg.role) {
//         case "user":
//             return new UserMsg(msg.content);
//         case "system":
//             return new SysMsg(msg.content);
//         case "assistant":
//             return new AsstMsg(msg.content)
//     }
//     return null
// }

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAI({
    organization: 'org-y5GoVom0GCfFqSSh52xKSb8a',
});

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages  } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!config.apiKey) {
            return new NextResponse("OpenAI API Key not configured.", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
        }

        const msgs = messages.map((msg: ChatCompletionMessageParam) => {
            // const newmsg: ChatCompletionMessageParam|null = createMsg(msg)
            return createMsg(msg)
        })
        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: msgs,
            stream: true,
        });

        await incrementApiLimit();
        if (!isPro) {
            await incrementApiLimit();
        }

        let msg = "";
        for await (const chunk of stream) {
            msg = msg.concat(chunk.choices[0]?.delta?.content || "")
        }
        return NextResponse.json(msg);
    } catch (error) {
        console.log('--- gpt error ---', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

