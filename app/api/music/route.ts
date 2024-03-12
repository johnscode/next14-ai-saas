import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate"
import {checkApiLimit, incrementApiLimit} from "@/lib/api-limit";
import {checkSubscription} from "@/lib/subscription";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY
});

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt  } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("prompt is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
        }

        const output = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    // alpha: 0.5,
                    prompt_a: prompt,
                    // prompt_b: "80's blues",
                    // denoising: 0.75,
                    // seed_image_id: "vibes",
                    // num_inference_steps: 50
                }
            }
        );

        if (!isPro) {
            await incrementApiLimit();
        }

        // const output = await replicate.run(
        //     "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
        //     {
        //         input: {
        //             top_k: 250,
        //             top_p: 0,
        //             prompt: prompt,
        //             duration: 10,
        //             temperature: 1,
        //             continuation: false,
        //             model_version: "stereo-large",
        //             output_format: "wav",
        //             continuation_start: 0,
        //             multi_band_diffusion: false,
        //             normalization_strategy: "peak",
        //             classifier_free_guidance: 3
        //         }
        //     }
        // );

        return NextResponse.json(output);
    } catch (error) {
        console.log('--- replicate error ---', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

