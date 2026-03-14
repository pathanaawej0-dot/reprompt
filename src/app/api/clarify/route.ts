import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { getCorsHeaders, handleCorsOptions } from '@/lib/corsHelper';
import Groq from 'groq-sdk';

export async function OPTIONS(req: Request) {
    return handleCorsOptions(req);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CLARIFY_SYSTEM_PROMPT = `You are an expert at analyzing vague user prompts and identifying what information is needed to write a great optimized prompt.

Your task: Given a user prompt and optional context, decide how many clarifying questions are truly needed (1-5) and generate them. 

RULES:
- Return ONLY valid JSON (no markdown, no text).
- The JSON is an object with a key "questions" (array).
- Each question object has: 
    - "question" (string)
    - "type" ("mcq" or "text")
    - "options" (array of exactly 4 strings for "mcq", empty array [] for "text")
- Use "text" type for questions that need specific info (deadlines, URLs, names) rather than choices.
- Order from most important to least.
- Use the User Profile and Agent context to make questions relevant.
- Use the Recent History to avoid repeating questions the user has likely already considered.

EXAMPLE:
User prompt: "plan a trip"
Output:
{"questions":[{"question":"Where are you going?","type":"text","options":[]},{"question":"What is your budget?","type":"mcq","options":["Budget-friendly","Moderate","Luxury","Ultra-premium"]}]}`;


export async function POST(req: Request) {
    const corsHeaders = getCorsHeaders(req);

    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        }

        const body = await req.json();
        const { text, agentName, globalProfile, recentContext } = body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400, headers: corsHeaders });
        }

        const contextInfo = `
User Profile: ${globalProfile || 'Not provided'}
Active Agent: ${agentName || 'General'}
Recent History: ${recentContext || 'None'}
`.trim();

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: CLARIFY_SYSTEM_PROMPT },
                { role: 'user', content: `Context:\n${contextInfo}\n\nPrompt: ${text.trim()}` }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
            max_tokens: 1024,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';

        const fallback = {
            questions: [
                {
                    question: 'How can I best help you with this?',
                    type: 'text',
                    options: []
                }
            ]
        };

        let parsed: { questions: { question: string; options?: string[]; type?: string }[] };
        try {
            parsed = JSON.parse(raw);
        } catch {
            return NextResponse.json(fallback, { headers: corsHeaders });
        }

        if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
            return NextResponse.json(fallback, { headers: corsHeaders });
        }

        // Normalize and validate
        return NextResponse.json({
            questions: parsed.questions.slice(0, 5).map(q => {
                const type = q.type === 'text' ? 'text' : 'mcq';
                return {
                    question: q.question || 'What are the next steps?',
                    type: type,
                    options: type === 'mcq' ? (Array.isArray(q.options) ? q.options.slice(0, 4) : ['Option 1', 'Option 2', 'Option 3', 'Option 4']) : []
                };
            })
        }, { headers: corsHeaders });

    } catch (error: any) {
        console.error('Clarify error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}
