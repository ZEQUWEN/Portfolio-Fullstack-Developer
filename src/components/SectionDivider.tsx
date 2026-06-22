import React from 'react';

export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center py-6 opacity-40 ${className}`}>
      <svg width="120" height="24" viewBox="0 0 120 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 2L55 12L60 22L65 12L60 2Z" />
        <circle cx="20" cy="12" r="2" />
        <circle cx="100" cy="12" r="2" />
        <path d="M25 12C35 12 45 7 53 10" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M95 12C85 12 75 7 67 10" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M25 12C35 12 45 17 53 14" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M95 12C85 12 75 17 67 14" stroke="currentColor" strokeWidth="1" fill="none" />
        <line x1="0" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="105" y1="12" x2="120" y2="12" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
