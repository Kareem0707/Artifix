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
            await checkAndDeductCredits(2); // Article Forge costs 2 credits because it's long-form
        } catch (creditError: any) {
            return NextResponse.json({ error: creditError.message || "Insufficient credits or not logged in" }, { status: 403 });
        }
        // ---------------------

        const { topic, keywords, language, tone } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "No topic provided" }, { status: 400 });
        }

        // We use gemini-1.5-flash to avoid the 503 errors on the newer 2.5 model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const requestedLanguage = language === 'AR' ? 'Arabic' : language === 'FR' ? 'French' : language === 'DE' ? 'German' : 'English';

        const prompt = `
You are an elite, top-tier human copywriter and SEO expert. Your task is to write a highly detailed, comprehensive, and fully "humanized" article about the following topic:
Topic: "${topic}"

Target Language: ${requestedLanguage}
Tone of Voice: ${tone}
${keywords ? `Target Keywords to integrate naturally: ${keywords}` : ''}

CRITICAL RULES TO BYPASS AI DETECTORS (MUST FOLLOW STRICTLY):
1. LENGTH: The article MUST be extremely comprehensive and exceed 2,000 words. Dive deep into sub-topics, provide real-world examples, analogies, and actionable advice.
2. PERPLEXITY & BURSTINESS: Vary your sentence lengths dramatically. Use very short, punchy sentences. Then follow up with longer, flowing, complex sentences. 
3. HUMAN FLAIR: Use rhetorical questions, transitional phrases, and a conversational flow. Avoid formulaic, repetitive structures (like starting every paragraph with "Additionally," or "Moreover,").
4. ABANDON AI JARGON: Never use typical AI words like "In today's fast-paced digital world", "Delve into", "It is important to note", "Tapestry", or "Beacon". Sound like a real, experienced human expert writing a masterclass blog post.
5. STRUCTURE: Use engaging H1, H2, and H3 headers. Use bullet points for readability where appropriate.
6. NO INTRO/OUTRO FLUFF: Do not start with "Here is your article...". Just output the final article strictly formatted in Markdown. 
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        return NextResponse.json({ result: responseText });

    } catch (error: any) {
        console.error("Article Forge API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
