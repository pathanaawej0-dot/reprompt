import { clerkMiddleware } from "@clerk/nextjs/server";

// We let the individual API routes handle their own auth() checks
// so they can return proper 401 JSON responses instead of Clerk's default
// redirect-to-sign-in behavior (which causes 404s in the Electron fetch client).
export default clerkMiddleware();

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
