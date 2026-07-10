'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-white border border-border-outer ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}
