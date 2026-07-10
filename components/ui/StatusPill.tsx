import type { PatientStatus, PrescriptionStatus } from '@/types';

type StatusType = PatientStatus | PrescriptionStatus;

const STATUS_STYLES: Record<StatusType, string> = {
  Outpatient: 'text-brand bg-brand-active',
  Admitted:   'text-status-successFg bg-status-successBg',
  Discharged: 'text-status-neutralFg bg-status-neutralBg',
  Critical:   'text-status-errorFg bg-status-errorBg',
  pending:    'text-status-warningFg bg-status-warningBg border border-[#efe2bd]',
  dispensed:  'text-status-successFg bg-status-successBg',
};

export function StatusPill({ status }: { status: StatusType }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status] ?? 'text-txt-muted bg-surface-shell'}`}
    >
      {status}
    </span>
  );
}
