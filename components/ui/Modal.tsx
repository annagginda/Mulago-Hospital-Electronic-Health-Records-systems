'use client';
import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-txt-primary/50 transition-opacity" onClick={onClose} />

        <div className="relative transform bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-border-outer">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-divider bg-surface-shell">
            <h3 className="text-lg font-semibold text-txt-primary">{title}</h3>
            <button
              onClick={onClose}
              className="text-txt-muted hover:text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <Icon name="XMarkIcon" className="w-6 h-6" />
            </button>
          </div>
          
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
