'use client';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const labelClasses = "display-block font-semibold text-[11px] text-txt-muted uppercase tracking-[0.07em] mb-[5px]";

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-3 py-2.5 text-[13px] text-txt-primary bg-white
          border transition-all outline-none
          placeholder:text-txt-placeholder
          ${error
            ? 'border-status-errorFg bg-status-errorBg focus:ring-[3px] focus:ring-status-errorFg/20'
            : 'border-border-outer focus:border-brand focus:ring-[3px] focus:ring-brand/15'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[11px] font-medium text-status-errorFg mt-[5px]">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={3}
        className={`
          w-full px-3 py-2.5 text-[13px] text-txt-primary bg-white
          border transition-all outline-none resize-none
          placeholder:text-txt-placeholder
          ${error
            ? 'border-status-errorFg bg-status-errorBg focus:ring-[3px] focus:ring-status-errorFg/20'
            : 'border-border-outer focus:border-brand focus:ring-[3px] focus:ring-brand/15'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[11px] font-medium text-status-errorFg mt-[5px]">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full px-3 py-2.5 text-[13px] text-txt-primary bg-white
          border transition-all outline-none
          ${error
            ? 'border-status-errorFg bg-status-errorBg focus:ring-[3px] focus:ring-status-errorFg/20'
            : 'border-border-outer focus:border-brand focus:ring-[3px] focus:ring-brand/15'
          }
          ${className}
        `}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-[11px] font-medium text-status-errorFg mt-[5px]">{error}</p>}
    </div>
  );
}
