import React, { useState } from 'react';
import ExpertMatchDisplay from '@/components/ExpertMatchDisplay';

const ExpertDemo = () => {
  const [showExperts, setShowExperts] = useState(false);
  const [testAnswers, setTestAnswers] = useState({
    destination_main: 'Grand Canyon',
    activities: 'Hiking, Photography',
    party_type: 'Solo',
    fitness_level: 'Moderate (day hikes, biking, city walking)',
    balance_ratio: '70% Outdoors / 30% Culture',
    season_window: 'Spring (Mar–May)',
    trip_length_days: '7 days'
  });

  const handleShowExperts = () => {
    setShowExperts(true);
  };

  const handleCloseExperts = () => {
    setShowExperts(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d5a3d', marginBottom: '20px' }}>
        🎯 Expert Matching System Demo
      </h1>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px' 
      }}>
        <h2>Test Data:</h2>
        <pre style={{ 
          background: 'white', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto',
          fontSize: '14px'
        }}>
          {JSON.stringify(testAnswers, null, 2)}
        </pre>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={handleShowExperts}
          style={{
            background: '#2d5a3d',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '15px'
          }}
        >
          🔍 Find Matching Experts
        </button>
        
        <button
          onClick={handleCloseExperts}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ❌ Hide Experts
        </button>
      </div>

      {showExperts && (
        <ExpertMatchDisplay 
          answers={testAnswers}
          onClose={handleCloseExperts}
        />
      )}

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#e8f5e8', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ color: '#2d5a3d' }}>📋 System Status</h3>
        <ul>
          <li>✅ Isolated API endpoint: /api/match-experts</li>
          <li>✅ Standalone component: ExpertMatchDisplay</li>
          <li>✅ Airtable integration working</li>
          <li>✅ OpenAI tag generation</li>
          <li>✅ Expert scoring algorithm</li>
          <li>✅ No impact on main widget</li>
        </ul>
        
        <p><strong>API Test URL:</strong> <code>/api/match-experts</code></p>
        <p><strong>Demo Page URL:</strong> <code>/expert-demo</code></p>
      </div>
    </div>
  );
};

export default ExpertDemo;