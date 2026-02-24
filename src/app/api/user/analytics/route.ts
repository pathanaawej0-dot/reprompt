import { getVerifiedUserId } from '@/lib/authHelper';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const sql = neon(process.env.DATABASE_URL!);

        // Aggregate past 7 days of usage
        const daysStats = await sql`
            SELECT 
                TO_CHAR(timestamp, 'YYYY-MM-DD') as date,
                COUNT(id) as prompts_optimized,
                SUM(prompt_tokens) as total_prompt_tokens,
                SUM(completion_tokens) as total_completion_tokens
            FROM usage_logs
            WHERE user_id = ${userId}
            AND timestamp >= NOW() - INTERVAL '7 days'
            GROUP BY TO_CHAR(timestamp, 'YYYY-MM-DD')
            ORDER BY date ASC;
        `;

        const totalStats = await sql`
            SELECT 
                COUNT(id) as total_prompts,
                COALESCE(SUM(prompt_tokens), 0) as total_prompt_tokens,
                COALESCE(SUM(completion_tokens), 0) as total_completion_tokens
            FROM usage_logs
            WHERE user_id = ${userId};
        `;

        // Format dates correctly, filling in blanks if a day had zero usage.
        const past7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const chartData = past7Days.map(dateLabel => {
            const foundNode = daysStats.find(d => d.date === dateLabel);
            return {
                date: dateLabel,
                promptsOptimized: foundNode ? parseInt(foundNode.prompts_optimized) : 0,
                promptTokens: foundNode ? parseInt(foundNode.total_prompt_tokens) : 0,
                completionTokens: foundNode ? parseInt(foundNode.total_completion_tokens) : 0
            };
        });

        return NextResponse.json({
            success: true,
            chartData,
            total: {
                prompts: parseInt(totalStats[0].total_prompts) || 0,
                promptTokens: parseInt(totalStats[0].total_prompt_tokens) || 0,
                completionTokens: parseInt(totalStats[0].total_completion_tokens) || 0
            }
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error fetching analytics:', err);
        return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
    }
}
