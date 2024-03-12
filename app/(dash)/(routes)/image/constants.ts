
import * as z from "zod"

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Image prompt is required"
    }),
    amount: z.string().min(1),
    resolution: z.string().min(1),
});

export const amountOptions = [
    { value: "1", label: "1 Image"},
    { value: "2", label: "2 Images"},
    { value: "3", label: "3 Images"},
    { value: "4", label: "4 Images"},
    { value: "5", label: "5 Images"}
];

export const resolutionOptions = [
    { value: "1024x1024", label: "1024x1024 (icon)"},
    { value: "1792x1024", label: "1792x1024 (landscape)"},
    { value: "1024x1792", label: "1024x1792 (portrait)"},
];

export default formSchema;
