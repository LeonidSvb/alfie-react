'use client';

import React, { useState } from 'react';
import ExpertCard from '@/components/ExpertCard';

const testScenarios = [
  {
    name: "🏔️ Adventure in Nepal",
    data: {
      destination: "Nepal",
      activities: ["hiking", "trekking", "mountaineering"],
      traveler_type: "solo",
      experience_level: "intermediate",
      duration: "2-3 weeks"
    }
  },
  {
    name: "🏝️ Family Trip to Bali",
    data: {
      destination: "Bali",
      activities: ["swimming", "cultural tours", "food experiences"],
      traveler_type: "families",
      experience_level: "beginner",
      duration: "1-2 weeks"
    }
  },
  {
    name: "🎿 Swiss Alps Adventure",
    data: {
      destination: "Switzerland",
      activities: ["skiing", "hiking", "mountaineering"],
      traveler_type: "couples",
      experience_level: "advanced",
      duration: "1 week"
    }
  },
  {
    name: "🦘 Australia Backpacking",
    data: {
      destination: "Australia",
      activities: ["hiking", "biking", "wildlife viewing"],
      traveler_type: "solo",
      experience_level: "intermediate",
      duration: "3+ weeks"
    }
  },
  {
    name: "🌸 Japan Cultural Tour",
    data: {
      destination: "Japan",
      activities: ["cultural tours", "food experiences", "walking"],
      traveler_type: "couples",
      experience_level: "beginner",
      duration: "2-3 weeks"
    }
  }
];

export default function TestExpertsPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('');

  const testExpertSearch = async (scenario: any) => {
    setLoading(true);
    setSelectedScenario(scenario.name);
    
    try {
      const response = await fetch('/api/experts/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario.data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to search experts');
      }
      
      const data = await response.json();
      setExperts(data.experts || []);
    } catch (error) {
      console.error('Error searching experts:', error);
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔬 Expert Testing Tool
            </h1>
            <p className="text-gray-600 text-lg">
              Quickly test Airtable expert matching with predefined scenarios
            </p>
          </div>

          {/* Test Scenarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {testScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => testExpertSearch(scenario)}
                disabled={loading}
                className={`p-4 rounded-16 border-2 text-left transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedScenario === scenario.name 
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">{scenario.name}</h3>
                <div className="text-sm text-gray-600">
                  <p><strong>Destination:</strong> {scenario.data.destination}</p>
                  <p><strong>Activities:</strong> {scenario.data.activities.join(', ')}</p>
                  <p><strong>Type:</strong> {scenario.data.traveler_type}</p>
                  <p><strong>Level:</strong> {scenario.data.experience_level}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                <span className="text-lg">Searching experts for {selectedScenario}...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && experts.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎯 Found {experts.length} Expert{experts.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-gray-600">for {selectedScenario}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experts.map((expert, index) => (
                  <ExpertCard key={index} expert={expert} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && selectedScenario && experts.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No experts found
              </h2>
              <p className="text-gray-600">
                Try adjusting the search criteria or check Airtable connection
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-12 bg-blue-50 rounded-16 p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">💡 How to use:</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Click on any scenario above to test expert matching</li>
              <li>• Check browser console for detailed API logs</li>
              <li>• Results show the top matching experts from Airtable</li>
              <li>• Use this to test different combinations quickly!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}