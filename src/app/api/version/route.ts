import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        version: '2.1.4', // Current production version
        downloadUrl: 'https://reprompt-one.vercel.app/download'
    });
}
