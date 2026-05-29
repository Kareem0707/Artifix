import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

import { checkAndDeductCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
    try {
        if (!API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        // --- CREDIT CHECK ---
        try {
            await checkAndDeductCredits(1); 
        } catch (creditError: any) {
            return NextResponse.json({ error: creditError.message || "Insufficient credits or not logged in" }, { status: 403 });
        }
        // ---------------------

        const { text, audience = [], tone = "Professional", platform = "Any", dialect = "Standard", features = {}, lang = "EN" } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const requestedLanguage = lang === 'AR' ? 'Arabic' : lang === 'FR' ? 'French' : lang === 'DE' ? 'German' : 'English';
        
        const formatRule = features?.numbers 
            ? "MUST convert ALL Hindi/Arabic-Indic numerals (١٢٣٤٥٦٧٨٩٠) into standard Western Arabic numerals (1234567890) seamlessly."
            : "Keep numbers exactly as they were written.";

        const emojiRule = features?.emojis 
            ? "MUST strategically and aesthetically distribute relevant, high-converting emojis throughout the text. Do not overdo it." 
            : "DO NOT include any emojis anywhere.";

        const prompt = `
You are an expert copywriter, neuromarketing specialist, and professional content architect.
Your task is to rewrite, refine, and architect the provided raw text to have maximum impact.

--- Context Parameters ---
* Output Language: ${requestedLanguage}
* Target Audience Demographics / Psychographics: ${audience.length > 0 ? audience.join(" - ") : "General Audience"}
* Desired Tone of Voice: ${tone}
* Dialect / Speaking Style: ${dialect}
* Target Platform: ${platform}

--- Feature Requirements ---
* Formatting: Create short, highly readable paragraphs with excellent spacing. Ensure a strong hook and a clear Call To Action (CTA) if applicable. Use bullet points if listing multiple details.
* Number Rule: ${formatRule}
* Emoji Rule: ${emojiRule}

--- Instructions ---
1. Analyze the target audience comprehensively. If the audience includes "Rich/High-Income", "Decor Enthusiasts", "Engineers", "Workers", or "Students", deeply adapt the vocabulary, jargon, idioms, and psychological triggers to strictly resonate with them based on their pain points and desires.
2. CRITICAL DIALECT RULE: Completely adopt the requested '${dialect}' dialect! If it's an Arabic colloquium (like Egyptian or Gulf), use native idioms, everyday phrasing, and completely abandon stiff, robotic, or traditional AI-sounding phrases. Make it sound 100% written by a native human local to that specific dialect.
3. Structure the copy for the specified platform (e.g., short & punchy with hashtags for Twitter/Instagram, deeply professional and structured for LinkedIn, highly persuasive ad copy for Facebook Ads, or engaging for TikTok).
4. Do NOT simply translate or edit grammar. Substantially improve the copy's persuasiveness, flow, and psychological appeal based on the chosen audience.
5. Ensure the output is natively tailored to the chosen language.
6. The result MUST only contain the customized final drafted text. Do NOT add any conversational filler like "Here is the refined text". Return strictly the final crafted copy.

--- Raw Original Text to Architect ---
"""
${text}
"""
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        return NextResponse.json({ result: responseText });

    } catch (error: any) {
        console.error("Content Architect API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
