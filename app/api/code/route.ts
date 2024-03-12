import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Configuration from "openai";
import OpenAI from "openai"
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import ChatCompletionRequestMessage from "openai";

import {openai} from "@/lib/gptutils";
import {createMsg, AsstMsg, UserMsg, SysMsg} from "@/lib/gptutils";
import {OpenAIConfig} from "@/lib/gptutils";

import {checkApiLimit, incrementApiLimit} from "@/lib/api-limit";
import {checkSubscription} from "@/lib/subscription";

const instructionMessage = new AsstMsg("You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.")


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

        if (!OpenAIConfig.apiKey) {
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
        // const pruned_messages: {}[] = messages.map((msg: GptMessage) => {role: msg.role; content: msg.content});
        // const msgs: ChatCompletionMessageParam[] = []
        const msgs = messages.map((msg: ChatCompletionMessageParam) => {
            const newmsg: ChatCompletionMessageParam|null = createMsg(msg)
            return newmsg
        })
        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [instructionMessage, ...msgs],
            stream: true,
        });

        if (!isPro) {
            await incrementApiLimit();
        }
        var msg = ""
        for await (const chunk of stream) {
            msg = msg.concat(chunk.choices[0]?.delta?.content || "")
        }
        return NextResponse.json(msg);
    } catch (error) {
        console.log('--- gpt error ---', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

