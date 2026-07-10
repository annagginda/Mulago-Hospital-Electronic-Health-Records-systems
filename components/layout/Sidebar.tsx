'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { NAV_ITEMS, can } from '@/lib/permissions';
import type { Role, View } from '@/types';
import Image from 'next/image';

interface SidebarProps {
  role: Role;
  onClose?: () => void;
}

const VIEW_ICONS: Record<View, keyof typeof import('@heroicons/react/24/outline')> = {
  dashboard: 'HomeIcon',
  patients: 'UsersIcon',
  clinical: 'ClipboardDocumentListIcon',
  reports: 'ChartBarIcon',
  settings: 'Cog8ToothIcon',
};

export function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();
  const availableItems = NAV_ITEMS.filter(item => can(role, item.view));

  return (
    <div className="w-[240px] h-screen bg-surface-shell border-r border-border-outer flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="h-[64px] flex items-center justify-between bg-[#0a0a0a] border-b border-border-outer shrink-0 pr-2">
        <div className="flex items-center">
          <div className="w-[42px] h-[42px] flex items-center justify-center shrink-0 ml-4 mr-3 bg-black">
            <Image src="/logo.svg" alt="Logo" width={42} height={42} className="w-[42px] h-[42px] object-contain invert" priority />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-[13px] font-bold tracking-[0.06em] text-white">MULAGO</div>
            <div className="text-[10px] text-[#9aa1ab] tracking-wide mt-0.5 uppercase">EHR System</div>
          </div>
        </div>
        {/* Mobile close button */}
        <button onClick={onClose} className="lg:hidden p-2 text-txt-placeholder hover:text-white">
          <Icon name="XMarkIcon" className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {availableItems.map(item => {
          const isActive = pathname.startsWith(`/${item.view}`);
          return (
            <Link 
              key={item.view} 
              href={`/${item.view}`}
              className={`
                flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold transition-colors
                ${isActive 
                  ? 'bg-brand-active text-brand border-l-[3px] border-l-brand' 
                  : 'text-txt-secondary hover:bg-white border-l-[3px] border-l-transparent'
                }
              `}
            >
              <Icon name={VIEW_ICONS[item.view]} className="w-5 h-5 opacity-90" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-outer text-center">
        <div className="text-[10px] font-semibold text-txt-muted uppercase tracking-wider">
          View as: {role}
        </div>
      </div>
    </div>
  );
}
