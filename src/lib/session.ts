'use server';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type session = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

const secretSession = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretSession);

export async function createSession(payload: session) {
  const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expireAt)
    .sign(encodedKey);

  (await cookies()).set('session-action', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expireAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookie = (await cookies()).get('session-action')?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as session;
  } catch (error) {
    console.error('Failed to verify session: ', error);
    redirect('/auth/login');
  }
}

export async function deleteSession() {
  (await cookies()).delete('session-action');
}

export async function updateSession({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  const cookie = (await cookies()).get('session-action')?.value;

  if (!cookie) return null;

  const { payload } = await jwtVerify<session>(cookie, encodedKey);

  if (!payload) throw new Error('Session not found');

  const newPayload: session = {
    user: {
      ...payload.user,
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  await createSession(newPayload);
}
