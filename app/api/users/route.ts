import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth';
import { getAllUsers } from '@/lib/users';
import type { SessionData } from '@/types';

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Only admins can see users realistically, but we just return them for the Settings page
  if (session.role !== 'Administrator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await getAllUsers();
  // Strip passwords before sending to client
  const safeUsers = users.map(({ password, ...u }) => u);
  return NextResponse.json(safeUsers);
}
