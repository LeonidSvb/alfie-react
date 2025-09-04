'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';

// Random answer generators for comprehensive testing
const generateRandomAnswers = () => {
  const destinations = [
    'Nepal', 'Bali', 'Switzerland', 'Japan', 'Australia', 'Peru', 'Iceland', 'Norway', 
    'New Zealand', 'Costa Rica', 'Morocco', 'Chile', 'Kenya', 'Thailand', 'Guatemala',
    'Utah', 'Colorado', 'California', 'Alaska', 'Montana', 'Oregon', 'Washington'
  ];

  const activities = [
    'Hiking', 'Biking', 'Swimming', 'Skiing', 'Climbing', 'Photography', 'Wildlife viewing',
    'Cultural tours', 'Food experiences', 'Kayaking', 'Surfing', 'Mountaineering',
    'Scenic drives', 'Art & museums', 'Wellness', 'Diving', 'Fishing', 'Camping'
  ];

  const partyTypes = [
    'Solo', 'Couple', 'Small group of friends (3-6)', 'Large group (7+)', 
    'Family with young kids', 'Family with teens', 'Multi-generational family'
  ];

  const fitnessLevels = [
    'Low-key (easy walks, sightseeing)',
    'Moderate (some hiking, active but not strenuous)', 
    'High energy (challenging hikes, adventure sports)'
  ];

  const budgetStyles = [
    'Budget-conscious (hostels, local food)',
    'Mid-range (nice hotels, mix of experiences)',
    'Luxury (high-end accommodations, premium experiences)'
  ];

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomItems = (arr: string[], count: number = Math.floor(Math.random() * 3) + 1) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return {
    destination_main: getRandomItem(destinations),
    activities: getRandomItems(activities).join(', '),
    party_type: getRandomItem(partyTypes),
    fitness_level: getRandomItem(fitnessLevels),
    budget_style: getRandomItem(budgetStyles),
    trip_length_days: Math.floor(Math.random() * 21) + 3, // 3-23 days
    season_window: getRandomItem(['Spring', 'Summer', 'Fall', 'Winter', 'Flexible']),
    regions_interest: getRandomItem(['Mountains', 'Beaches', 'Cities', 'Desert', 'Forest', 'Islands']),
    home_base: getRandomItem(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'])
  };
};

const testScenarios = [
  {
    name: '🏔️ Mountain Adventure',
    answers: {
      destination_main: 'Nepal',
      activities: 'Hiking, Mountaineering, Photography',
      party_type: 'Solo',
      fitness_level: 'High energy (challenging hikes, adventure sports)',
      budget_style: 'Mid-range (nice hotels, mix of experiences)'
    }
  },
  {
    name: '🏝️ Tropical Family Getaway',
    answers: {
      destination_main: 'Bali',
      activities: 'Swimming, Cultural tours, Food experiences',
      party_type: 'Family with young kids',
      fitness_level: 'Low-key (easy walks, sightseeing)',
      budget_style: 'Luxury (high-end accommodations, premium experiences)'
    }
  },
  {
    name: '🎿 Alpine Winter Sports',
    answers: {
      destination_main: 'Switzerland',
      activities: 'Skiing, Scenic drives, Wellness',
      party_type: 'Couple',
      fitness_level: 'High energy (challenging hikes, adventure sports)',
      budget_style: 'Luxury (high-end accommodations, premium experiences)'
    }
  },
  {
    name: '🌸 Cultural Exploration',
    answers: {
      destination_main: 'Japan',
      activities: 'Cultural tours, Food experiences, Art & museums',
      party_type: 'Couple',
      fitness_level: 'Moderate (some hiking, active but not strenuous)',
      budget_style: 'Mid-range (nice hotels, mix of experiences)'
    }
  },
  {
    name: '🦘 Outback Adventure',
    answers: {
      destination_main: 'Australia', 
      activities: 'Wildlife viewing, Hiking, Photography',
      party_type: 'Small group of friends (3-6)',
      fitness_level: 'Moderate (some hiking, active but not strenuous)',
      budget_style: 'Budget-conscious (hostels, local food)'
    }
  }
];

export default function ExpertTestingPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testingMode, setTestingMode] = useState<'manual' | 'random' | 'batch'>('manual');
  const [batchResults, setBatchResults] = useState<any[]>([]);

  const testExpertMatching = async (answers: any, scenarioName?: string) => {
    setLoading(true);
    
    try {
      console.log('🧪 Testing expert matching with answers:', answers);
      
      const response = await fetch('/api/experts/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const result = {
        scenario: scenarioName || 'Custom Test',
        answers,
        experts: data.experts || [],
        aiTags: data.generatedTags || [],
        airtableFormula: data.airtableFormula || '',
        totalFound: data.totalFound || 0,
        timestamp: new Date().toISOString()
      };
      
      setResults(prev => [result, ...prev]);
      return result;
      
    } catch (error) {
      console.error('❌ Expert testing failed:', error);
      const errorResult = {
        scenario: scenarioName || 'Custom Test',
        answers,
        error: error instanceof Error ? error.message : 'Unknown error',
        experts: [],
        timestamp: new Date().toISOString()
      };
      setResults(prev => [errorResult, ...prev]);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  const runRandomTest = () => {
    const randomAnswers = generateRandomAnswers();
    testExpertMatching(randomAnswers, `🎲 Random Test ${Date.now()}`);
  };

  const runBatchTest = async () => {
    setLoading(true);
    setBatchResults([]);
    
    console.log('🚀 Running batch test with 10 random scenarios...');
    
    const batchPromises = [];
    for (let i = 0; i < 10; i++) {
      const randomAnswers = generateRandomAnswers();
      batchPromises.push(testExpertMatching(randomAnswers, `Batch Test #${i + 1}`));
    }
    
    try {
      const results = await Promise.all(batchPromises);
      setBatchResults(results);
      console.log('✅ Batch testing completed:', results);
    } catch (error) {
      console.error('❌ Batch testing failed:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className=\"text-center mb-8\">
            <h1 className=\"text-4xl font-bold text-gray-900 mb-4\">
              🧪 Advanced Expert Testing Lab
            </h1>
            <p className=\"text-gray-600 text-lg mb-6\">
              Comprehensive testing of AI-powered expert matching system
            </p>
            
            {/* Mode Selector */}
            <div className=\"flex justify-center gap-4 mb-6\">
              <Button
                variant={testingMode === 'manual' ? 'primary' : 'secondary'}
                onClick={() => setTestingMode('manual')}
              >
                📋 Manual Scenarios
              </Button>
              <Button
                variant={testingMode === 'random' ? 'primary' : 'secondary'}  
                onClick={() => setTestingMode('random')}
              >
                🎲 Random Testing
              </Button>
              <Button
                variant={testingMode === 'batch' ? 'primary' : 'secondary'}
                onClick={() => setTestingMode('batch')}
              >
                🚀 Batch Testing
              </Button>
            </div>
          </div>

          {/* Manual Testing */}
          {testingMode === 'manual' && (
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8\">
              {testScenarios.map((scenario, index) => (
                <div
                  key={index}
                  className=\"bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all\"
                >
                  <h3 className=\"font-bold text-lg mb-3\">{scenario.name}</h3>
                  <div className=\"text-sm text-gray-600 space-y-2 mb-4\">
                    <p><strong>Destination:</strong> {scenario.answers.destination_main}</p>
                    <p><strong>Activities:</strong> {scenario.answers.activities}</p>
                    <p><strong>Party Type:</strong> {scenario.answers.party_type}</p>
                    <p><strong>Fitness:</strong> {scenario.answers.fitness_level}</p>
                  </div>
                  <Button
                    variant=\"primary\"
                    onClick={() => testExpertMatching(scenario.answers, scenario.name)}
                    disabled={loading}
                    className=\"w-full\"
                  >
                    Test This Scenario
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Random Testing */}
          {testingMode === 'random' && (
            <div className=\"text-center mb-8\">
              <div className=\"bg-white rounded-xl p-8 border-2 border-gray-200 max-w-md mx-auto\">
                <h3 className=\"text-xl font-bold mb-4\">🎲 Random Answer Generator</h3>
                <p className=\"text-gray-600 mb-6\">
                  Generate random user answers to test edge cases and system robustness
                </p>
                <Button
                  variant=\"primary\"
                  onClick={runRandomTest}
                  disabled={loading}
                  size=\"lg\"
                >
                  Generate Random Test
                </Button>
              </div>
            </div>
          )}

          {/* Batch Testing */}
          {testingMode === 'batch' && (
            <div className=\"text-center mb-8\">
              <div className=\"bg-white rounded-xl p-8 border-2 border-gray-200 max-w-md mx-auto\">
                <h3 className=\"text-xl font-bold mb-4\">🚀 Batch Testing</h3>
                <p className=\"text-gray-600 mb-6\">
                  Run 10 random tests simultaneously to stress-test the system
                </p>
                <Button
                  variant=\"primary\"
                  onClick={runBatchTest}
                  disabled={loading}
                  size=\"lg\"
                >
                  Run Batch Test (10x)
                </Button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className=\"text-center py-8\">
              <div className=\"inline-flex items-center gap-2\">
                <div className=\"animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500\"></div>
                <span className=\"text-lg\">Running expert matching tests...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className=\"space-y-6\">
              <h2 className=\"text-2xl font-bold text-gray-900 mb-4\">
                🎯 Testing Results ({results.length})
              </h2>
              
              {results.map((result, index) => (
                <div key={index} className=\"bg-white rounded-xl p-6 border border-gray-200\">
                  <div className=\"flex justify-between items-start mb-4\">
                    <h3 className=\"font-bold text-lg\">{result.scenario}</h3>
                    <span className=\"text-sm text-gray-500\">{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  {result.error ? (
                    <div className=\"bg-red-50 border border-red-200 rounded-lg p-4\">
                      <p className=\"text-red-800 font-semibold\">❌ Error: {result.error}</p>
                    </div>
                  ) : (
                    <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                      {/* User Answers */}
                      <div>
                        <h4 className=\"font-semibold mb-2\">📝 User Answers</h4>
                        <div className=\"bg-gray-50 rounded p-3 text-sm space-y-1\">
                          {Object.entries(result.answers).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {String(value)}</p>
                          ))}
                        </div>
                      </div>
                      
                      {/* Results */}
                      <div>
                        <h4 className=\"font-semibold mb-2\">🎯 Results ({result.totalFound} found)</h4>
                        {result.aiTags && (
                          <div className=\"mb-3\">
                            <p className=\"text-sm font-medium text-blue-600\">AI Generated Tags:</p>
                            <p className=\"text-sm bg-blue-50 rounded p-2\">{result.aiTags.join(', ')}</p>
                          </div>
                        )}
                        {result.airtableFormula && (
                          <div className=\"mb-3\">
                            <p className=\"text-sm font-medium text-green-600\">Airtable Formula:</p>
                            <p className=\"text-xs bg-green-50 rounded p-2 font-mono\">{result.airtableFormula}</p>
                          </div>
                        )}
                        {result.experts.slice(0, 3).map((expert: any, expertIndex: number) => (
                          <div key={expertIndex} className=\"text-sm border-l-2 border-emerald-200 pl-3 mb-2\">
                            <p className=\"font-medium\">{expert.name}</p>
                            <p className=\"text-gray-600\">{expert.bio?.substring(0, 100)}...</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}