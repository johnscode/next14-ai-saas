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
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    fps: 24,
                    model: "xl",
                    width: 576,
                    height: 320,
                    prompt: prompt,
                    batch_size: 1,
                    num_frames: 24,
                    init_weight: 0.5,
                    guidance_scale: 7.5,
                    negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
                    remove_watermark: false,
                    num_inference_steps: 50
                }
            }
        );

        if (!isPro) {
           await incrementApiLimit();
        }

        return NextResponse.json(output);
    } catch (error) {
        console.log('--- replicate error ---', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

