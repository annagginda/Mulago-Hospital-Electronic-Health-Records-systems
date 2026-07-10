'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        <div className="flex justify-center mb-8">
          <Image src="/logo.svg" alt="Mulago EHR Logo" width={300} height={80} priority className="h-16 w-auto" />
        </div>
        
        <Card className="shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-[17px] font-bold text-txt-primary leading-tight">System Login</h2>
            <p className="text-[12px] text-txt-muted mt-1">Authorized personnel only.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Username" 
              type="text" 
              placeholder="e.g. sarah.nakato" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            
            {error && (
              <div className="bg-status-errorBg text-status-errorFg px-3 py-2 text-sm border border-status-errorFg/20 mt-2">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Helper Section added to match User request for easy login testing */}
          <div className="mt-6 pt-5 border-t border-border-outer">
            <div className="text-[10px] font-semibold text-txt-muted uppercase tracking-wider mb-3 text-center">
              Quick Test Accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => {setUsername('sarah.nakato'); setPassword('Admin@2026')}} type="button" className="text-[11px] px-2 py-1.5 bg-surface-shell hover:bg-brand-active hover:text-brand transition-colors text-left border border-border-outer">Admin</button>
              <button onClick={() => {setUsername('ibrahim.sserwadda'); setPassword('Doctor@2026')}} type="button" className="text-[11px] px-2 py-1.5 bg-surface-shell hover:bg-brand-active hover:text-brand transition-colors text-left border border-border-outer">Doctor</button>
              <button onClick={() => {setUsername('mary.atim'); setPassword('Nurse@2026')}} type="button" className="text-[11px] px-2 py-1.5 bg-surface-shell hover:bg-brand-active hover:text-brand transition-colors text-left border border-border-outer">Nurse</button>
              <button onClick={() => {setUsername('grace.auma'); setPassword('Pharma@2026')}} type="button" className="text-[11px] px-2 py-1.5 bg-surface-shell hover:bg-brand-active hover:text-brand transition-colors text-left border border-border-outer">Pharmacist</button>
            </div>
          </div>
        </Card>
        
        <div className="text-center mt-8 text-[11px] text-txt-placeholder tracking-wide">
          <p>© 2026 Mulago National Referral Hospital</p>
        </div>
      </div>
    </div>
  );
}
