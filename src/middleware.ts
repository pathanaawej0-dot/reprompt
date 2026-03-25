import { clerkMiddleware } from "@clerk/nextjs/server";

// We let the individual API routes handle their own auth() checks
// so they can return proper 401 JSON responses instead of Clerk's default
// redirect-to-sign-in behavior (which causes 404s in the Electron fetch client).
export default clerkMiddleware((auth, req) => {
    // Allow /api and /auth-sync routes to be public so the Desktop app can 
    // send Bearer tokens or perform PKCE sync without being blocked by Clerk's
    // default redirect-to-login behavior.
    const isPublicRoute = req.nextUrl.pathname.startsWith('/api') || 
                         req.nextUrl.pathname.startsWith('/auth-sync');

    if (!isPublicRoute) {
        auth.protect();
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
