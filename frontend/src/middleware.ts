import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect /employee routes
    if (request.nextUrl.pathname.startsWith('/employee')) {
        // Check if user is authenticated by looking at cookies or headers
        // For now, we'll let the client-side handle this
        // This middleware is just a placeholder for future server-side auth
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/employee/:path*'],
};
