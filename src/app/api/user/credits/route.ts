import { getVerifiedUserId } from '@/lib/authHelper';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const sql = neon(process.env.DATABASE_URL!);

        // Fetch user credits and api token
        const users = await sql`
      SELECT credits, plan, api_token FROM users WHERE id = ${userId}
    `;

        if (users.length === 0) {
            // If user doesn't exist yet (webhook delay), return default
            return NextResponse.json({ credits: 100 }, { status: 200 });
        }

        return NextResponse.json({
            credits: users[0].credits,
            plan: users[0].plan,
            api_token: users[0].api_token
        }, { status: 200 });
    } catch (err) {
        console.error('Error fetching credits:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
