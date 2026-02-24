import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { sql } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const keys = await sql`
            SELECT id, device_name, created_at, last_used 
            FROM api_keys 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;
        return NextResponse.json({ keys });
    } catch (error: any) {
        console.error('Fetch keys error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Key ID required' }, { status: 400 });

        await sql`DELETE FROM api_keys WHERE id = ${id} AND user_id = ${userId}`;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete key error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
