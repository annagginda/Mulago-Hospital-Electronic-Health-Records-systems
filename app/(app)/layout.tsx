'use client';
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ToastProvider } from '@/components/ui/ToastContext';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error('Not authorized');
  return r.json();
});

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR('/api/auth/me', fetcher, {
    shouldRetryOnError: false,
  });

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-surface-shell">Loading session...</div>;
  }

  if (error || !data?.ok) {
    router.push('/login');
    return null;
  }

  return (
    <ToastProvider>
      <AppLayout user={data.user}>
        {children}
      </AppLayout>
    </ToastProvider>
  );
}
