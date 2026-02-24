import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses } = evt.data;
        const email = email_addresses && email_addresses[0] ? email_addresses[0].email_address : null;

        try {
            await sql`
            INSERT INTO users (id, email, credits, plan, credits_reset_date) 
            VALUES (${id}, ${email}, 100, 'free', NOW())
            ON CONFLICT (id) DO NOTHING
        `;
            console.log(`User ${id} created in Neon DB`);
        } catch (err) {
            console.error('Failed to create Neon DB user:', err);
            return NextResponse.json({ error: 'DB Insert Failed' }, { status: 500 });
        }
    }

    return new Response('', { status: 200 })
}
