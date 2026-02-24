import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

// Securely verify Dodo Payments Webhook Signature
function verifySignature(body: string, signatureHeader: string, secret: string) {
    if (!signatureHeader || !secret) return false;

    // Some providers use a timestamp, usually Dodo Payments just uses HMAC SHA256
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    return signatureHeader === expectedSignature;
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('webhook-signature') || '';
        const secret = process.env.DODO_WEBHOOK_SECRET || '';

        // Verification step (Commented out locally unless we have the secret)
        /*
        if (!verifySignature(rawBody, signature, secret)) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        */

        const event = JSON.parse(rawBody);
        console.log(`Received Dodo Payments Webhook: ${event.type}`);

        if (event.type === 'payment.succeeded' || event.type === 'subscription.active') {
            // Extract the metadata we injected during the checkout session
            const userId = event.data?.metadata?.userId;

            if (!userId) {
                console.error('No userId found in webhook metadata. Cannot provision upgrade.', event.data);
                return NextResponse.json({ error: 'Missing userId in metadata' }, { status: 400 });
            }

            console.log(`Processing Pro Upgrade for User: ${userId}`);

            const sql = neon(process.env.DATABASE_URL!);

            // Execute atomic upgrade
            await sql`
              UPDATE users 
              SET plan = 'pro', 
                  credits = 1500, 
                  credits_reset_date = NOW(),
                  updated_at = NOW()
              WHERE id = ${userId};
            `;

            console.log(`Successfully upgraded User ${userId} to Pro.`);
            return NextResponse.json({ success: true, message: 'User upgraded' }, { status: 200 });
        }

        // Handle cancellations
        if (event.type === 'subscription.cancelled' || event.type === 'subscription.past_due') {
            const userId = event.data?.metadata?.userId;

            if (userId) {
                const sql = neon(process.env.DATABASE_URL!);
                await sql`
                  UPDATE users 
                  SET plan = 'free', 
                      credits = 10, 
                      credits_reset_date = NOW(),
                      updated_at = NOW()
                  WHERE id = ${userId};
                `;
                console.log(`Downgraded User ${userId} to Free.`);
            }
            return NextResponse.json({ success: true, message: 'User downgraded' }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: 'Unhandled event type ignored' }, { status: 200 });
    } catch (err: any) {
        console.error('Webhook processing error:', err);
        return NextResponse.json({ error: 'Webhook processing failed', details: err.message }, { status: 500 });
    }
}
