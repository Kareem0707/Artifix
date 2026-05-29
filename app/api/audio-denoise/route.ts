import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { checkAndDeductCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
    try {
        // --- CREDIT CHECK ---
        try {
            await checkAndDeductCredits(5); // Audio Denoising is expensive
        } catch (creditError: any) {
            return NextResponse.json({ error: creditError.message || "Insufficient credits or not logged in" }, { status: 403 });
        }
        // ---------------------

        const token = process.env.REPLICATE_API_TOKEN;
        const { audioBase64, mimeType } = await req.json();

        if (!audioBase64) {
            return NextResponse.json({ error: "Missing audio data" }, { status: 400 });
        }

        if (!token) {
            // Mock Response for Demonstration if no token
            await new Promise(resolve => setTimeout(resolve, 3000));
            return NextResponse.json({ result: "mock_success" });
        }

        const replicate = new Replicate({ auth: token });
        const output = await replicate.run(
            "lucataco/resemble-enhance:baba192dc4fe97a61578e0ea5ef8784ad9a14df9762dfedae8f58b0ab7912440",
            {
                input: {
                    solver: "midpoint",
                    audio: `data:${mimeType || "audio/mp3"};base64,${audioBase64}`,
                    denoise: true
                }
            }
        );

        return NextResponse.json({ result: output }); 
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
