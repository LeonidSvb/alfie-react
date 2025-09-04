'use client';

import { useState } from 'react';

export default function DemoPage() {
  const [iframeHeight, setIframeHeight] = useState('600px');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Outdoorable Widget - Iframe Integration Demo
          </h1>
          
          <p className="text-gray-600 mb-8">
            This page demonstrates how the Outdoorable widget can be embedded as an iframe in any website.
          </p>

          {/* Height Controls */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Frame Height Controls</h3>
            <div className="flex gap-2 flex-wrap">
              {['400px', '600px', '800px', '1000px'].map((height) => (
                <button
                  key={height}
                  onClick={() => setIframeHeight(height)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    iframeHeight === height
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {height}
                </button>
              ))}
            </div>
          </div>

          {/* Iframe Demo */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Embedded Widget (Current height: {iframeHeight})
            </h3>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="/widget"
                width="100%"
                height={iframeHeight}
                frameBorder="0"
                scrolling="auto"
                className="w-full"
                title="Outdoorable Widget"
              />
            </div>
          </div>

          {/* Integration Code */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Integration Code</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Basic Iframe:</h4>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`<iframe 
  src="https://your-domain.vercel.app/widget" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>`}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Responsive Iframe:</h4>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`<div style="position: relative; width: 100%; max-width: 500px; margin: 0 auto;">
  <iframe 
    src="https://your-domain.vercel.app/widget" 
    width="100%" 
    height="600px" 
    frameborder="0"
    style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  </iframe>
</div>`}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Webflow Embed:</h4>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`<!-- Paste this code in a Webflow Embed element -->
<iframe 
  src="https://your-domain.vercel.app/widget" 
  width="100%" 
  height="600px" 
  frameborder="0"
  allow="clipboard-write"
  sandbox="allow-scripts allow-same-origin allow-forms">
</iframe>`}
                </pre>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Widget Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">🗣️ AI-Powered Conversations</h4>
                <p className="text-green-700 text-sm">
                  Alfie uses advanced OpenAI models to understand user preferences and generate personalized trip recommendations.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🏔️ Expert Matching</h4>
                <p className="text-blue-700 text-sm">
                  Connects users with real outdoor experts using our advanced tag-based filtering system with 45+ verified experts.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">📱 Mobile Responsive</h4>
                <p className="text-purple-700 text-sm">
                  Fully responsive design that works perfectly on desktop, tablet, and mobile devices.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">⚡ Fast & Lightweight</h4>
                <p className="text-orange-700 text-sm">
                  Built with Next.js and TypeScript for optimal performance and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}