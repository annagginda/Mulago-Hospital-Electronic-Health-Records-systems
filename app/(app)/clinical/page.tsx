'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { Input, Textarea } from '@/components/ui/Input';
import useSWR, { useSWRConfig } from 'swr';
import type { Patient, Prescription } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ClinicalPage({ searchParams }: { searchParams: { patientId?: string } }) {
  const { mutate } = useSWRConfig();
  const { data: patients, isLoading } = useSWR<Patient[]>('/api/patients', fetcher);
  
  const [activeTab, setActiveTab] = useState<'record' | 'queue'>('record');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(searchParams.patientId || null);

  // Forms
  const [vitals, setVitals] = useState({ bp: '', temp: '', pulse: '', weight: '' });
  const [dx, setDx] = useState({ code: '', detail: '' });
  const [rx, setRx] = useState({ drug: '', dosage: '', frequency: '', duration: '' });

  if (isLoading || !patients) return <div>Loading...</div>;

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Dispensing queue is derived from all pending prescriptions
  const queue = patients.flatMap(p => 
    (p.prescriptions || [])
      .filter(rx => rx.status === 'pending')
      .map(rx => ({ ...rx, patientId: p.id, patientName: `${p.firstName} ${p.lastName}` }))
  );

  const handleUpdateVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    await fetch(`/api/patients/${selectedPatient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vitals: { ...vitals, recordedBy: 'System User', recordedAt: new Date().toISOString().split('T')[0] }
      }),
    });
    
    setVitals({ bp: '', temp: '', pulse: '', weight: '' });
    mutate('/api/patients');
  };

  const handleAddDx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !dx.detail) return;

    await fetch(`/api/patients/${selectedPatient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diagnoses: [
          ...(selectedPatient.diagnoses || []),
          { code: dx.code, detail: dx.detail, doctor: 'System User', date: new Date().toISOString().split('T')[0] }
        ]
      }),
    });

    setDx({ code: '', detail: '' });
    mutate('/api/patients');
  };

  const handleAddRx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !rx.drug || !rx.dosage) return;

    await fetch(`/api/patients/${selectedPatient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prescriptions: [
          ...(selectedPatient.prescriptions || []),
          { 
            drug: rx.drug, dosage: rx.dosage, frequency: rx.frequency || 'As directed', duration: rx.duration || '—',
            status: 'pending', by: 'System User', date: new Date().toISOString().split('T')[0]
          }
        ]
      }),
    });

    setRx({ drug: '', dosage: '', frequency: '', duration: '' });
    mutate('/api/patients');
  };

  const handleDispense = async (patientId: string, rxIndex: number) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient || !patient.prescriptions) return;

    const newRx = [...patient.prescriptions];
    newRx[rxIndex].status = 'dispensed';
    newRx[rxIndex].dispensedBy = 'Pharmacist';
    newRx[rxIndex].dispensedOn = new Date().toISOString().split('T')[0];

    await fetch(`/api/patients/${patientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prescriptions: newRx }),
    });

    mutate('/api/patients');
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-border-outer">
        <button 
          onClick={() => setActiveTab('record')} 
          className={`px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.05em] transition-colors border-b-[3px] ${activeTab === 'record' ? 'border-brand text-brand' : 'border-transparent text-txt-secondary hover:text-txt-primary'}`}
        >
          Patient Record
        </button>
        <button 
          onClick={() => setActiveTab('queue')} 
          className={`px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.05em] transition-colors border-b-[3px] ${activeTab === 'queue' ? 'border-brand text-brand' : 'border-transparent text-txt-secondary hover:text-txt-primary'}`}
        >
          Dispensing Queue <span className="font-mono bg-status-warningBg text-status-warningFg px-1.5 py-0.5 ml-2 border border-[#efe2bd]">{queue.length}</span>
        </button>
      </div>

      {activeTab === 'record' && (
        !selectedPatient ? (
          <Card>
            <div className="mb-6">
              <h3 className="font-semibold text-[15px] text-txt-primary">Select a patient to view their record</h3>
              <p className="text-[13px] text-txt-muted mt-1">Choose a patient below to access medical history, diagnoses and prescriptions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {patients.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedPatientId(p.id)}
                  className="p-3.5 border border-border-outer hover:border-brand hover:bg-surface-shell cursor-pointer transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-brand-active text-brand-navy flex items-center justify-center font-mono font-semibold text-[13px] shrink-0">
                    {p.firstName[0]}{p.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] text-txt-primary truncate">{p.firstName} {p.lastName}</div>
                    <div className="font-medium text-[11px] text-brand tabular mt-0.5">{p.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-5.5">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-[54px] h-[54px] bg-brand text-white flex items-center justify-center font-mono font-bold text-[18px]">
                    {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[20px] text-txt-primary leading-none">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                      <StatusPill status={selectedPatient.status} />
                    </div>
                    <div className="font-medium text-[13px] text-brand tabular mt-2">{selectedPatient.id}</div>
                  </div>
                </div>
                <Button variant="secondary" onClick={() => setSelectedPatientId(null)}>← Back to list</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-[1px] bg-border-inner border border-border-inner mt-5">
                <div className="bg-white p-3"><div className="text-[10px] font-semibold text-txt-placeholder uppercase tracking-[0.05em]">Gender</div><div className="text-[14px] font-medium text-txt-primary mt-1">{selectedPatient.gender}</div></div>
                <div className="bg-white p-3"><div className="text-[10px] font-semibold text-txt-placeholder uppercase tracking-[0.05em]">Date of Birth</div><div className="text-[14px] font-medium text-txt-primary tabular mt-1">{selectedPatient.dob}</div></div>
                <div className="bg-white p-3"><div className="text-[10px] font-semibold text-txt-placeholder uppercase tracking-[0.05em]">Contact</div><div className="text-[14px] font-medium text-txt-primary tabular mt-1">{selectedPatient.contact}</div></div>
                <div className="bg-white p-3"><div className="text-[10px] font-semibold text-txt-placeholder uppercase tracking-[0.05em]">Blood Group</div><div className="text-[14px] font-medium text-txt-primary mt-1">{selectedPatient.bloodGroup || '—'}</div></div>
                <div className="bg-brand-active p-3 md:col-span-2"><div className="text-[10px] font-semibold text-brand uppercase tracking-[0.05em]">Room / Ward</div><div className="text-[14px] font-bold text-brand-navy tabular mt-1">{selectedPatient.room}</div></div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
              <div className="lg:col-span-3 space-y-5">
                <Card padding={false}>
                  <div className="px-5 py-3.5 border-b border-border-inner font-semibold text-[14px] text-txt-primary">Latest Vital Signs</div>
                  {selectedPatient.vitals ? (
                    <>
                      <div className="grid grid-cols-4 gap-[1px] bg-border-inner">
                        <div className="bg-white p-4 text-center"><div className="font-semibold text-[24px] text-brand-navy tabular leading-none">{selectedPatient.vitals.bp}</div><div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-txt-placeholder mt-2">BP mmHg</div></div>
                        <div className="bg-white p-4 text-center"><div className="font-semibold text-[24px] text-brand-navy tabular leading-none">{selectedPatient.vitals.temp}</div><div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-txt-placeholder mt-2">Temp °C</div></div>
                        <div className="bg-white p-4 text-center"><div className="font-semibold text-[24px] text-brand-navy tabular leading-none">{selectedPatient.vitals.pulse}</div><div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-txt-placeholder mt-2">Pulse bpm</div></div>
                        <div className="bg-white p-4 text-center"><div className="font-semibold text-[24px] text-brand-navy tabular leading-none">{selectedPatient.vitals.weight}</div><div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-txt-placeholder mt-2">Weight kg</div></div>
                      </div>
                      <div className="px-5 py-2.5 text-[11px] text-txt-placeholder border-t border-border-inner bg-white">Recorded by {selectedPatient.vitals.recordedBy} · {selectedPatient.vitals.recordedAt}</div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-[13px] text-txt-placeholder">No vital signs recorded yet.</div>
                  )}
                </Card>

                <Card padding={false}>
                  <div className="px-5 py-3.5 border-b border-border-inner font-semibold text-[14px] text-txt-primary">Diagnoses</div>
                  {selectedPatient.diagnoses && selectedPatient.diagnoses.length > 0 ? (
                    <div className="divide-y divide-surface-shell">
                      {selectedPatient.diagnoses.map((d, i) => (
                        <div key={i} className="p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-[13px] text-txt-primary">{d.detail}</span>
                            {d.code && <span className="font-medium text-[11px] text-brand bg-brand-active px-2 py-0.5">{d.code}</span>}
                          </div>
                          <div className="text-[11px] text-txt-placeholder mt-1.5">{d.doctor} · {d.date}</div>
                        </div>
                      ))}
                    </div>
                  ) : <div className="p-6 text-center text-[13px] text-txt-placeholder">No diagnoses recorded.</div>}
                </Card>

                <Card padding={false}>
                  <div className="px-5 py-3.5 border-b border-border-inner font-semibold text-[14px] text-txt-primary">Prescriptions</div>
                  {selectedPatient.prescriptions && selectedPatient.prescriptions.length > 0 ? (
                    <div className="divide-y divide-surface-shell">
                      {selectedPatient.prescriptions.map((r, i) => (
                        <div key={i} className="p-4 bg-white flex justify-between items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-semibold text-[13px] text-txt-primary">{r.drug}</span>
                              <StatusPill status={r.status} />
                            </div>
                            <div className="text-[12px] text-txt-muted mt-1">{r.dosage} · {r.frequency} · {r.duration}</div>
                            <div className="text-[11px] text-txt-placeholder mt-1">{r.by} · {r.date}</div>
                          </div>
                          {r.status === 'pending' && (
                            <button 
                              onClick={() => handleDispense(selectedPatient.id, i)}
                              className="bg-status-successFg text-white px-[14px] py-[8px] font-semibold text-[11px] uppercase tracking-[0.04em] hover:bg-[#266340] transition-colors"
                            >
                              Dispense
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : <div className="p-6 text-center text-[13px] text-txt-placeholder">No prescriptions on record.</div>}
                </Card>
              </div>

              {/* Action Panel */}
              <div className="lg:col-span-2 space-y-5">
                <Card padding={false}>
                  <div className="px-5 py-3.5 border-b border-border-inner font-semibold text-[13px] text-txt-primary flex items-center gap-2">
                    <span className="w-[7px] h-[7px] bg-brand block"></span>
                    Update Vital Signs
                  </div>
                  <form onSubmit={handleUpdateVitals} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Blood Pressure" placeholder="120/80" value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} />
                      <Input label="Temp °C" placeholder="37.0" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} />
                      <Input label="Pulse bpm" placeholder="72" value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} />
                      <Input label="Weight kg" placeholder="68" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} />
                    </div>
                    <Button type="submit" className="w-full">Save Vitals</Button>
                  </form>
                </Card>

                <Card padding={false}>
                  <div className="px-5 py-3.5 border-b border-border-inner font-semibold text-[13px] text-txt-primary flex items-center gap-2">
                    <span className="w-[7px] h-[7px] bg-brand block"></span>
                    Record Diagnosis
                  </div>
                  <form onSubmit={handleAddDx} className="p-5 space-y-4">
                    <Input label="ICD Code (optional)" placeholder="e.g. B50" value={dx.code} onChange={e => setDx({...dx, code: e.target.value})} />
                    <Textarea label="Diagnosis Details" placeholder="Clinical findings..." value={dx.detail} onChange={e => setDx({...dx, detail: e.target.value})} required />
                    <Button type="submit" className="w-full">Add Diagnosis</Button>
                  </form>
                </Card>

                <Card padding={false}>
                  <div className="px-5 py-3.5 border-b border-border-inner font-semibold text-[13px] text-txt-primary flex items-center gap-2">
                    <span className="w-[7px] h-[7px] bg-brand block"></span>
                    Prescribe Medication
                  </div>
                  <form onSubmit={handleAddRx} className="p-5 space-y-4">
                    <Input label="Drug Name" placeholder="e.g. Paracetamol" value={rx.drug} onChange={e => setRx({...rx, drug: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Dosage" placeholder="500mg" value={rx.dosage} onChange={e => setRx({...rx, dosage: e.target.value})} required />
                      <Input label="Frequency" placeholder="Twice daily" value={rx.frequency} onChange={e => setRx({...rx, frequency: e.target.value})} />
                    </div>
                    <Input label="Duration" placeholder="5 days" value={rx.duration} onChange={e => setRx({...rx, duration: e.target.value})} />
                    <Button type="submit" className="w-full">Add Prescription</Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        )
      )}

      {activeTab === 'queue' && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-border-inner flex justify-between items-center bg-white">
            <span className="font-semibold text-[14px] text-txt-primary">Pending Prescriptions — Dispensing Queue</span>
            <span className="font-semibold text-[11px] bg-status-warningBg text-status-warningFg border border-[#efe2bd] px-2.5 py-1 tabular">{queue.length} pending</span>
          </div>
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-shell text-txt-secondary text-[10px] uppercase tracking-[0.06em] font-semibold">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Drug</th>
                  <th className="px-5 py-3">Dosage</th>
                  <th className="px-5 py-3">Frequency</th>
                  <th className="px-5 py-3">Prescribed By</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider">
                {queue.map((q, i) => {
                  const originalIndex = patients.find(p => p.id === q.patientId)?.prescriptions?.findIndex(r => r.drug === q.drug && r.status === 'pending') ?? -1;
                  return (
                  <tr key={i} className="hover:bg-surface-shell/50 transition-colors">
                    <td className="px-5 py-3.5"><div className="font-medium text-[13px] text-txt-primary">{q.patientName}</div><div className="font-medium text-[11px] text-brand tabular mt-0.5">{q.patientId}</div></td>
                    <td className="px-5 py-3.5 font-semibold text-[13px] text-txt-primary">{q.drug}</td>
                    <td className="px-5 py-3.5 text-[13px] text-txt-secondary">{q.dosage}</td>
                    <td className="px-5 py-3.5 text-[13px] text-txt-secondary">{q.frequency}</td>
                    <td className="px-5 py-3.5 text-[12px] text-txt-muted">{q.by}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => handleDispense(q.patientId, originalIndex)}
                        className="bg-status-successFg text-white px-4 py-2 font-semibold text-[11px] uppercase tracking-[0.04em] hover:bg-[#266340] transition-colors"
                      >
                        Dispense
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
            {queue.length === 0 && (
              <div className="p-11 text-center text-[13px] text-txt-placeholder">
                The dispensing queue is clear — no pending prescriptions.
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
