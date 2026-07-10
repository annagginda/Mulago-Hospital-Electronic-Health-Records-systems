import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth';
import { getUser, createUser } from '@/lib/users';
import type { SessionData, Role, User } from '@/types';

export async function POST(request: Request) {
  try {
    const { name, username, password, role } = await request.json();

    if (!name || !username || !password || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await getUser(username);

    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }

    // Generate initials from name (e.g. "Dr. Sarah Nakato" -> "SN")
    const words = name.replace(/Dr\.\s/i, '').split(' ').filter(Boolean);
    const initials = words.length > 1 
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : `${words[0][0]}`.toUpperCase();

    const newUser: User = {
      id: `usr_${Date.now()}`,
      username,
      password,
      name,
      initials,
      role: role as Role,
      active: true,
      createdAt: new Date().toISOString()
    };

    await createUser(newUser);

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    session.userId = newUser.id;
    session.username = newUser.username;
    session.name = newUser.name;
    session.initials = newUser.initials;
    session.role = newUser.role;

    await session.save();

    return NextResponse.json({ ok: true, user: session });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
