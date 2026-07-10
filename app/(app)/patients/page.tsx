'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { SlideOver } from '@/components/ui/SlideOver';
import useSWR, { useSWRConfig } from 'swr';
import type { Patient } from '@/types';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PatientsPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: patients, isLoading } = useSWR<Patient[]>('/api/patients', fetcher);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Outpatient' | 'Admitted' | 'Discharged'>('All');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    contact: '',
    bloodGroup: '',
    nin: '',
    address: '',
    room: '',
  });

  if (isLoading || !patients) return <div>Loading...</div>;

  const filtered = patients.filter(p => {
    if (filter !== 'All' && p.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.firstName.toLowerCase().includes(q) || 
             p.lastName.toLowerCase().includes(q) ||
             p.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.dob) return;

    await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    mutate('/api/patients');
    setIsRegisterOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex bg-white border border-border-outer">
            {['All', 'Outpatient', 'Admitted', 'Discharged'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filter === f ? 'bg-brand text-white' : 'text-txt-secondary hover:bg-surface-shell'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={() => setIsRegisterOpen(true)}>+ Register Patient</Button>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-shell text-txt-secondary text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Patient ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Date of Birth</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Room / Ward</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-surface-shell/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-brand tabular">{p.id}</td>
                  <td className="px-5 py-3 font-semibold text-txt-primary">{p.firstName} {p.lastName}</td>
                  <td className="px-5 py-3">{p.gender}</td>
                  <td className="px-5 py-3 tabular">{p.dob}</td>
                  <td className="px-5 py-3 tabular">{p.contact}</td>
                  <td className="px-5 py-3 font-medium text-brand-navy">{p.room}</td>
                  <td className="px-5 py-3"><StatusPill status={p.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="secondary" size="sm" onClick={() => router.push(`/clinical?patientId=${p.id}`)}>
                      Open Record
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-txt-muted text-sm">
              No patients match your search.
            </div>
          )}
        </div>
      </Card>

      <SlideOver
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Patient"
        description="Enter patient demographic details."
      >
        <form onSubmit={handleRegister} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name *" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
              <Input label="Last Name *" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Gender *" 
                options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}]} 
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              />
              <Input label="Date of Birth *" type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} required />
            </div>

            <Input label="Contact Number *" placeholder="+256 7XX XXX XXX" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Blood Group" 
                options={[{value: '', label: 'Unknown'}, {value: 'A+', label: 'A+'}, {value: 'O+', label: 'O+'}, {value: 'B+', label: 'B+'}, {value: 'AB+', label: 'AB+'}]} 
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
              />
              <Input label="National ID (NIN)" placeholder="CMXXXXXXXXXXXX" value={formData.nin} onChange={e => setFormData({ ...formData, nin: e.target.value })} />
            </div>

            <Input label="Initial Room / Ward" placeholder="e.g. OPD" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} />
          </div>

          <div className="p-6 border-t border-border-outer bg-surface-shell flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit">Save Patient</Button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
