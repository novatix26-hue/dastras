'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

export default function OptimizedImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  className = '',
  containerClassName = '',
  sizes,
  fill = true,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // اگر پراپس سے نیا سورس آئے تو اسٹیٹ اپڈیٹ کریں
  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasError(false);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${containerClassName}`}>
      {/* اسموتھ اسکیلیٹن شمر (Skeleton Shimmer) */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-0" />
      )}

      <Image
        {...props}
        src={currentSrc}
        alt={alt || 'دسترس خبر و مضمون'}
        fill={fill}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        priority={priority}
        className={`object-cover transition-all duration-500 ${
          isLoading ? 'opacity-0 scale-95 blur-xs' : 'opacity-100 scale-100 blur-0'
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError && currentSrc !== fallbackSrc) {
            setHasError(true);
            setCurrentSrc(fallbackSrc);
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
}
