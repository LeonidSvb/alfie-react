'use client';

import React, { useState, useEffect } from 'react';
import { useWidget } from '@/context/WidgetContext';
import { inspireQuestions } from '@/data/inspire-me-questions';
import { planningQuestions } from '@/data/planning-questions';
import { filterExperts, calculateMatchScore } from '@/utils/expertFilter';
import { Question } from '@/types';
import { 
  Button, 
  Input, 
  ProgressBar, 
  Avatar, 
  LoadingSpinner, 
  MessageBubble 
} from '@/components/ui';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import ExpertCard from '@/components/ExpertCard';

const OutdoorableWidget: React.FC = () => {
  const { 
    state, 
    updateAnswer, 
    nextQuestion, 
    previousQuestion, 
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
    if (state.currentQuestionIndex < visibleQuestions.length - 1) {
      nextQuestion();
      setSelectedOptions([]);
    } else {
      handleGenerateTrip();
    }
  };

  // Generate trip and match experts
  const handleGenerateTrip = async () => {
    await generateTrip();
  };



  // Render flow selection
  if (!state.currentFlow) {
    return (
      <div className="w-full max-w-[500px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-24 p-8 font-sans shadow-card mx-auto border border-green-100">
        <div className="flex items-start gap-5 mb-6">
          <Avatar size="md" alt="Alfie" src="/images/alfie-avatar.png" />
          <div className="flex-1">
            <MessageBubble>
              Hi, I'm Alfie 👋 Tell me what you're dreaming up and I'll share free tailored trip ideas to inspire your next adventure.
            </MessageBubble>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button
            variant="flow"
            onClick={() => handleFlowSelection('inspire')}
            className="px-5 py-4"
          >
            💡 Inspire me — I'm not sure where to go yet
          </Button>
          <Button
            variant="flow"
            onClick={() => handleFlowSelection('planning')}
            className="px-5 py-4"
          >
            🗺️ I know my destination — help with recs & itinerary
          </Button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (state.isLoading) {
    return (
      <div className="w-full max-w-[500px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-24 p-8 font-sans shadow-card mx-auto border border-green-100">
        <div className="text-center">
          <LoadingAnimation destination={state.answers?.destination || ''} />
        </div>
      </div>
    );
  }

  // Render results
  if (state.tripContent) {
    const matchedExperts = state.experts || [];
    
    return (
      <div className="w-full max-w-[500px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-24 p-8 font-sans shadow-card mx-auto border border-green-100">
        <div className="bg-alfie-dark-green rounded-18 p-6">
          <div className="flex items-center gap-4 mb-5">
            <Avatar size="md" alt="Alfie" src="/images/alfie-avatar.png" />
            <h2 className="text-alfie-text text-xl font-semibold">
              Your Custom TripGuide
            </h2>
          </div>
          
          {/* Trip Content */}
          <div className="bg-white rounded-15 p-5 mb-5 text-sm leading-relaxed text-gray-800">
            <div className="whitespace-pre-line">
              {state.tripContent}
            </div>
          </div>
          
          {/* Expert Recommendations */}
          {matchedExperts.length > 0 && (
            <div className="text-center p-4 bg-alfie-light-green rounded-15">
              <h3 className="text-alfie-text text-base font-semibold mb-2">
                Want to make this trip unforgettable?
              </h3>
              <p className="text-alfie-text-light text-sm mb-4">
                Connect with local experts who know these places by heart
              </p>
              
              <div className="grid gap-3 mt-4">
                {matchedExperts.slice(0, 3).map((expert) => (
                  <ExpertCard
                    key={expert.id}
                    expert={expert}
                    matchScore={expert.matchScore}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Reset Button */}
          <div className="text-center mt-5">
            <Button
              variant="secondary"
              onClick={resetWidget}
              size="sm"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (state.error) {
    return (
      <div className="w-full max-w-[500px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-24 p-8 font-sans shadow-card mx-auto border border-green-100">
        <div className="text-center p-8">
          <Avatar size="md" className="mx-auto mb-4" />
          <h2 className="text-alfie-text text-lg font-semibold mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-alfie-text-light text-sm mb-5 leading-relaxed">
            {state.error}
          </p>
          <Button
            variant="primary"
            onClick={resetWidget}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Render questions
  if (!currentQuestion) {
    return (
      <div className="w-full max-w-[500px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-24 p-8 font-sans shadow-card mx-auto border border-green-100">
        <div className="text-center">
          <p className="text-alfie-text">No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] bg-alfie-light-green rounded-20 p-8 font-sans box-border mx-auto">
      {/* Progress Bar */}
      <ProgressBar 
        progress={progress} 
        text={`Question ${state.currentQuestionIndex + 1} of ${visibleQuestions.length}`}
        emoji="🗣️"
      />
      
      {/* Question Display */}
      <div className="flex items-start gap-4 mb-5">
        <Avatar size="md" alt="Alfie" src="/images/alfie-avatar.png" />
        <MessageBubble>
          {currentQuestion.text}
        </MessageBubble>
      </div>
      
      {/* Answer Options */}
      {currentQuestion.type === 'text' ? (
        <div className="mt-4">
          <Input
            value={customInputValue}
            onChange={(e) => setCustomInputValue(e.target.value)}
            placeholder={currentQuestion.example || 'Type your answer here...'}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomInput()}
          />
          <Button
            variant="primary"
            onClick={handleCustomInput}
            className="mt-2"
            disabled={!customInputValue.trim()}
          >
            Submit
          </Button>
        </div>
      ) : (
        <div className={`grid ${currentQuestion.type === 'multi_select' ? 'grid-cols-2 sm:grid-cols-1' : 'grid-cols-2'} gap-3 mb-4`}>
          {currentQuestion.options?.map((option, index) => {
            // Check if this is an "Other" option
            const isOtherOption = option.toLowerCase().includes('other') && option.toLowerCase().includes('free form');
            
            if (isOtherOption) {
              return (
                <div key={index} className="col-span-full">
                  <Input
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    placeholder="Type your own answer here..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && customInputValue.trim()) {
                        handleAnswerSelect(customInputValue);
                        setCustomInputValue('');
                      }
                    }}
                    className="w-full"
                  />
                </div>
              );
            }
            
            return (
              <Button
                key={index}
                variant={currentQuestion.type === 'multi_select' ? 'multi-option' : 'option'}
                selected={
                  currentQuestion.type === 'multi_select' 
                    ? selectedOptions.includes(option)
                    : state.answers[currentQuestion.key] === option
                }
                onClick={() => handleAnswerSelect(option)}
                className="text-left justify-start"
              >
                {option}
              </Button>
            );
          })}
          
          {/* Multi-select next button */}
          {currentQuestion.type === 'multi_select' && (
            <Button
              variant="next"
              onClick={handleMultiSelectNext}
              disabled={selectedOptions.length === 0}
              className="col-span-full mt-4"
            >
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OutdoorableWidget;