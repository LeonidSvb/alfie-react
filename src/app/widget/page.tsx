'use client';

import OutdoorableWidget from '@/components/OutdoorableWidget';
import { WidgetProvider } from '@/context/WidgetContext';

export default function WidgetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2">
      <WidgetProvider>
        <OutdoorableWidget />
      </WidgetProvider>
    </div>
  );
}