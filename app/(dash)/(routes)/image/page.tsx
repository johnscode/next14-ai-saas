"use client";

import axios from "axios";
import * as z from "zod"
import {Download, ImageIcon} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import { zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import Heading from "@/components/heading";

import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {Card, CardFooter} from "@/components/ui/card";

import formSchema from "./constants"
import {amountOptions} from "./constants";
import {resolutionOptions} from "./constants";
import {Empty} from "@/components/empty";
import {Loader} from "@/components/loader";
import {useToast} from "@/components/ui/use-toast";
import {useProModal} from "@/hooks/use-pro-modal";

const ImagePage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "1024x1024"
        }
    });
    const { toast } = useToast()
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);

            const response = await axios.post('/api/image', values);
            const urls = response.data.map((image: { url: string }) => image.url);

            setImages(urls);
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
                <Heading title="Image Generation" description="Eve creates images from your prompt" icon={ImageIcon}
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
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent px-8"
                                                disabled={isLoading}
                                                placeholder="A picture of a labrador in the mountains?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2 mb-2 mt-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="resolution"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2 mt-2 mb-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="block w-full col-span-12 lg:col-span-2">
                            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                                Generate
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                <div className="flex flex-col-reverse gap-y-4">
                    {isLoading && (
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}
                    {images.length === 0 && !isLoading && (
                        <Empty label="No images generated." />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 mx-4">
                        {images.map((src) => (
                            <Card key={src} className="rounded-lg overflow-hidden">
                                <div className="relative aspect-square">
                                    <Image fill alt="Generated Image" src={src} />
                                </div>
                                <CardFooter className="p-2">
                                    <Button onClick={() => window.open(src)} variant="secondary" className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ImagePage;


