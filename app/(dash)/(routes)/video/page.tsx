"use client";

import axios from "axios";
import * as z from "zod"
import { VideoIcon} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import { zodResolver} from "@hookform/resolvers/zod";

import Heading from "@/components/heading";

// import { BotAvatar } from "@/components/bot-avatar";
import formSchema from "./constants"
import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Empty} from "@/components/empty";
import {Loader} from "@/components/loader";
// import OpenAI from "openai";
import {useToast} from "@/components/ui/use-toast";
import {useProModal} from "@/hooks/use-pro-modal";

const VideoPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [video, setVideo] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    const { toast } = useToast()
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined)
            const response = await axios.post('/api/video', values);
            setVideo(response.data[0])

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
                <Heading title="Video Generation" description="Create video from your prompt" icon={VideoIcon}
                         iconColor="text-orange-500" bgColor="bg-orange-500/10"/>
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
                                                placeholder="dog chasing cat"
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
                    {!video && !isLoading && (
                        <Empty label="No video generated." />
                    )}
                    {video && (
                        <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                            <source src={video}/>
                        </video>
                    )}
                </div>
            </div>
        </div>
    )
}


export default VideoPage;


