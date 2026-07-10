'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import type { SessionData, View } from '@/types';

const VIEW_TITLES: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of hospital activity' },
  patients: { title: 'Patient Management', subtitle: 'Register and manage patient records' },
  clinical: { title: 'Clinical', subtitle: 'Medical history, diagnoses & prescriptions' },
  reports: { title: 'Reports & Analytics', subtitle: 'System-wide summary statistics' },
  settings: { title: 'System Settings', subtitle: 'Users, profile and preferences' },
};

export function Topbar({ currentView, user, onOpenMenu }: { currentView: View; user: SessionData; onOpenMenu: () => void }) {
  const router = useRouter();
  const info = VIEW_TITLES[currentView] || { title: 'Mulago EHR', subtitle: '' };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-[64px] bg-white border-b border-border-outer flex items-center justify-between px-4 md:px-7 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="lg:hidden p-1 -ml-2 text-txt-secondary hover:text-brand">
          <Icon name="Bars3Icon" className="w-6 h-6" />
        </button>
        <div>
          <div className="font-semibold text-[15px] md:text-[17px] text-txt-primary leading-tight">{info.title}</div>
          <div className="hidden sm:block font-normal text-[12px] text-txt-muted">{info.subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-[18px]">
        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-[10px]">
          <div className="w-[32px] h-[32px] md:w-[38px] md:h-[38px] bg-brand text-white flex items-center justify-center font-mono font-semibold text-[12px] md:text-[13px]">
            {user.initials}
          </div>
          <div className="hidden md:block">
            <div className="font-semibold text-[13px] text-txt-primary leading-[1.2]">{user.name}</div>
            <div className="font-semibold text-[10px] text-brand uppercase tracking-[0.05em] mt-0.5">{user.role}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-[30px] bg-border-divider hidden sm:block"></div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center p-2 md:px-[13px] md:py-[8px] bg-white border border-border-outer text-txt-secondary font-semibold text-[12px] hover:border-status-errorFg hover:text-status-errorFg transition-colors"
          title="Logout"
        >
          <Icon name="ArrowRightOnRectangleIcon" className="w-5 h-5 md:w-[15px] md:h-[15px]" />
          <span className="hidden md:inline md:ml-[7px]">Logout</span>
        </button>
      </div>
    </header>
  );
}
