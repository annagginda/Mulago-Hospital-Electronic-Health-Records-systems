import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof OutlineIcons;
  variant?: 'outline' | 'solid';
  className?: string;
}

export function Icon({ name, variant = 'outline', className = 'w-5 h-5', ...props }: IconProps) {
  const IconComponent = variant === 'outline' ? OutlineIcons[name] : SolidIcons[name];

  if (!IconComponent) {
    console.error(`Icon ${name} not found`);
    return null;
  }

  // Enforce sharp edges for all icons as per clinical design language
  return (
    <IconComponent
      className={className}
      strokeWidth={1.6}
      strokeLinecap="square"
      strokeLinejoin="miter"
      {...props as any}
    />
  );
}
