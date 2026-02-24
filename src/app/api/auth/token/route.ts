import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { sql } from '@/lib/db';
import crypto from 'crypto';

export async function POST() {
    try {
        const authResult = await auth();
        const { userId } = authResult;

        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Generate a cryptographically secure token (64 characters)
        const token = crypto.randomBytes(32).toString('hex');

        // Upsert user and save the permanent API token
        await sql`
            INSERT INTO users (id, email, credits, plan, credits_reset_date, api_token)
            VALUES (${userId}, ${user.emailAddresses[0].emailAddress}, 10, 'free', NOW(), ${token})
            ON CONFLICT (id) DO UPDATE 
            SET api_token = EXCLUDED.api_token, updated_at = NOW()
        `;

        return NextResponse.json({ token });
    } catch (error: any) {
        console.error('Generate token error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
