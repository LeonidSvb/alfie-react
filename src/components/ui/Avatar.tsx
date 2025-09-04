import React, { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = ''
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-[60px] h-[60px]',
    lg: 'w-20 h-20'
  };

  const sizePixels = {
    sm: 48,
    md: 60,
    lg: 80
  };

  const classes = `${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-emerald-200 shadow-lg ${className}`.trim();

  // Determine fallback image based on alt text
  const getFallbackSrc = () => {
    if (alt.toLowerCase().includes('alfie')) {
      return '/images/alfie-fallback.svg';
    }
    return '/images/default-expert.svg';
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getFallbackSrc());
    }
  };

  // Use fallback if no src provided or if there was an error
  const finalSrc = imgSrc || getFallbackSrc();

  return (
    <div className={classes}>
      <Image
        src={finalSrc}
        alt={alt}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className="w-full h-full rounded-full object-cover"
        onError={handleError}
        unoptimized={finalSrc.endsWith('.svg')}
      />
    </div>
  );
};

export default Avatar;