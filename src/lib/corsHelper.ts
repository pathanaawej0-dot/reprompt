export function getCorsHeaders(req: Request): Record<string, string> {
    const origin = req.headers.get('origin');
    if (origin && origin.startsWith('chrome-extension://')) {
        return {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        };
    }
    return {};
}

export function handleCorsOptions(req: Request) {
    const headers = getCorsHeaders(req);
    // If it's a chrome extension, respond with 204 and CORS headers
    if (Object.keys(headers).length > 0) {
        return new Response(null, { status: 204, headers });
    }
    return new Response(null, { status: 204 });
}
