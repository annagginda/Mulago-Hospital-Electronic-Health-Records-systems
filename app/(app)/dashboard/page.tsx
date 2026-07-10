'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import { Icon } from '@/components/ui/Icon';
import useSWR from 'swr';
import type { Patient } from '@/types';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
  const { data: patients, isLoading } = useSWR<Patient[]>('/api/patients', fetcher);

  if (isLoading || !patients) return <div>Loading dashboard data...</div>;

  const totalPatients = patients.length;
  const admitted = patients.filter(p => p.status === 'Admitted').length;
  const pendingPrescriptions = patients.flatMap(p => p.prescriptions || []).filter(p => p.status === 'pending').length;
  
  // Get recent 5 patients
  const recentPatients = [...patients].slice(-5).reverse();

  return (
    <div className="space-y-6">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col border-l-4 border-l-brand">
          <p className="text-xs font-semibold text-txt-secondary uppercase tracking-wide">Total Registered</p>
          <p className="text-3xl font-bold text-txt-primary mt-2 tabular">{totalPatients}</p>
          <p className="text-xs text-txt-muted mt-2">Patients in system</p>
        </Card>
        
        <Card className="flex flex-col border-l-4 border-l-status-successFg">
          <p className="text-xs font-semibold text-txt-secondary uppercase tracking-wide">Currently Admitted</p>
          <p className="text-3xl font-bold text-txt-primary mt-2 tabular">{admitted}</p>
          <p className="text-xs text-txt-muted mt-2">In wards</p>
        </Card>

        <Card className="flex flex-col border-l-4 border-l-status-warningFg">
          <p className="text-xs font-semibold text-txt-secondary uppercase tracking-wide">Pending Prescriptions</p>
          <p className="text-3xl font-bold text-txt-primary mt-2 tabular">{pendingPrescriptions}</p>
          <p className="text-xs text-txt-muted mt-2">Awaiting pharmacy</p>
        </Card>

        <Card className="flex flex-col border-l-4 border-l-status-neutralFg">
          <p className="text-xs font-semibold text-txt-secondary uppercase tracking-wide">System Status</p>
          <div className="flex items-center gap-2 mt-2 h-9">
            <span className="w-3 h-3 bg-status-successFg rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-txt-primary">All Systems Operational</span>
          </div>
          <p className="text-xs text-txt-muted mt-2">Last sync: Just now</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients Table */}
        <Card padding={false} className="lg:col-span-2 flex flex-col">
          <div className="p-5 border-b border-border-divider flex justify-between items-center">
            <h3 className="text-sm font-semibold text-txt-primary">Recently Registered Patients</h3>
            <Link href="/patients" className="text-xs font-semibold text-brand hover:text-brand-hover">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-shell text-txt-secondary text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Patient ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider">
                {recentPatients.map(p => (
                  <tr key={p.id} className="hover:bg-surface-shell/50">
                    <td className="px-5 py-3 font-medium text-brand tabular">{p.id}</td>
                    <td className="px-5 py-3 font-semibold text-txt-primary">{p.firstName} {p.lastName}</td>
                    <td className="px-5 py-3"><StatusPill status={p.status} /></td>
                    <td className="px-5 py-3 text-right text-txt-secondary">{p.registeredOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Links / Alerts */}
        <Card className="flex flex-col">
          <h3 className="text-sm font-semibold text-txt-primary mb-4">Quick Actions</h3>
          <div className="space-y-3 flex-1">
            <Link href="/patients" className="w-full flex items-center justify-between p-3 border border-border-outer hover:bg-surface-shell hover:border-brand transition-colors text-left group">
              <div className="flex items-center gap-3">
                <Icon name="UserPlusIcon" className="w-5 h-5 text-brand" />
                <span className="text-sm font-medium text-txt-primary group-hover:text-brand">Register New Patient</span>
              </div>
              <Icon name="ChevronRightIcon" className="w-4 h-4 text-txt-muted" />
            </Link>
            <Link href="/patients" className="w-full flex items-center justify-between p-3 border border-border-outer hover:bg-surface-shell hover:border-brand transition-colors text-left group">
              <div className="flex items-center gap-3">
                <Icon name="MagnifyingGlassIcon" className="w-5 h-5 text-brand" />
                <span className="text-sm font-medium text-txt-primary group-hover:text-brand">Search Patient Records</span>
              </div>
              <Icon name="ChevronRightIcon" className="w-4 h-4 text-txt-muted" />
            </Link>
            <Link href="/clinical" className="w-full flex items-center justify-between p-3 border border-border-outer hover:bg-surface-shell hover:border-brand transition-colors text-left group">
              <div className="flex items-center gap-3">
                <Icon name="QueueListIcon" className="w-5 h-5 text-brand" />
                <span className="text-sm font-medium text-txt-primary group-hover:text-brand">Pharmacy Queue</span>
              </div>
              <Icon name="ChevronRightIcon" className="w-4 h-4 text-txt-muted" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
