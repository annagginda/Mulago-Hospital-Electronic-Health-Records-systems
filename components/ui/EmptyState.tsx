import React from 'react';
import { Icon } from './Icon';
import * as OutlineIcons from '@heroicons/react/24/outline';

interface EmptyStateProps {
  icon: keyof typeof OutlineIcons;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-divider bg-surface-shell">
      <div className="bg-white p-3 rounded-full shadow-sm mb-4">
        <Icon name={icon} className="w-8 h-8 text-txt-muted" />
      </div>
      <h3 className="text-sm font-semibold text-txt-primary mb-1">{title}</h3>
      <p className="text-sm text-txt-secondary max-w-sm mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
