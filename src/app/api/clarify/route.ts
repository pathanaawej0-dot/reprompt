import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { getCorsHeaders, handleCorsOptions } from '@/lib/corsHelper';
import Groq from 'groq-sdk';

export async function OPTIONS(req: Request) {
    return handleCorsOptions(req);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CLARIFY_SYSTEM_PROMPT = `You are a Principal NLP Engineer with 10 years of experience at OpenAI and Google AI. Your specialty is Predictive User Intent Analysis.

A user has provided a vague, incomplete, or ambiguous thought. Your objective is NOT to blindly interrogate them. Your objective is to perform an INTENT GAP ANALYSIS. 
You must pinpoint the exact "line": Where is the user currently starting [Input], and what is their ultimate, unspoken desired outcome [Expected Result]?

Based on their User Profile (role, industry) and their Active App Context (where they are typing), you must GUESS the most highly probable missing contexts that bridge this line. Your goal is to save the user from typing by providing the exact answers they were thinking of.

RULES:
1. DO NOT ask open-ended questions if you can mathematically guess the top 4 scenarios.
2. Generate EXACTLY 1-2 high-impact Multiple Choice Questions (MCQ).
3. Each MCQ must provide EXACTLY 4 highly specific options that finish their thought or bridge the gap to their expected outcome.
4. Return ONLY valid JSON (no markdown, no conversational text).
5. The JSON must be an object with a key "questions" (array).
6. Each question object has: "question" (string), "type" (must be "mcq").
7. The "options" array MUST contain objects: {"title": "Short summary", "description": "1 sentence explanation"}.

EXAMPLE:
User Profile: Software Engineer. Active App: VS Code. Prompt: "fix this"
Intent Gap Analysis: The user has a bug or error in their code and wants a solution.
Output:
{"questions":[{"question":"What type of fix are you looking for to bridge this to a working state?","type":"mcq","options":[{"title":"Debug Runtime Error","description":"Identify and fix a crash or runtime exception."},{"title":"Refactor Architecture","description":"Improve the structure and cleanliness of the code."},{"title":"Syntax/Typing Fix","description":"Resolve a compiler or typing issue."},{"title":"Logic Explanation","description":"Explain why the current implementation is failing."}]}]}`;


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
