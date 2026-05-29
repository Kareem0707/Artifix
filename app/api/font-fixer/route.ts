import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("GEMINI_API_KEY is not defined in the environment.");
}
const genAI = new GoogleGenerativeAI(API_KEY || "");

import { checkAndDeductCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
    try {
        if (!API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        // --- CREDIT CHECK ---
        try {
            await checkAndDeductCredits(1); // Font Fixer costs 1 credit
        } catch (creditError: any) {
            return NextResponse.json({ error: creditError.message || "Insufficient credits or not logged in" }, { status: 403 });
        }
        // ---------------------

        const { imageBase64, text, lang } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Format the image part
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg",
            },
        };

        const requestedLanguage = lang === 'AR' ? 'Arabic' : lang === 'FR' ? 'French' : lang === 'DE' ? 'German' : 'English';

        // Prepare prompt
        const prompt = `
You are an expert graphic designer and typographer. Analyze the visual style, typography, and aesthetic mood shown in the provided image.
The user provided this additional context text: "${text || 'No additional text'}".

Based on these specific visual traits, suggest precisely 3 perfectly matching Google Fonts that would complement this design aesthetic. 
CRITICAL REQUIREMENT 1: The 3 suggested fonts MUST BE OF DIFFERENT STYLES/CATEGORIES from each other (e.g., suggest 1 Sans Schema, 1 Serif or Display, and 1 Handwriting or Creative font). Give the user diverse options, but ensure all 3 still perfectly fit the mood and aesthetic of the image.
CRITICAL REQUIREMENT 2: The suggested fonts MUST fully support characters and glyphs for the ${requestedLanguage} language. If the language is Arabic, you MUST ONLY suggest Arabic-supported Google Fonts (e.g., Cairo, Tajawal, Lalezar, Marhey, Readex Pro, etc.). Do NOT suggest Latin-only fonts if the requested language is Arabic.

Also, deeply analyze the **empty (negative) space** in the image to determine the absolute best place to overlay text. You must return exact coordinates (X, Y) targeting this empty space, a recommended font size (as a percentage relative to image height), and the best hex color to use.

Respond ONLY with a valid, clean JSON object. Do NOT include markdown code blocks, just the raw JSON object.
IMPORTANT: ALL string values (analysis, reasonings) MUST be written in ${requestedLanguage} language.

The JSON format must strictly be:
{
  "imageAnalysis": "A 2-3 sentence analysis of the image's mood, aesthetic, and color palette (in ${requestedLanguage}).",
  "recommendedColor": "#HEXCODE",
  "colorReason": "Why this color was chosen (in ${requestedLanguage}).",
  "placement": {
    "xPercentage": 50, // 0 to 100 representing X coordinate % in the optimal empty space
    "yPercentage": 50, // 0 to 100 representing Y coordinate % in the optimal empty space
    "fontSizePercentage": 8, // 1 to 20 representing font size relative to image height (e.g., 8 means 8% of the height)
    "align": "center", // "left", "center", or "right"
    "justification": "Why placing text at these exact coordinates and size works best compositionally (in ${requestedLanguage})."
  },
  "fonts": [
    {
      "name": "Exact Google Font Name",
      "category": "Sans Serif", // the category
      "reason": "Why this font matches (in ${requestedLanguage})."
    }
  ]
}
`;

        // Generate content
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const responseText = response.text();

        console.log("Raw Gemini Response:", responseText);

        // Try parsing the JSON
        let parsedData: any = null;
        try {
            // Remove any potential markdown block markers
            const cleanedText = responseText.replace(/```json\n?/g, "").replace(/```/g, "").trim();
            parsedData = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse Gemini output:", responseText);
            return NextResponse.json({ error: "AI failed to return valid JSON format" }, { status: 500 });
        }

        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error("Font Fixer API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
