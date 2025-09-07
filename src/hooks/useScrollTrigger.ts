'use client';

import { useState, useEffect, RefObject } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number; // Процент скролла для срабатывания (по умолчанию 30%)
  container?: RefObject<HTMLElement>; // Контейнер для скролла (по умолчанию window)
}

export interface ScrollTriggerState {
  hasTriggered: boolean;
  scrollProgress: number;
  isScrolling: boolean;
}

export function useScrollTrigger({
  threshold = 30,
  container
}: UseScrollTriggerOptions = {}): ScrollTriggerState {
  const [state, setState] = useState<ScrollTriggerState>({
    hasTriggered: false,
    scrollProgress: 0,
    isScrolling: false
  });

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      const element = container?.current || document.documentElement;
      const scrollTop = container?.current ? container.current.scrollTop : window.scrollY;
      const scrollHeight = container?.current 
        ? container.current.scrollHeight - container.current.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;

      // Вычисляем прогресс скролла в процентах
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      
      // Проверяем триггер
      const triggered = progress >= threshold;

      setState(prev => ({
        hasTriggered: triggered || prev.hasTriggered, // Однажды triggered остается true
        scrollProgress: progress,
        isScrolling: true
      }));

      // Сбрасываем флаг скролла через небольшую задержку
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isScrolling: false
        }));
      }, 150);
    };

    // Определяем элемент для слушателя
    const scrollElement = container?.current || window;
    
    // Добавляем слушатель
    if (container?.current) {
      container.current.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Начальная проверка
    handleScroll();

    // Cleanup
    return () => {
      clearTimeout(scrollTimeout);
      if (container?.current) {
        container.current.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [threshold, container]);

  return state;
}