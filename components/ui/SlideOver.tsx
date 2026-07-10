'use client';
import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-txt-primary/50 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white border-l border-border-outer shadow-xl flex flex-col h-full">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-divider bg-surface-shell">
            <h2 className="text-lg font-semibold text-txt-primary">{title}</h2>
            <button
              onClick={onClose}
              className="text-txt-muted hover:text-txt-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <Icon name="XMarkIcon" className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
}
