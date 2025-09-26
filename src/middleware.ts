import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user) return NextResponse.redirect(new URL('/auth/login', req.nextUrl));

  return NextResponse.next();
}

export const config = {
  matcher: ['/upcoming/:path*', '/inbox/:path*'],
};
