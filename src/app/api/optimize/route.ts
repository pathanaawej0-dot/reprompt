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
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 4096,
            });
            optimizedText = completion.choices[0]?.message?.content || '';

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

        return NextResponse.json({ optimizedText, credits: remainingCredits, cached: false }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Optimization error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error) }, { status: 500, headers: corsHeaders });
    }
}
