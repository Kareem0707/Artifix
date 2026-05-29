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

        const { category, history, lang } = await req.json();

        if (!history || history.length === 0) {
            return NextResponse.json({ error: "No history provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const requestedLanguage = lang === 'AR' ? 'Arabic' : lang === 'FR' ? 'French' : lang === 'DE' ? 'German' : 'English';

        let categoryName = "Images (Midjourney, Stable Diffusion)";
        if (category === "videos") categoryName = "Videos (Sora, Runway Gen-2)";
        if (category === "logos") categoryName = "Logos and Brand Identity";
        if (category === "copywriting") categoryName = "Marketing Copywriting";
        if (category === "code") categoryName = "Programming and Coding";

        const systemPrompt = `
You are an Elite AI Prompt Engineer & Master Architect for ${categoryName}.
The user wants you to generate the ultimate, highly descriptive, professional prompt based on their idea.

CRITICAL RULES:
1. Conversation Language: You MUST use ${requestedLanguage} for the conversation and questions.
2. Strategy: You need to ask a total of 5 to 7 highly specific, technical, and professional questions to extract their exact vision (e.g., lighting, camera angle, mood, color palette, style, cinematic effects, target audience, motion, format, etc.).
3. Execution: DO NOT ask all questions at once! You MUST ask exactly ONE question at a time. Wait for the user to answer the current question before asking the next one. You can briefly mention which number of question they are on (e.g. "Question 1 of 5").
4. Final Step: Once you have gathered all the answers after 5-7 individual questions, generate the ultimate, extremely detailed, cinematic, and professional prompt.
5. Final Prompt Language: The final generated prompt MUST ALWAYS BE IN ENGLISH, because AI generators (Midjourney/Sora) understand English best.
6. Formatting the Prompt: When you output the final prompt, you MUST wrap it strictly in a code block labeled "prompt" like this:
\`\`\`prompt
[The final English prompt goes here]
\`\`\`
Do not use the word "prompt" next to the backticks for anything else. Make the conversation engaging, conversational, and expert-level.`;

        // Format history for Gemini chat
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // Exclude the last message as the current send
        const latestMessage = formattedHistory[formattedHistory.length - 1]?.parts[0].text || "";
        const pastHistory = formattedHistory.slice(0, -1);

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: `Understood. I will act as the Elite Prompt Engineer for ${categoryName}. I will converse in ${requestedLanguage}, ask 5-7 detailed questions first to define the vision, and eventually output the final English prompt nicely wrapped in a \`\`\`prompt block. Let's begin.` }] },
                ...pastHistory
            ],
        });

        const result = await chat.sendMessage(latestMessage);
        const responseText = result.response.text();

        return NextResponse.json({ result: responseText });

    } catch (error: any) {
        console.error("Prompt Vault API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
