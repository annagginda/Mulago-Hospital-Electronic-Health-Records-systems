'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import useSWR from 'swr';
import type { Patient } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ReportsPage() {
  const { data: patients, isLoading } = useSWR<Patient[]>('/api/patients', fetcher);

  if (isLoading || !patients) return <div>Loading reports...</div>;

  const totalPatients = patients.length;
  const totalDiagnoses = patients.reduce((acc, p) => acc + (p.diagnoses?.length || 0), 0);
  const totalRx = patients.reduce((acc, p) => acc + (p.prescriptions?.length || 0), 0);
  const dispensedRx = patients.reduce((acc, p) => acc + (p.prescriptions?.filter(r => r.status === 'dispensed').length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <p className="text-[11px] font-semibold text-txt-muted uppercase tracking-wide">Total Patients</p>
          <p className="text-3xl font-bold text-txt-primary mt-2 tabular">{totalPatients}</p>
        </Card>
        
        <Card className="flex flex-col">
          <p className="text-[11px] font-semibold text-txt-muted uppercase tracking-wide">Total Diagnoses</p>
          <p className="text-3xl font-bold text-txt-primary mt-2 tabular">{totalDiagnoses}</p>
        </Card>

        <Card className="flex flex-col">
          <p className="text-[11px] font-semibold text-txt-muted uppercase tracking-wide">Prescriptions Issued</p>
          <p className="text-3xl font-bold text-txt-primary mt-2 tabular">{totalRx}</p>
        </Card>

        <Card className="flex flex-col border-b-4 border-b-status-successFg">
          <p className="text-[11px] font-semibold text-txt-muted uppercase tracking-wide">Dispensed</p>
          <p className="text-3xl font-bold text-txt-primary mt-2 tabular">{dispensedRx}</p>
        </Card>
      </div>

      {/* Placeholder for actual charts */}
      <Card className="h-[400px] flex items-center justify-center border-dashed">
        <p className="text-txt-muted">Visual charts will be rendered here.</p>
      </Card>
    </div>
  );
}
