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

        const { text, agentName, globalProfile, recentContext, previousQuestions } = await req.json();

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400, headers: corsHeaders });
        }

        let formattedHistory = 'None';
        if (Array.isArray(previousQuestions) && previousQuestions.length > 0) {
            formattedHistory = previousQuestions.map((qa: any, i: number) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join('\n\n');
        }

        const contextInfo = `
User Profile: ${globalProfile || 'Not provided'}
Active Agent: ${agentName || 'General'}
Recent App Context: ${recentContext || 'None'}
Conversation History (Previously Asked Questions):
${formattedHistory}
`.trim();

        const isArchitect = agentName === 'CO-STAR Architect';

        const dynamicSystemPrompt = `You are a Principal NLP Engineer with 10 years of experience at OpenAI and Google AI. Your specialty is Predictive User Intent Analysis.

A user has provided an initial thought. You are evaluating their text and conversation history to determine if you have enough context to generate a flawless, professional AI prompt.

Current Goal: Evaluate the Conversation History and the Prompt.
Do you have enough information to proceed?
- If YES: Output {"action": "optimize"}
- If NO: Output {"action": "ask"} and provide EXACTLY 1 Multiple Choice Question to gather the missing context.

${isArchitect ? \`CRITICAL RULE FOR CO-STAR ARCHITECT:
You must be incredibly strict. You are building a CO-STAR structured prompt.
Evaluate the user's input regardless of its length. Look strictly for the presence of the Core Variables: Context, Objective, Style, Tone, Audience, and Format.
If ANY of these variables are missing, ambiguous, or assumed, you MUST output "ask" to clarify them.
Only if the provided text unequivocally defines all necessary variables, you may output "optimize".\` : \`CRITICAL RULE FOR OMNI AGENT:
You are building an informal, chatty prompt. Be lenient. If you understand the core goal, output "optimize". Do not over-interrogate.\`}

ANTI-HALLUCINATION SAFEGUARD:
You have a strict knowledge cutoff. If the user's prompt mentions a modern technology, brand, or concept that you do not confidently recognize, DO NOT guess or hallucinate.
Instead, you MUST prioritize using your clarification question to ask the user to briefly define what that specific term means (e.g., "What is [Term]?").

RULES:
1. Generate EXACTLY 1 Multiple Choice Question (MCQ) if asking.
2. The MCQ must provide EXACTLY 4 highly specific options that finish their thought.
3. Return ONLY valid JSON (no markdown, no conversational text).
4. The JSON must be an object with: "action" (string: "ask" or "optimize").
5. If action is "ask", include "questions" (array of 1 object).
6. The question object has: "question" (string), "type" (must be "mcq"), "options" (array of objects with "title" and "description" sentences).`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: dynamicSystemPrompt },
                { role: 'user', content: `Context:\n${contextInfo}\n\nPrompt: ${text.trim()}` }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
            max_tokens: 1024,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';

        const fallback = { action: 'optimize' };

        let parsed: any;
        try {
            parsed = JSON.parse(raw);
        } catch {
            return NextResponse.json(fallback, { headers: corsHeaders });
        }

        if (parsed.action === 'optimize' || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
            return NextResponse.json({ action: 'optimize' }, { headers: corsHeaders });
        }

        // Normalize and validate
        return NextResponse.json({
            action: 'ask',
            questions: parsed.questions.slice(0, 1).map((q: any) => {
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
