import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { currentUser } from '@clerk/nextjs/server';
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: 'test_mode'
});

export async function POST(req: Request) {
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await currentUser();
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const session = await client.checkoutSessions.create({
            product_cart: [
                {
                    product_id: process.env.NEXT_PUBLIC_DODO_PRODUCT_ID!,
                    quantity: 1
                }
            ],
            customer: {
                email: user.emailAddresses[0].emailAddress,
                name: user.fullName || user.firstName || 'Customer'
            },
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
            metadata: {
                userId: userId
            }
        });

        // The Dodo Payments API normally returns an object containing a redirect URL.
        // It's often in a root `url` field or `paymentLink`. I'll assume `url` based on typical API designs,
        // but we'll log it if it fails.
        const checkoutUrl = Array.isArray(session) ? session[0] : (session as any).paymentLink || (session as any).url || (session as any).checkout_url;

        // If the API changed and we can't find the URL, return the whole payload so we can debug.
        if (!checkoutUrl) {
            console.log("Dodo Payments Session Output:", session);
            return NextResponse.json({ error: 'Failed to find checkout URL in session response', details: session }, { status: 500 });
        }

        return NextResponse.json({ url: checkoutUrl }, { status: 200 });

    } catch (err: any) {
        console.error('Error creating checkout session:', err);
        return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
    }
}
