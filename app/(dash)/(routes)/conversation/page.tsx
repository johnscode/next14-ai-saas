"use client";

import axios from "axios";
import * as z from "zod"
import { MessageSquare} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import { zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/lib/utils";

import Heading from "@/components/heading";

import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import formSchema from "./constants"
import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Empty} from "@/components/empty";
import {Loader} from "@/components/loader";
import { useToast } from "@/components/ui/use-toast"

import { useProModal } from "@/hooks/use-pro-modal";

class ChatRequestMessage {
    key: string;
    role: string;
    content: string;

    constructor(role: string, content: string, key: string) {
        this.key = key;
        this.role = role;
        this.content = content;
    }
}

const ConversationPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [messages, setMessages] = useState<ChatRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;
    const { toast } = useToast()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const index = messages.length
            const prompt = values.prompt
            const userMessage = new ChatRequestMessage("user", prompt, index.toString());
            const newMessages = [...messages, userMessage];

            const response = await axios.post('/api/conversation', { messages: newMessages });
            const resMsg = new ChatRequestMessage("assistant", response.data, (index+1).toString())
            setMessages((current) => [...current, userMessage, resMsg]);

            // form.reset();
        } catch (error: any) {
            console.log(error)
            if (error?.response?.status === 403) {
                console.log(error?.response?.data)
                toast({
                    title: "Api Limit",
                    variant: "destructive",
                    description: error?.response?.data,
                    duration: 2000,
                });
                proModal.onOpen();
            } else {
                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: error?.response?.data,
                });
            }
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <div>
                <Heading title="Conversation" description="Chat with Eve" icon={MessageSquare}
                         iconColor="text-violet-500" bgColor="bg-violet-500/10"/>
            </div>
            <div className="mx-3">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className="rounded-lg border w-full  p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                        <div className="block w-full col-span-12">
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="How do I calculate the radius of a circle?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="block w-full col-span-12 lg:col-span-2">
                            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading } size="icon">
                                Generate
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                <div className="flex flex-col-reverse gap-y-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started." />
                    )}
                    <ul>
                        {messages.map((message) => (
                            <li key={message.key}>
                                <div key={message.key} className={cn(
                                    "p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                                )} >
                                    {/*{message.role}*/}
                                    {message.role === "user" ? <UserAvatar/> : <BotAvatar/>}
                                    <p className="text-sm">
                                        {message.content}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}


export default ConversationPage;


