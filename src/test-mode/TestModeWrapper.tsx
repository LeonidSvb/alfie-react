'use client';

import React from 'react';
import { testRegistry } from './registry';
import SimpleTestPanel from './components/SimpleTestPanel';

interface TestModeWrapperProps {
  children: React.ReactNode;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function TestModeWrapper({ children, searchParams }: TestModeWrapperProps) {
  // Проверяем активацию тест-режима
  const isTestMode = searchParams?.TestMod === '1';
  
  // Логируем активацию (только в тест-режиме)
  React.useEffect(() => {
    if (isTestMode) {
      testRegistry.getLogger().info('test-mode', 'activated', {
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      });
    }
  }, [isTestMode]);

  // В обычном режиме просто возвращаем children без изменений
  if (!isTestMode) {
    return <>{children}</>;
  }

  // В тест-режиме оборачиваем в специальный layout
  return (
    <div className="test-mode-environment">
      <div style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Simple Test Panel слева */}
        <SimpleTestPanel />
        
        {/* Основной виджет справа */}
        <div style={{
          flex: 1,
          overflow: 'auto'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}