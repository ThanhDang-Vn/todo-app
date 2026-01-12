import { authFetch } from '@/lib/authFetch';
import { BACKEND_URL } from '@/lib/constant';
import { deleteSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const response = await authFetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Log out unsuccessfully');
  }
  await deleteSession();

  revalidatePath('/inbox');
  return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
}
