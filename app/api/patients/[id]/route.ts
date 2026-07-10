import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth';
import { getPatient, updatePatient } from '@/lib/patients';
import type { SessionData, Patient } from '@/types';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const patient = await getPatient(id);
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(patient);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json() as Partial<Patient>;
  const updated = await updatePatient(id, data);
  
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json(updated);
}
