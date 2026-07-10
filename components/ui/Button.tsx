'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.08em] transition-all focus:outline-none focus:ring-[3px] focus:ring-brand/20 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-brand text-white hover:bg-brand-hover',
    secondary: 'bg-white text-txt-secondary border border-border-outer hover:border-brand hover:bg-brand-active hover:text-brand',
    ghost:     'bg-transparent text-txt-secondary hover:text-txt-primary hover:bg-black/5',
    danger:    'bg-status-errorFg text-white hover:bg-[#a02c20] focus:ring-status-errorFg/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-[18px] py-[11px] text-[12px]',
    lg: 'px-[24px] py-[13px] text-[13px]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
