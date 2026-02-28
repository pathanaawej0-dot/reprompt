import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/authHelper';
import { getCorsHeaders, handleCorsOptions } from '@/lib/corsHelper';
import { sql } from '@/lib/db';
import { builtInAgents } from '@/lib/defaultAgents';

export async function OPTIONS(req: Request) {
    return handleCorsOptions(req);
}

export async function GET(req: Request) {
    const corsHeaders = getCorsHeaders(req);
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        // Multi-stage seeding: ensure ALL built-in agents exist for this user in the DB
        for (const agent of builtInAgents) {
            const agentId = `${agent.id}_${userId}`;
            await sql`
                INSERT INTO agents (
                    id, user_id, name, shortcut, shortcut_key, system_prompt, 
                    is_built_in, enabled, icon, updated_at
                )
                VALUES (
                    ${agentId}, ${userId}, ${agent.name}, ${agent.shortcut}, ${agent.shortcut_key}, 
                    ${agent.system_prompt}, ${agent.is_built_in}, ${agent.enabled}, 
                    ${agent.icon}, NOW()
                )
                ON CONFLICT (id) DO NOTHING
            `;
        }

        const finalAgents = await sql`
            SELECT * FROM agents WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
        return NextResponse.json({ agents: finalAgents }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Fetch agents error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(req: Request) {
    const corsHeaders = getCorsHeaders(req);
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        const body = await req.json();
        const { id, name, shortcut, shortcut_key, system_prompt, is_built_in, enabled, icon, parent_id } = body;

        if (!id || !name || !system_prompt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
        }

        // Check for duplicate shortcut_key for this user
        if (shortcut_key) {
            const existing = await sql`
                SELECT id, name FROM agents 
                WHERE user_id = ${userId} 
                AND UPPER(shortcut_key) = ${shortcut_key.toUpperCase()} 
                AND id != ${id}
            `;
            if (existing.length > 0) {
                return NextResponse.json({
                    error: `Shortcut 'Alt+Shift+${shortcut_key.toUpperCase()}' is already used by agent "${existing[0].name}".`
                }, { status: 409, headers: corsHeaders });
            }
        }

        await sql`
            INSERT INTO agents (
                id, user_id, name, shortcut, shortcut_key, system_prompt, 
                is_built_in, enabled, icon, parent_id, updated_at
            )
            VALUES (
                ${id}, ${userId}, ${name}, ${shortcut || null}, ${shortcut_key || null}, 
                ${system_prompt}, ${is_built_in || false}, ${enabled !== false}, 
                ${icon || null}, ${parent_id || null}, NOW()
            )
            ON CONFLICT (id) DO UPDATE 
            SET
                name = EXCLUDED.name,
                shortcut = EXCLUDED.shortcut,
                shortcut_key = EXCLUDED.shortcut_key,
                system_prompt = EXCLUDED.system_prompt,
                enabled = EXCLUDED.enabled,
                icon = EXCLUDED.icon,
                updated_at = NOW()
        `;

        return NextResponse.json({ success: true, agentId: id }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Upsert agent error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}

export async function DELETE(req: Request) {
    const corsHeaders = getCorsHeaders(req);
    try {
        const userId = await getVerifiedUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Agent ID required' }, { status: 400, headers: corsHeaders });

        await sql`DELETE FROM agents WHERE id = ${id} AND user_id = ${userId}`;

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error: any) {
        console.error('Delete agent error:', error);
        return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}
