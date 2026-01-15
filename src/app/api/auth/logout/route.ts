import { authFetch } from '@/lib/authFetch';
import { BACKEND_URL } from '@/lib/constant';
import { deleteSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = await authFetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }

  await deleteSession();

  revalidatePath('/inbox');
  return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
}
