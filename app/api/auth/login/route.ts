import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth';
import { getUser } from '@/lib/users';
import type { SessionData } from '@/types';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
    }

    const user = await getUser(username);

    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.active) {
      return NextResponse.json({ message: 'Account is inactive' }, { status: 403 });
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    session.userId = user.id;
    session.username = user.username;
    session.name = user.name;
    session.initials = user.initials;
    session.role = user.role;

    await session.save();

    return NextResponse.json({ ok: true, user: session });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
