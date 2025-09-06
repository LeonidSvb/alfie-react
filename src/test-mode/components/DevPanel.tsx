'use client';

import React, { useState, useEffect } from 'react';
import { testRegistry } from '../registry.js';

interface DevPanelState {
  selectedFeature?: string;
  selectedAction?: string;
  selectedFixture?: string;
  isRunning: boolean;
  lastResult?: any;
  logs: any[];
}

export default function DevPanel() {
  const [state, setState] = useState<DevPanelState>({
    isRunning: false,
    logs: []
  });
  
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    // Подгружаем зарегистрированные фичи
    const allFeatures = testRegistry.getAllFeatures();
    setFeatures(allFeatures);
    
    // Автоматически выбираем первую фичу
    if (allFeatures.length > 0 && !state.selectedFeature) {
      setState(prev => ({ ...prev, selectedFeature: allFeatures[0].featureId }));
    }
  }, []);

  const selectedFeatureData = features.find(f => f.featureId === state.selectedFeature);
  const availableActions = selectedFeatureData?.actions || [];
  const availableFixtures = selectedFeatureData?.fixtures || [];

  const handleRunAction = async () => {
    if (!state.selectedAction || !selectedFeatureData) return;

    const action = availableActions.find(a => a.id === state.selectedAction);
    if (!action) return;

    setState(prev => ({ ...prev, isRunning: true, lastResult: null }));

    try {
      const logger = testRegistry.getLogger();
      
      // Создаем тестовый контекст
      const testContext = {
        isTestMode: true,
        selectedFixture: availableFixtures.find(f => f.id === state.selectedFixture),
        settings: {
          crmEnabled: false,
          gateEnabled: true,
          debugMode: true
        },
        logger
      };

      // Запускаем действие
      const result = await action.run(testContext);
      
      setState(prev => ({ 
        ...prev, 
        isRunning: false, 
        lastResult: result,
        logs: logger.getLogs()
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isRunning: false, 
        lastResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          executionTime: 0,
          timestamp: new Date()
        }
      }));
    }
  };

  return (
    <div style={{ 
      width: '400px',
      height: '100vh',
      background: '#f8f9fa',
      borderRight: '1px solid #e9ecef',
      padding: '16px',
      fontSize: '14px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'auto'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '18px' }}>
          🧪 Test Mode Panel
        </h3>
        <div style={{ 
          padding: '8px 12px', 
          background: '#d4edda', 
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          fontSize: '12px',
          color: '#155724'
        }}>
          ✅ Active • {features.length} features loaded
        </div>
      </div>

      {/* Features Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', color: '#495057', display: 'block', marginBottom: '8px' }}>
          🎯 Feature:
        </label>
        <select 
          value={state.selectedFeature || ''} 
          onChange={(e) => setState(prev => ({ 
            ...prev, 
            selectedFeature: e.target.value,
            selectedAction: '',
            selectedFixture: ''
          }))}
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid #ced4da' 
          }}
        >
          <option value="">Select Feature...</option>
          {features.map(feature => (
            <option key={feature.featureId} value={feature.featureId}>
              {feature.name}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      {availableActions.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', color: '#495057', display: 'block', marginBottom: '8px' }}>
            ⚡ Actions:
          </label>
          <select 
            value={state.selectedAction || ''} 
            onChange={(e) => setState(prev => ({ ...prev, selectedAction: e.target.value }))}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ced4da' 
            }}
          >
            <option value="">Select Action...</option>
            {availableActions.map(action => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fixtures */}
      {availableFixtures.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', color: '#495057', display: 'block', marginBottom: '8px' }}>
            📋 Test Data:
          </label>
          <select 
            value={state.selectedFixture || ''} 
            onChange={(e) => setState(prev => ({ ...prev, selectedFixture: e.target.value }))}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ced4da' 
            }}
          >
            <option value="">Use default data...</option>
            {availableFixtures.map(fixture => (
              <option key={fixture.id} value={fixture.id}>
                {fixture.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Run Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={handleRunAction}
          disabled={!state.selectedAction || state.isRunning}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            background: state.isRunning ? '#6c757d' : '#007bff',
            color: 'white',
            fontWeight: 'bold',
            cursor: state.isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {state.isRunning ? '⏳ Running...' : '▶️ Run Action'}
        </button>
      </div>

      {/* Result */}
      {state.lastResult && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', color: '#495057', display: 'block', marginBottom: '8px' }}>
            📊 Result:
          </label>
          <div style={{
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #e9ecef',
            background: state.lastResult.success ? '#d4edda' : '#f8d7da',
            fontSize: '12px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {state.lastResult.success ? (
              <div>
                <div style={{ color: '#155724', fontWeight: 'bold', marginBottom: '8px' }}>
                  ✅ Success ({state.lastResult.executionTime}ms)
                </div>
                {state.lastResult.data && (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '11px' }}>
                    {typeof state.lastResult.data === 'string' 
                      ? state.lastResult.data 
                      : JSON.stringify(state.lastResult.data, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div>
                <div style={{ color: '#721c24', fontWeight: 'bold', marginBottom: '8px' }}>
                  ❌ Error
                </div>
                <div style={{ color: '#721c24' }}>
                  {state.lastResult.error}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs */}
      {state.logs.length > 0 && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <label style={{ fontWeight: 'bold', color: '#495057' }}>
              📝 Logs ({state.logs.length}):
            </label>
            <button
              onClick={() => {
                testRegistry.getLogger().clear();
                setState(prev => ({ ...prev, logs: [] }));
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '3px',
                border: '1px solid #dc3545',
                background: 'white',
                color: '#dc3545',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
          <div style={{
            maxHeight: '300px',
            overflow: 'auto',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            background: 'white'
          }}>
            {state.logs.slice(-10).map((log) => (
              <div key={log.id} style={{
                padding: '8px',
                borderBottom: '1px solid #f8f9fa',
                fontSize: '11px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    background: log.level === 'error' ? '#dc3545' : 
                               log.level === 'warn' ? '#ffc107' : '#28a745',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    fontSize: '10px'
                  }}>
                    {log.level.toUpperCase()}
                  </span>
                  <span style={{ color: '#6c757d', fontSize: '10px' }}>
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{ color: '#495057' }}>
                  <strong>{log.scope}</strong> • {log.event}
                </div>
                {log.message && (
                  <div style={{ color: '#6c757d', fontSize: '10px', marginTop: '2px' }}>
                    {log.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Features Message */}
      {features.length === 0 && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#6c757d',
          fontSize: '13px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
          <p>No test features registered yet.</p>
          <p>Features will appear here automatically when registered via testRegistry.register()</p>
        </div>
      )}
    </div>
  );
}