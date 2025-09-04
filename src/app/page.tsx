'use client';

import Link from 'next/link';
import OutdoorableWidget from '@/components/OutdoorableWidget';
import { WidgetProvider } from '@/context/WidgetContext';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Outdoorable Widget - React Version
          </h1>
          <p className="text-gray-600 mb-4">
            AI-powered travel concierge for outdoor adventures
          </p>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto">
            <Link 
              href="/widget" 
              className="bg-emerald-500 text-white px-4 py-3 rounded-lg hover:bg-emerald-600 transition-all hover:scale-105 shadow-lg"
            >
              🎯 Main Widget
            </Link>
            <Link 
              href="/demo" 
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-lg"
            >
              📱 Iframe Demo
            </Link>
            <Link 
              href="/test-experts" 
              className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-all hover:scale-105 shadow-lg"
            >
              🔬 Legacy Testing
            </Link>
            <Link 
              href="/expert-testing" 
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-all hover:scale-105 shadow-lg"
            >
              🧪 AI Expert Lab
            </Link>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl p-6 max-w-3xl mx-auto mb-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🚀 New AI-Powered Expert System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-emerald-600">✨ Smart Tag Matching:</span> AI analyzes user answers and selects relevant expert tags
              </div>
              <div>
                <span className="font-semibold text-blue-600">🧪 Advanced Testing:</span> Random answer generation and batch testing capabilities  
              </div>
              <div>
                <span className="font-semibold text-purple-600">📊 Real-time Logs:</span> Complete visibility into AI decisions and Airtable queries
              </div>
              <div>
                <span className="font-semibold text-orange-600">🎯 Precise Results:</span> Dynamic Airtable formulas for exact expert matching
              </div>
            </div>
          </div>
        </div>
        
        <WidgetProvider>
          <OutdoorableWidget />
        </WidgetProvider>
      </div>
    </div>
  );
}
