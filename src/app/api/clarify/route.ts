import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { getCorsHeaders, handleCorsOptions } from '@/lib/corsHelper';
import Groq from 'groq-sdk';

export async function OPTIONS(req: Request) {
    return handleCorsOptions(req);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CLARIFY_SYSTEM_PROMPT = `You are an expert at analyzing vague user prompts and identifying what information is needed to write a great optimized prompt.

Your task: Given a short or vague prompt, generate 1 to 3 clarifying questions. Each question has its own set of 4 short multiple-choice options.

RULES:
- Return ONLY valid JSON — no explanation, no markdown, no code fences.
- The JSON is an object with a single key "questions" (an array of question objects).
- Each question object has: "question" (string) and "options" (array of exactly 4 short strings).
- Generate only as many questions as are truly needed (1-3). Simple prompts need 1 question. Complex ones may need 2-3.
- Each option should be concise (under 10 words).
- Questions should be ordered from most important to least.

EXAMPLE (1 question):
User prompt: "write about AI"
Output:
{"questions":[{"question":"What type of content do you need?","options":["A blog post for general readers","A technical deep-dive for developers","A short social media post","A formal business report"]}]}

EXAMPLE (2 questions):
User prompt: "email the client"
Output:
{"questions":[{"question":"What is the email about?","options":["Project update or status","Delay or problem notification","Request for feedback","Invoice or payment"]},{"question":"What tone should it have?","options":["Formal and professional","Friendly but direct","Apologetic and empathetic","Confident and assertive"]}]}`;

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
                { role: 'system', content: CLARIFY_SYSTEM_PROMPT },
                { role: 'user', content: text.trim() }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
            max_tokens: 512,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';

        const fallback = {
            questions: [
                {
                    question: 'What are you trying to accomplish?',
                    options: [
                        'Make it more detailed and specific',
                        'Keep it simple and concise',
                        'Make it more professional',
                        'Adjust the tone and style'
                    ]
                }
            ]
        };

        let parsed: { questions: { question: string; options: string[] }[] };
        try {
            parsed = JSON.parse(raw);
        } catch {
            return NextResponse.json(fallback, { headers: corsHeaders });
        }

        if (
            !Array.isArray(parsed.questions) ||
            parsed.questions.length === 0 ||
            !parsed.questions.every(q => typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 2)
        ) {
            return NextResponse.json(fallback, { headers: corsHeaders });
        }

        // Normalize: cap at 3 questions, cap each to 4 options
        return NextResponse.json({
            questions: parsed.questions.slice(0, 3).map(q => ({
                question: q.question,
                options: q.options.slice(0, 4)
            }))
        }, { headers: corsHeaders });

    } catch (error: any) {
        console.error('Clarify error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}
