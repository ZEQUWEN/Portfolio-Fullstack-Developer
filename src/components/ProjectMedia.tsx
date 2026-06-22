import React from 'react';

interface ProjectMediaProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProjectMedia({ src, alt, className }: ProjectMediaProps) {
  const isVideo = src && src.startsWith('data:video/');

  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
}
