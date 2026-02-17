import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const email = searchParams.get('email');
  const userId = searchParams.get('userId');

  if (!accessToken || !refreshToken || !firstName || !lastName || !email || !userId) {
    throw new Error('Google Oauth failed');
  }

  await createSession({
    user: {
      id: userId,
      name: firstName + lastName,
      email: email,
      
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  redirect('/inbox');
}
