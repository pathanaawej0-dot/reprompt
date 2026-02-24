import { getVerifiedUserId } from '@/lib/authHelper';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const sql = neon(process.env.DATABASE_URL!);

        // Mock upgrade: Set plan to 'pro', credits to 1500, reset the billing cycle to NOW()
        const result = await sql`
            UPDATE users 
            SET 
                plan = 'pro', 
                credits = 1500, 
                credits_reset_date = NOW(),
                updated_at = NOW()
            WHERE id = ${userId}
            RETURNING id, plan, credits;
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'User not found or upgrade failed' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully upgraded to Pro',
            plan: result[0].plan,
            credits: result[0].credits
        }, { status: 200 });

    } catch (err) {
        console.error('Error upgrading user:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
