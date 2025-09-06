import { useState, useEffect, RefObject } from 'react';

export interface ScrollProgressResult {
  scrollProgress: number; // 0-100
  hasReached: (percentage: number) => boolean;
}

export function useScrollProgress(containerRef: RefObject<HTMLElement>): ScrollProgressResult {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      
      if (maxScroll <= 0) {
        setScrollProgress(100);
        return;
      }

      const progress = Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100);
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    
    // Initial calculation
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  const hasReached = (percentage: number): boolean => {
    return scrollProgress >= percentage;
  };

  return {
    scrollProgress,
    hasReached,
  };
}