import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // 1. If trying to access dashboard but no session exists
  if (pathname.startsWith('/developer-back-door/dashboard')) {
    if (!session) {
      const url = new URL('/developer-back-door/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // 2. If trying to access login or otp but session ALREADY exists
  if (
    pathname === '/developer-back-door/login' ||
    pathname === '/developer-back-door/otp'
  ) {
    if (session) {
      const url = new URL('/developer-back-door/dashboard', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/developer-back-door/:path*'],
};
