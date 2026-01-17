import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 보호가 필요한 라우트 정의
const isProtectedRoute = createRouteMatcher([
    '/fortune(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    // 보호된 라우트에 접근 시 인증 요구
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
