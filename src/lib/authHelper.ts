import { auth } from '@clerk/nextjs/server';
import { sql } from '@/lib/db';
import crypto from 'crypto';

export async function getVerifiedUserId(req: Request): Promise<string | null> {
    // 1. Try Clerk Web Session
    const authResult = await auth().catch(() => ({ userId: null }));
    if (authResult && authResult.userId) {
        return authResult.userId;
    }

    // 2. Try Desktop API PAT
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');

        try {
            // Hash the incoming token to match the database
            const hashedKey = crypto.createHash('sha256').update(token).digest('hex');

            // Check the key and update last_used in a single query
            const dbMatch = await sql`
                UPDATE api_keys
                SET last_used = NOW()
                WHERE hashed_key = ${hashedKey}
                RETURNING user_id
            `;

            if (dbMatch.length > 0) {
                return dbMatch[0].user_id;
            }
        } catch (error) {
            console.error('API Key validation error:', error);
        }
    }

    return null;
}
