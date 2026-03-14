import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { getCorsHeaders, handleCorsOptions } from '@/lib/corsHelper';
import Groq from 'groq-sdk';

export async function OPTIONS(req: Request) {
    return handleCorsOptions(req);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const EVALUATE_SYSTEM_PROMPT = `You are an expert AI prompt engineer. You are given an AI-generated response. 

Your task is to:
1. Briefly evaluate what could be improved or what's missing (keep this internal).
2. Generate a precise, powerful follow-up prompt that the user can send to the AI to get a much better, more refined, or more specific result.

RULES:
- Return ONLY valid JSON.
- The JSON object must have one key: "followUpPrompt" (string).
- The follow-up prompt should be direct and actionable.
- Do not include any explanations or conversational chatter.

EXAMPLE:
User input: "Sure! Here is a simple recipe for banana board..."
Output:
{"followUpPrompt": "That looks good, but can you now make it gluten-free, add measurements in grams, and provide a step-by-step nutrition breakdown per serving?"}`;

export async function POST(req: Request) {
    const corsHeaders = getCorsHeaders(req);

    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        }

        const body = await req.json();
        const { text } = body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400, headers: corsHeaders });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: EVALUATE_SYSTEM_PROMPT },
                { role: 'user', content: text.trim().slice(0, 4000) } // Cap input length for evaluation
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 512,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';
        
        try {
            const parsed = JSON.parse(raw);
            if (parsed.followUpPrompt) {
                return NextResponse.json(parsed, { headers: corsHeaders });
            }
        } catch {
            // fallback if JSON fails
            return NextResponse.json({ 
                followUpPrompt: "That's a good start. Can you please elaborate more on the specific details and provide some concrete examples?" 
            }, { headers: corsHeaders });
        }

        return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500, headers: corsHeaders });

    } catch (error: any) {
        console.error('Evaluate error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}
