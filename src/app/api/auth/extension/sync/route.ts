import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { getCorsHeaders, handleCorsOptions } from '@/lib/corsHelper';
import { sql } from '@/lib/db';
import crypto from 'crypto';

export async function OPTIONS(req: Request) {
    return handleCorsOptions(req);
}

export async function POST(req: Request) {
    const corsHeaders = getCorsHeaders(req);

    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in to the web app.' },
                { status: 401, headers: corsHeaders }
            );
        }

        // Generate permanent API key for the extension
        const rawApiKey = `rp_live_${crypto.randomBytes(32).toString('hex')}`;
        const hashedKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');

        // Check if user exists locally
        const existingUser = await sql`SELECT id FROM users WHERE id = ${userId}`;
        if (existingUser.length === 0) {
            await sql`
                INSERT INTO users (id, email, credits, plan, credits_reset_date)
                VALUES (${userId}, 'unknown-extension@reprompt.app', 10, 'free', NOW())
                ON CONFLICT (id) DO NOTHING
            `;
        }

        // Store into DB
        await sql`
            INSERT INTO api_keys (user_id, hashed_key, device_name)
            VALUES (${userId}, ${hashedKey}, 'RePrompt Chrome Extension')
        `;

        return NextResponse.json({ apiKey: rawApiKey }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Extension sync error:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
