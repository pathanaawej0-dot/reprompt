import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { getCorsHeaders, handleCorsOptions } from '@/lib/corsHelper';
import { sql } from '@/lib/db';
import Groq from 'groq-sdk';

export async function OPTIONS(req: Request) {
    return handleCorsOptions(req);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    const corsHeaders = getCorsHeaders(req);
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        const idempotencyKey = req.headers.get('idempotency-key');

        if (idempotencyKey) {
            const cachedResult = await sql`SELECT response FROM idempotency_cache WHERE idempotency_key = ${idempotencyKey}`;
            if (cachedResult.length > 0) {
                return NextResponse.json({ optimizedText: cachedResult[0].response, credits: undefined, cached: true }, { headers: corsHeaders });
            }
        }

        const body = await req.json();
        const { text, agentPrompt, agentId } = body;
        if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400, headers: corsHeaders });

        let systemPrompt = agentPrompt || 'You are a professional text optimizer.';
        if (!agentPrompt && agentId) {
            const agentRes = await sql`SELECT system_prompt FROM agents WHERE id = ${agentId}`;
            if (agentRes.length > 0) systemPrompt = agentRes[0].system_prompt;
        }

        // Handle credit resets BEFORE atomic deduction
        const dbUser = await sql`SELECT plan, EXTRACT(EPOCH FROM (NOW() - credits_reset_date))/86400 as days_since_reset FROM users WHERE id = ${userId}`;
        if (dbUser.length > 0) {
            if (dbUser[0].days_since_reset >= 30) {
                if (dbUser[0].plan === 'free') {
                    await sql`UPDATE users SET credits = 10, credits_reset_date = NOW() WHERE id = ${userId}`;
                } else if (dbUser[0].plan === 'pro') {
                    await sql`UPDATE users SET credits = 1500, credits_reset_date = NOW() WHERE id = ${userId}`;
                }
            }
        }

        // Atomically check and deduct credit
        const deductionResult = await sql`
            UPDATE users 
            SET credits = credits - 1, updated_at = NOW() 
            WHERE id = ${userId} AND credits > 0 
            RETURNING credits;
        `;

        if (deductionResult.length === 0) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 402, headers: corsHeaders });
        }

        const remainingCredits = deductionResult[0].credits;

        let optimizedText = '';
        let explanation = '';
        try {
            let fewShotExample = '';
            if (agentId === 'costar_architect') {
                fewShotExample = `FEW-SHOT EXAMPLE:\nInput: "build a diet app"\nExpected Correct Output:\n{\n  "optimizedText": "# CONTEXT\\nThe user requires a mobile application focused on diet tracking.\\n\\n# OBJECTIVE\\nAct as a Senior Mobile Developer to design a comprehensive diet tracking application featuring macro monitoring.\\n\\n# STYLE\\nHighly detailed architectural specification.\\n\\n# TONE\\nProfessional, authoritative, and structured.\\n\\n# AUDIENCE\\nA team of full-stack developers.\\n\\n# FORMAT\\nMarkdown with clear headers and bullet points for all requirements.",\n  "explanation": "Applied the CO-STAR framework for massive architectural detail."\n}`;
            } else {
                fewShotExample = `FEW-SHOT EXAMPLE:\nInput (User Thought): "fix the css margins"\nExpected Correct Output:\n{\n  "optimizedText": "Act as an expert Frontend Developer. Review the provided CSS code for the primary button component and resolve all margin-collapsing issues to strictly align with the documented design system, ensuring responsive behavior across mobile and desktop viewports.",\n  "explanation": "Applied the ReAct framework to enforce frontend best practices."\n}`;
            }

            const jsonSystemPrompt = `${systemPrompt}\n\nCRITICAL IDENTITY ANCHOR:\nYou are a PROMPT ENGINEER. You NEVER fulfill the user's request yourself. If the user asks "Write a Reddit post", DO NOT write the post. You MUST respond with an engineered prompt like "Act as a Community Manager to write a Reddit post...".\n\nCRITICAL JSON RULES:\n1. You MUST return ONLY a raw JSON object. No conversational text.\n2. The JSON must have EXACTLY two keys: "optimizedText" and "explanation".\n3. DO NOT wrap the optimizedText in conversational filler like "Given the user's intent, the ultimate prompt is...". Just output the final engineered prompt directly inside the value.\n4. Do NOT double-escape characters unnecessarily. Use standard valid JSON.\n\n${fewShotExample}`;
            
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: jsonSystemPrompt },
                    { role: 'user', content: text }
                ],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
                temperature: 0.7,
                max_tokens: 4000,
            });
            
            const raw = completion.choices[0]?.message?.content || '{}';
            try {
                const parsed = JSON.parse(raw);
                optimizedText = parsed.optimizedText || raw;
                explanation = parsed.explanation || 'Refined for clarity and impact.';
            } catch {
                optimizedText = raw;
                explanation = 'Refined for clarity and impact.';
            }

            await sql`
              INSERT INTO usage_logs (user_id, agent_id, prompt_tokens, completion_tokens)
              VALUES (${userId}, ${agentId || 'web-proxy'}, ${completion.usage?.prompt_tokens || 0}, ${completion.usage?.completion_tokens || 0})
            `;

        } catch (groqError) {
            // Rollback credit if LLM failed
            await sql`UPDATE users SET credits = credits + 1 WHERE id = ${userId}`;
            throw groqError;
        }

        if (idempotencyKey) {
            await sql`
                INSERT INTO idempotency_cache (idempotency_key, user_id, response)
                VALUES (${idempotencyKey}, ${userId}, ${optimizedText})
                ON CONFLICT (idempotency_key) DO NOTHING
            `;
        }

        return NextResponse.json({ optimizedText, explanation, credits: remainingCredits, cached: false }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Optimization error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error) }, { status: 500, headers: corsHeaders });
    }
}
