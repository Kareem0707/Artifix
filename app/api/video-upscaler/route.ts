import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { checkAndDeductCredits } from "@/lib/credits";

export const maxDuration = 300; // Allow longer execution time for Vercel

export async function POST(req: NextRequest) {
    try {
        // --- CREDIT CHECK ---
        try {
            await checkAndDeductCredits(10); // Video Upscaling is very expensive
        } catch (creditError: any) {
            return NextResponse.json({ error: creditError.message || "Insufficient credits or not logged in" }, { status: 403 });
        }
        // ---------------------

        const token = process.env.REPLICATE_API_TOKEN;
        const { videoBase64, mimeType, tier } = await req.json();

        if (!videoBase64) {
            return NextResponse.json({ error: "Missing video data" }, { status: 400 });
        }

        // Vercel / Next.js API Routes have a hard limit on JSON body sizes (default 4MB).
        // Since videos are large, we use mock processing if the file went through but no token was provided.
        if (!token) {
            await new Promise(resolve => setTimeout(resolve, 4000));
            return NextResponse.json({ result: "mock_success" });
        }

        const replicate = new Replicate({ auth: token });
        const output = await replicate.run(
            "lucataco/video-upscaler:5979f187900b70a7b6a182ae147fc32c1c3e387fd48039750d03b0cbe8dc98b4",
            {
                input: {
                    video: `data:${mimeType || "video/mp4"};base64,${videoBase64}`,
                    upscale_factor: tier === "HD" ? 1 : 2
                }
            }
        );

        return NextResponse.json({ result: output }); 
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
