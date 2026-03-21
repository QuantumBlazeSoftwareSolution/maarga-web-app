import { NextResponse } from 'next/server';

export type ApiHandler = (
  req: Request,
  params?: unknown,
) => Promise<NextResponse> | NextResponse;

/**
 * Proxy-style HOF for authorizations.
 * This is preferred over middleware.ts in this architecture.
 */
export function withAuth(handler: ApiHandler) {
  return async (req: Request, context?: unknown) => {
    try {
      const apiKey = req.headers.get('X-API-KEY');

      if (!apiKey || apiKey !== process.env.DEV_API_KEY) {
        console.warn(`[PROXY] Unauthorized attempt to: ${req.url}`);
        return NextResponse.json(
          { message: 'Unauthorized: Invalid or missing API Key' },
          { status: 401 },
        );
      }

      return await handler(req, context);
    } catch (error) {
      console.error('[PROXY] Internal Error:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 },
      );
    }
  };
}

/**
 * Matcher configuration for reference.
 * Although middleware.ts is not used, these are the paths we protect.
 */
export const proxyConfig = {
  matcher: [
    '/',
    '/login',
    '/admin/:path*',
    '/manager/:path*',
    '/employee/:path*',
    '/api/:path*',
  ],
};
