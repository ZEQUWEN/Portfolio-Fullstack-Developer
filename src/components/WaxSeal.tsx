import React from 'react';

interface WaxSealProps {
  initial?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WaxSeal({ initial = "A", className = "", size = 'md' }: WaxSealProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full bg-stamp text-parchment font-decor ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.15), inset 0 -3px 5px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div 
        className="absolute inset-[3px] rounded-full border border-white/10"
        style={{
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.6)'
        }}
      />
      <span className="relative z-10 drop-shadow-md pt-0.5 opacity-90">{initial}</span>
    </div>
  );
}
