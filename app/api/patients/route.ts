import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth';
import { getAllPatients, createPatient } from '@/lib/patients';
import type { SessionData, Patient } from '@/types';

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const patients = await getAllPatients();
  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json() as Omit<Patient, 'id'>;
  
  // Set defaults for arrays if not provided
  data.history = data.history || [];
  data.diagnoses = data.diagnoses || [];
  data.prescriptions = data.prescriptions || [];
  data.vitals = data.vitals || {};
  
  const patient = await createPatient(data);
  return NextResponse.json(patient);
}
