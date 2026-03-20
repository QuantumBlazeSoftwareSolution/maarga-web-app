import { NextResponse } from 'next/server';
import { upsertUser } from '@/src/lib/db/user/write';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authId, email, name } = body;

    if (!authId || !email) {
      return NextResponse.json({ error: 'Missing authId or email' }, { status: 400 });
    }

    const user = await upsertUser({
      authId,
      email,
      name,
    });

    if (!user) {
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('API Sync Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
