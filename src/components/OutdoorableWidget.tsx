'use client';

import React, { useState, useEffect } from 'react';
import { useWidget } from '@/context/WidgetContext';
import { inspireQuestions } from '@/data/inspire-me-questions';
import { planningQuestions } from '@/data/planning-questions';
import { Question } from '@/types';
// Removed unused UI imports for cleaner code
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import '@/styles/widget.css';

const OutdoorableWidget: React.FC = () => {
  const { 
    state, 
    updateAnswer, 
    nextQuestion, 
    // previousQuestion, // Unused in current implementation
    setFlow, 
    generateTrip, 
    resetWidget 
  } = useWidget();
  
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customInputValue, setCustomInputValue] = useState('');

  // Get current questions based on flow
  useEffect(() => {
    if (state.currentFlow === 'inspire') {
      setCurrentQuestions(inspireQuestions);
    } else if (state.currentFlow === 'planning') {
      setCurrentQuestions(planningQuestions);
    }
  }, [state.currentFlow]);

  // Filter questions based on conditions
  const getVisibleQuestions = (): Question[] => {
    return currentQuestions.filter(q => {
      if (!q.condition) return true;
      
      const { equals } = q.condition;
      if (equals) {
        return state.answers[equals.key] === equals.value;
      }
      
      return true;
    });
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[state.currentQuestionIndex];
  const progress = Math.round(((state.currentQuestionIndex + 1) / visibleQuestions.length) * 100);

  // Handle flow selection
  const handleFlowSelection = (flow: 'inspire' | 'planning') => {
    setFlow(flow);
  };

  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === 'multi_select') {
      const newSelection = selectedOptions.includes(value)
        ? selectedOptions.filter(opt => opt !== value)
        : [...selectedOptions, value];
      
      setSelectedOptions(newSelection);
      updateAnswer(currentQuestion.key, newSelection.join(', '));
    } else {
      updateAnswer(currentQuestion.key, value);
      
      // Auto-advance for single select
      setTimeout(() => {
        if (state.currentQuestionIndex < visibleQuestions.length - 1) {
          nextQuestion();
        } else {
          handleGenerateTrip();
        }
      }, 300);
    }
  };

  // Handle custom input submission
  const handleCustomInput = () => {
    if (!currentQuestion || !customInputValue.trim()) return;

    updateAnswer(currentQuestion.key, customInputValue);
    setCustomInputValue('');
    
    setTimeout(() => {
      if (state.currentQuestionIndex < visibleQuestions.length - 1) {
        nextQuestion();
      } else {
        handleGenerateTrip();
      }
    }, 300);
  };

  // Handle multi-select next
  const handleMultiSelectNext = () => {
    if (!currentQuestion) return;

    // If user typed custom input, save it
    if (customInputValue.trim()) {
      const finalAnswer = selectedOptions.length > 0 
        ? [...selectedOptions, customInputValue].join(', ')
        : customInputValue;
      updateAnswer(currentQuestion.key, finalAnswer);
    }

    if (state.currentQuestionIndex < visibleQuestions.length - 1) {
      nextQuestion();
      setSelectedOptions([]);
      setCustomInputValue(''); // Clear custom input when moving to next question
    } else {
      handleGenerateTrip();
    }
  };

  // Generate trip and match experts
  const handleGenerateTrip = async () => {
    await generateTrip();
  };

  // Quick test for dev mode
  const handleQuickTest = async () => {
    const mockAnswers = {
      destination: 'Not sure yet',
      party_type: 'Couple',
      trip_length: '4-7 days',
      activity_level: 'Light to moderate',
      outdoor_interest: 'Mountains',
      budget: 'Comfortable/mid-range'
    };
    
    // Fill answers
    Object.entries(mockAnswers).forEach(([key, value]) => {
      updateAnswer(key, value);
    });
    
    // Set flow and generate
    if (!state.currentFlow) {
      setFlow('inspire');
    }
    
    setTimeout(() => {
      generateTrip();
    }, 500);
  };

  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';



  // Render flow selection
  if (!state.currentFlow) {
    return (
      <div className="alfie-embedded-chat">
        <div className="alfie-intro">
          <div className="alfie-avatar-main">
            <img src="/images/alfie-avatar.png" alt="Alfie" />
          </div>
          <div className="alfie-greeting">
            <div className="alfie-greeting-bubble">
              Hi, I&apos;m Alfie 👋 Tell me what you&apos;re dreaming up and I&apos;ll share free tailored trip ideas to inspire your next adventure.
            </div>
          </div>
        </div>
        
        <div className="alfie-flow-selection">
          <div className="alfie-flow-buttons">
            <button
              className="alfie-flow-button"
              onClick={() => handleFlowSelection('inspire')}
            >
              <span>💡 Inspire me — I&apos;m not sure where to go yet</span>
              <span className="alfie-flow-arrow">→</span>
            </button>
            <button
              className="alfie-flow-button"
              onClick={() => handleFlowSelection('planning')}
            >
              <span>🗺️ I know my destination — help with recs & itinerary</span>
              <span className="alfie-flow-arrow">→</span>
            </button>
            {isDev && (
              <button
                className="alfie-flow-button"
                onClick={handleQuickTest}
                style={{ 
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  border: '2px dashed #ff4757',
                  fontSize: '14px'
                }}
              >
                <span>🚀 Quick Test Enhanced Results</span>
                <span className="alfie-flow-arrow">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (state.isLoading) {
    return (
      <div className="alfie-embedded-chat">
        <div className="alfie-progress-container">
          <div className="alfie-progress-text">
            <span className="alfie-progress-emoji">🌍</span>
            <span>Planning your adventure...</span>
          </div>
          <div className="alfie-progress-track">
            <div className="alfie-progress-bar" style={{ width: '70%' }}></div>
          </div>
        </div>
        <div className="alfie-loading-section">
          <LoadingAnimation destination={Array.isArray(state.answers?.destination) ? state.answers.destination[0] : state.answers?.destination || ''} />
        </div>
      </div>
    );
  }

  // Render results
  if (state.tripContent) {
    return (
      <div className="alfie-embedded-chat">
        <div className="alfie-final-results">
          <div className="alfie-results-content">
            <div className="alfie-results-header">
              <div className="alfie-avatar">
                <img src="/images/alfie-avatar.png" alt="Alfie" />
              </div>
              <h2>Your Custom TripGuide</h2>
            </div>
            
            {/* Trip Content */}
            <div className="alfie-trip-guide" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <div style={{ whiteSpace: 'pre-line' }}>
                {state.tripContent}
              </div>
            </div>
            
            {/* Reset Button */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                className="alfie-retry-button"
                onClick={resetWidget}
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (state.error) {
    return (
      <div className="alfie-embedded-chat">
        <div className="alfie-error-content">
          <div className="alfie-avatar">
            <img src="/images/alfie-avatar.png" alt="Alfie" />
          </div>
          <h2>Oops! Something went wrong</h2>
          <p>{state.error}</p>
          <button
            className="alfie-retry-button"
            onClick={resetWidget}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render questions
  if (!currentQuestion) {
    return (
      <div className="alfie-embedded-chat">
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--alfie-text)' }}>No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alfie-embedded-chat">
      {/* Progress Bar */}
      <div className="alfie-progress-container">
        <div className="alfie-progress-text">
          <span className="alfie-progress-emoji">🗣️</span>
          <span>Question {state.currentQuestionIndex + 1} of {visibleQuestions.length}</span>
        </div>
        <div className="alfie-progress-track">
          <div className="alfie-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      {/* Question Display */}
      <div className="alfie-questions-section">
        <div className="alfie-question-display">
          <div className="alfie-avatar">
            <img src="/images/alfie-avatar.png" alt="Alfie" />
          </div>
          <div className="alfie-question-text">
            {currentQuestion.text}
          </div>
        </div>
        
        {/* Answer Options */}
        {currentQuestion.type === 'text' ? (
          <div className="alfie-custom-input">
            <input
              key={`text-${currentQuestion.key}-${state.currentQuestionIndex}`}
              className="alfie-input"
              value={customInputValue}
              onChange={(e) => setCustomInputValue(e.target.value)}
              placeholder={currentQuestion.example || 'Type your answer here...'}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomInput()}
            />
            <button
              className="alfie-submit-button"
              onClick={handleCustomInput}
              disabled={!customInputValue.trim()}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="alfie-answer-options">
            {currentQuestion.options?.map((option, index) => {
              // Check if this is an "Other" option
              const isOtherOption = option.toLowerCase().includes('other') && option.toLowerCase().includes('free form');
              
              if (isOtherOption) {
                return (
                  <div key={index} style={{ gridColumn: '1 / -1' }}>
                    <input
                      key={`other-${currentQuestion.key}-${state.currentQuestionIndex}`}
                      className="alfie-input"
                      value={customInputValue}
                      onChange={(e) => setCustomInputValue(e.target.value)}
                      placeholder="Type your own answer here..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customInputValue.trim()) {
                          handleAnswerSelect(customInputValue);
                          setCustomInputValue('');
                        }
                      }}
                    />
                  </div>
                );
              }
              
              const isSelected = currentQuestion.type === 'multi_select' 
                ? selectedOptions.includes(option)
                : state.answers[currentQuestion.key] === option;
              
              return (
                <button
                  key={index}
                  className={`${
                    currentQuestion.type === 'multi_select' 
                      ? 'alfie-multi-option-button' 
                      : 'alfie-option-button'
                  } ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              );
            })}
            
            {/* Multi-select next button */}
            {currentQuestion.type === 'multi_select' && (
              <button
                className="alfie-next-button"
                onClick={handleMultiSelectNext}
                disabled={selectedOptions.length === 0 && !customInputValue.trim()}
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutdoorableWidget;