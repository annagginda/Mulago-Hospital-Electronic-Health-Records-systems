import React from 'react';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  max?: number;
}

export function BarChart({ data, max }: BarChartProps) {
  const maxValue = max ?? Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((item, i) => {
        const percentage = (item.value / maxValue) * 100;
        return (
          <div key={i} className="flex items-center gap-3 text-sm">
            <div className="w-24 text-txt-secondary truncate" title={item.label}>
              {item.label}
            </div>
            <div className="flex-1 h-5 bg-surface-shell border border-border-inner relative flex items-center">
              <div 
                className={`h-full border-r border-black/10 transition-all duration-500 ease-out`}
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: item.color || '#527fb6' 
                }}
              />
            </div>
            <div className="w-8 text-right font-semibold text-txt-primary tabular">
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
