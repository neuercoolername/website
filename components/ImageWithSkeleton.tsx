'use client';
import { useEffect, useRef } from 'react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWithSkeleton({ src, alt, className }: ImageWithSkeletonProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    img.src = src;
  }, [src]);

  return (
    <div className="w-full h-full bg-gray-200 animate-pulse rounded overflow-hidden">
      <img
        ref={imgRef}
        alt={alt}
        className={`${className} opacity-0 transition-opacity duration-300`}
        onLoad={(e) => {
          const img = e.currentTarget;
          img.classList.remove('opacity-0');
          img.parentElement?.classList.remove('animate-pulse', 'bg-gray-200');
        }}
      />
    </div>
  );
}
