export type Role = 'Administrator' | 'Records Officer' | 'Doctor' | 'Pharmacist' | 'Nurse';
export type PatientStatus = 'Outpatient' | 'Admitted' | 'Discharged' | 'Critical';
export type PrescriptionStatus = 'pending' | 'dispensed';
export type View = 'dashboard' | 'patients' | 'clinical' | 'reports' | 'settings';
export type Capability = 'canVitals' | 'canDiagnose' | 'canPrescribe' | 'canDispense' | 'canEditRoom';

export interface Vitals {
  bp: string;
  temp: string;
  pulse: string;
  weight: string;
  recordedBy: string;
  recordedAt: string;
}

export interface HistoryEntry {
  date: string;
  note: string;
  by: string;
}

export interface Diagnosis {
  date: string;
  code: string;
  detail: string;
  doctor: string;
}

export interface Prescription {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: PrescriptionStatus;
  by: string;
  date: string;
  dispensedBy?: string;
  dispensedOn?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dob: string;
  age: number;
  contact: string;
  bloodGroup: string;
  nin?: string;
  address: string;
  status: PatientStatus;
  room: string;
  roomUpdatedBy?: string;
  roomUpdatedAt?: string;
  registeredOn: string;
  vitals: Vitals | Record<string, never>;
  history: HistoryEntry[];
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  initials: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface SessionData {
  userId: string;
  username: string;
  name: string;
  initials: string;
  role: Role;
}
