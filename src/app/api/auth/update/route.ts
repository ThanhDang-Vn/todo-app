import { updateSession } from '@/lib/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const boby = await req.json();

  const { accessToken, refreshToken } = boby;

  if (!accessToken || !refreshToken) return new Response('Provide token', { status: 401 });

  await updateSession({ accessToken, refreshToken });

  return new Response('OK', { status: 200 });	
}
