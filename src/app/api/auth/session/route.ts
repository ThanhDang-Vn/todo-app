import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      // return 204 No Content so client knows there's no active session
      return NextResponse.json(null, { status: 204 });
    }

    return NextResponse.json(session, { status: 200 });
  } catch (err) {
    console.error('failed to read session', err);
    return NextResponse.json(null, { status: 500 });
  }
}
