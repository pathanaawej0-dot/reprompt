import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import crypto from 'crypto';

const JWT_SECRET = process.env.AUTH_SECRET || 'reprompt-fallback-secret-key-1234';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, verifier, deviceName } = body;

        if (!code || !verifier) {
            return NextResponse.json({ error: 'Missing code or verifier' }, { status: 400 });
        }

        const parts = code.split('.');
        if (parts.length !== 2) {
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }

        const [payloadBase64, signature] = parts;
        const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(payloadBase64).digest('base64url');

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: 'Invalid token signature' }, { status: 400 });
        }

        const payloadStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
        const payload = JSON.parse(payloadStr);

        if (Date.now() > payload.exp) {
            return NextResponse.json({ error: 'Code expired' }, { status: 400 });
        }

        // Verify PKCE match (challenge = base64url(sha256(verifier)))
        const expectedChallenge = crypto.createHash('sha256').update(verifier).digest('base64url');

        if (payload.challenge !== expectedChallenge && payload.challenge !== verifier) {
            return NextResponse.json({ error: 'PKCE verification failed' }, { status: 400 });
        }

        // Generate permanent API key
        const rawApiKey = `rp_live_${crypto.randomBytes(32).toString('hex')}`;
        const hashedKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');

        // Ensure user exists locally if somehow bypassed normal creation
        const existingUser = await sql`SELECT id FROM users WHERE id = ${payload.userId}`;
        if (existingUser.length === 0) {
            await sql`
                INSERT INTO users (id, email, credits, plan, credits_reset_date)
                VALUES (${payload.userId}, 'unknown-pkce@reprompt.app', 10, 'free', NOW())
                ON CONFLICT (id) DO NOTHING
            `;
        }

        // Store into DB
        await sql`
            INSERT INTO api_keys (user_id, hashed_key, device_name)
            VALUES (${payload.userId}, ${hashedKey}, ${deviceName || 'RePrompt Desktop App'})
        `;

        return NextResponse.json({ apiKey: rawApiKey });
    } catch (error: any) {
        console.error('Exchange error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
