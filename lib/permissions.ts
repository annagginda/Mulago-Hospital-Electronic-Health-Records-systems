import type { Role, View, Capability } from '@/types';

export const VIEW_PERMISSIONS: Record<Role, View[]> = {
  'Administrator':   ['dashboard', 'patients', 'clinical', 'reports', 'settings'],
  'Records Officer': ['dashboard', 'patients'],
  'Doctor':          ['dashboard', 'patients', 'clinical'],
  'Pharmacist':      ['dashboard', 'clinical'],
  'Nurse':           ['dashboard', 'patients', 'clinical'],
};

export const CAPABILITIES: Record<Role, Capability[]> = {
  'Administrator':   ['canVitals', 'canDiagnose', 'canPrescribe', 'canEditRoom'],
  'Records Officer': ['canEditRoom'],
  'Doctor':          ['canVitals', 'canDiagnose', 'canPrescribe'],
  'Pharmacist':      ['canDispense'],
  'Nurse':           ['canVitals', 'canEditRoom'],
};

export const NAV_ITEMS: { view: View; label: string }[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'patients',  label: 'Patient Management' },
  { view: 'clinical',  label: 'Clinical' },
  { view: 'reports',   label: 'Reports & Analytics' },
  { view: 'settings',  label: 'System Settings' },
];

export const PAGE_TITLES: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard',            subtitle: 'Overview of hospital activity' },
  patients:  { title: 'Patient Management',   subtitle: 'Register and manage patient records' },
  clinical:  { title: 'Clinical',             subtitle: 'Medical history, diagnoses & prescriptions' },
  reports:   { title: 'Reports & Analytics',  subtitle: 'System-wide summary statistics' },
  settings:  { title: 'System Settings',      subtitle: 'Users, profile and preferences' },
};

export const can = (role: Role, view: View): boolean =>
  VIEW_PERMISSIONS[role]?.includes(view) ?? false;

export const hasCapability = (role: Role, cap: Capability): boolean =>
  CAPABILITIES[role]?.includes(cap) ?? false;
