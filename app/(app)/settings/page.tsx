'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import useSWR from 'swr';
import type { SessionData } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SettingsPage() {
  // Use SWR for /api/users
  const { data: users, isLoading } = useSWR<SessionData[]>('/api/users', fetcher);

  if (isLoading || !users) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-border-inner bg-white flex justify-between items-center">
          <span className="font-semibold text-[14px] text-txt-primary">System Users</span>
          <span className="font-semibold text-[11px] bg-brand-active text-brand border border-border-inner px-2.5 py-1 tabular">{users.length} Active</span>
        </div>
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-shell text-txt-secondary text-[10px] uppercase tracking-[0.06em] font-semibold">
              <tr>
                <th className="px-5 py-3 w-10"></th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Username</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-surface-shell/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="w-8 h-8 bg-brand-active text-brand flex items-center justify-center font-mono font-semibold text-[11px] shrink-0">
                      {u.initials}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[13px] text-txt-primary">{u.name}</td>
                  <td className="px-5 py-3.5 text-[13px] text-txt-secondary tabular">{u.username}</td>
                  <td className="px-5 py-3.5"><span className="text-[11px] font-semibold text-brand uppercase tracking-wider">{u.role}</span></td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-status-successFg bg-status-successBg">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
