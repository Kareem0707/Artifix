import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { checkAndDeductCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
    try {
        // --- CREDIT CHECK ---
        try {
            await checkAndDeductCredits(5); // Image Upscaling is expensive
        } catch (creditError: any) {
            return NextResponse.json({ error: creditError.message || "Insufficient credits or not logged in" }, { status: 403 });
        }
        // ---------------------

        const token = process.env.REPLICATE_API_TOKEN;
        const { imageBase64, mimeType, tier } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "Missing image data" }, { status: 400 });
        }

        if (!token) {
            // Mock Response for Demonstration if no token
            await new Promise(resolve => setTimeout(resolve, 3000));
            return NextResponse.json({ result: "mock_success" });
        }

        const replicate = new Replicate({ auth: token });
        // Real-ESRGAN for extreme quality 4K upscale
        const output = await replicate.run(
            "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
            {
                input: {
                    image: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                    scale: tier === "HD" ? 2 : 4,
                    face_enhance: true
                }
            }
        );

        return NextResponse.json({ result: output }); 
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
