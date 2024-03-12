
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import ChatCompletionUserMessageParam = OpenAI.ChatCompletionUserMessageParam;
import ChatCompletionAssistantMessageParam = OpenAI.ChatCompletionAssistantMessageParam;
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;
import ChatCompletionContentPart = OpenAI.ChatCompletionContentPart;
import Configuration from "openai";

export const openai = new OpenAI({
    organization: 'org-y5GoVom0GCfFqSSh52xKSb8a',
});

export const OpenAIConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

export class UserMsg implements ChatCompletionUserMessageParam {
    content: string|ChatCompletionContentPart[];
    role: 'user';
    constructor(content: string|ChatCompletionContentPart[]) {
        this.content = content;
        this.role = 'user'
    }
}
export class AsstMsg implements ChatCompletionAssistantMessageParam {
    content: string|null|undefined;
    role: 'assistant';
    constructor(content: string|null|undefined) {
        this.content = content;
        this.role = 'assistant'
    }
}
export class SysMsg implements ChatCompletionSystemMessageParam {
    content: string;
    role: 'system';
    constructor(content: string) {
        this.content = content;
        this.role = 'system'
    }
}

export function createMsg(msg: ChatCompletionMessageParam): ChatCompletionMessageParam|null {
    switch (msg.role) {
        case "user":
            return new UserMsg(msg.content);
        case "system":
            return new SysMsg(msg.content);
        case "assistant":
            return new AsstMsg(msg.content)
    }
    return null
}