import { redis } from './redis';
import type { Patient } from '@/types';

export async function getAllPatients(): Promise<Patient[]> {
  const patientIds = await redis.get<string[]>('patients:index') || [];
  if (patientIds.length === 0) return [];

  const keys = patientIds.map(id => `patient:${id}`);
  const patients = await redis.mget<Patient[]>(...keys);
  
  return patients.filter((p): p is Patient => p !== null);
}

export async function getPatient(id: string): Promise<Patient | null> {
  return await redis.get<Patient>(`patient:${id}`);
}

export async function createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
  // Get next ID atomically
  const seq = await redis.incr('patients:id_seq');
  const id = `MUL-${seq.toString().padStart(5, '0')}`;
  
  const newPatient: Patient = {
    ...patientData,
    id,
  };

  // Save patient and add to index
  await redis.set(`patient:${id}`, newPatient);
  
  const index = await redis.get<string[]>('patients:index') || [];
  await redis.set('patients:index', [...index, id]);

  return newPatient;
}

export async function updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient | null> {
  const existing = await getPatient(id);
  if (!existing) return null;

  const updated: Patient = { ...existing, ...updateData };
  await redis.set(`patient:${id}`, updated);
  
  return updated;
}
