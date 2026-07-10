'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from './Icon';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 border bg-white shadow-lg transition-all animate-in slide-in-from-right-8 ${
              t.type === 'success' ? 'border-status-successFg/20 border-l-4 border-l-status-successFg' :
              t.type === 'error' ? 'border-status-errorFg/20 border-l-4 border-l-status-errorFg' :
              'border-brand/20 border-l-4 border-l-brand'
            }`}
          >
            {t.type === 'success' && <Icon name="CheckCircleIcon" className="w-5 h-5 text-status-successFg shrink-0 mt-0.5" />}
            {t.type === 'error' && <Icon name="XCircleIcon" className="w-5 h-5 text-status-errorFg shrink-0 mt-0.5" />}
            {t.type === 'info' && <Icon name="InformationCircleIcon" className="w-5 h-5 text-brand shrink-0 mt-0.5" />}
            
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-txt-primary">{t.title}</h4>
              {t.message && <p className="text-xs text-txt-secondary mt-1">{t.message}</p>}
            </div>
            
            <button onClick={() => removeToast(t.id)} className="text-txt-muted hover:text-txt-primary focus:outline-none">
              <Icon name="XMarkIcon" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
