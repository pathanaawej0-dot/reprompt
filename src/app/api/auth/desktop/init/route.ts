import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

const JWT_SECRET = process.env.AUTH_SECRET || 'reprompt-fallback-secret-key-1234';

export async function POST(req: Request) {
    try {
        const authResult = await auth();
        const userId = authResult.userId;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { challenge } = body;

        if (!challenge) {
            return NextResponse.json({ error: 'Missing challenge' }, { status: 400 });
        }

        // Create a JWT-like auth code valid for 2 minutes
        const payload = Buffer.from(JSON.stringify({
            userId,
            challenge,
            exp: Date.now() + 2 * 60 * 1000
        })).toString('base64url');

        const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url');
        const authCode = `${payload}.${signature}`;

        return NextResponse.json({ authCode });
    } catch (error: any) {
        console.error('Desktop init error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
