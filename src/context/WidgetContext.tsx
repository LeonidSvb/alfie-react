import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WidgetState, UserAnswers, Expert, Question } from '@/types';

// Action types
export enum WidgetActionType {
  SET_FLOW = 'SET_FLOW',
  SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION',
  UPDATE_ANSWER = 'UPDATE_ANSWER',
  SET_LOADING = 'SET_LOADING',
  SET_TRIP_CONTENT = 'SET_TRIP_CONTENT',
  SET_MATCHED_EXPERTS = 'SET_MATCHED_EXPERTS',
  SET_ERROR = 'SET_ERROR',
  RESET_WIDGET = 'RESET_WIDGET',
  GO_TO_NEXT_QUESTION = 'GO_TO_NEXT_QUESTION',
  GO_TO_PREVIOUS_QUESTION = 'GO_TO_PREVIOUS_QUESTION'
}

// Action interfaces
export interface WidgetAction {
  type: WidgetActionType;
  payload?: any;
}

// Context interface
interface WidgetContextType {
  state: WidgetState;
  dispatch: React.Dispatch<WidgetAction>;
  // Helper methods
  updateAnswer: (key: string, value: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setFlow: (flow: 'inspire' | 'planning') => void;
  generateTrip: () => Promise<void>;
  resetWidget: () => void;
}

// Initial state
const initialState: WidgetState = {
  currentFlow: null,
  currentQuestionIndex: 0,
  answers: {},
  isLoading: false,
  tripContent: null,
  matchedExperts: [],
  error: null
};

// Reducer
function widgetReducer(state: WidgetState, action: WidgetAction): WidgetState {
  switch (action.type) {
    case WidgetActionType.SET_FLOW:
      return {
        ...state,
        currentFlow: action.payload,
        currentQuestionIndex: 0,
        answers: {},
        tripContent: null,
        matchedExperts: [],
        error: null
      };

    case WidgetActionType.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: action.payload
      };

    case WidgetActionType.UPDATE_ANSWER:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.key]: action.payload.value
        }
      };

    case WidgetActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case WidgetActionType.SET_TRIP_CONTENT:
      return {
        ...state,
        tripContent: action.payload,
        isLoading: false,
        error: null
      };

    case WidgetActionType.SET_MATCHED_EXPERTS:
      return {
        ...state,
        matchedExperts: action.payload
      };

    case WidgetActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case WidgetActionType.GO_TO_NEXT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      };

    case WidgetActionType.GO_TO_PREVIOUS_QUESTION:
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      };

    case WidgetActionType.RESET_WIDGET:
      return initialState;

    default:
      return state;
  }
}

// Create context
const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

// Provider component
interface WidgetProviderProps {
  children: ReactNode;
}

export function WidgetProvider({ children }: WidgetProviderProps) {
  const [state, dispatch] = useReducer(widgetReducer, initialState);

  // Helper methods
  const updateAnswer = (key: string, value: string) => {
    dispatch({
      type: WidgetActionType.UPDATE_ANSWER,
      payload: { key, value }
    });
  };

  const nextQuestion = () => {
    dispatch({ type: WidgetActionType.GO_TO_NEXT_QUESTION });
  };

  const previousQuestion = () => {
    dispatch({ type: WidgetActionType.GO_TO_PREVIOUS_QUESTION });
  };

  const setFlow = (flow: 'inspire' | 'planning') => {
    dispatch({
      type: WidgetActionType.SET_FLOW,
      payload: flow
    });
  };

  const generateTrip = async () => {
    if (!state.currentFlow) {
      dispatch({
        type: WidgetActionType.SET_ERROR,
        payload: 'No flow selected'
      });
      return;
    }

    dispatch({ type: WidgetActionType.SET_LOADING, payload: true });

    try {
      // Step 1: Generate trip content
      const tripResponse = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: state.answers,
          flow: state.currentFlow
        }),
      });

      const tripData = await tripResponse.json();

      if (!tripData.success) {
        throw new Error(tripData.error || 'Failed to generate trip');
      }

      dispatch({
        type: WidgetActionType.SET_TRIP_CONTENT,
        payload: tripData.tripContent
      });

      // Step 2: Search for matching experts using AI-powered system
      try {
        console.log('🤖 Starting AI-powered expert search...');
        
        const expertResponse = await fetch('/api/experts/ai-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: state.answers
          }),
        });

        if (!expertResponse.ok) {
          throw new Error(`Expert search API failed: ${expertResponse.status}`);
        }

        const expertData = await expertResponse.json();
        
        if (expertData.success) {
          console.log('🎯 AI found experts:', {
            count: expertData.totalFound,
            generatedTags: expertData.generatedTags,
            formula: expertData.airtableFormula?.substring(0, 100) + '...'
          });
          
          dispatch({
            type: WidgetActionType.SET_MATCHED_EXPERTS,
            payload: expertData.experts || []
          });
        } else {
          throw new Error(expertData.error || 'Expert search failed');
        }
        
      } catch (expertError) {
        console.error('🚨 AI Expert search failed:', expertError);
        
        // Fallback to old system if AI fails
        try {
          console.log('🔄 Falling back to legacy expert search...');
          const { searchExperts } = await import('@/utils/expertFilter');
          const fallbackResult = await searchExperts(state.answers);
          
          dispatch({
            type: WidgetActionType.SET_MATCHED_EXPERTS,
            payload: fallbackResult.experts || []
          });
        } catch (fallbackError) {
          console.error('🚨 Fallback expert search also failed:', fallbackError);
          // Don't fail the whole process if expert search fails
          dispatch({
            type: WidgetActionType.SET_MATCHED_EXPERTS,
            payload: []
          });
        }
      }

    } catch (error) {
      dispatch({
        type: WidgetActionType.SET_ERROR,
        payload: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const resetWidget = () => {
    dispatch({ type: WidgetActionType.RESET_WIDGET });
  };

  const contextValue: WidgetContextType = {
    state,
    dispatch,
    updateAnswer,
    nextQuestion,
    previousQuestion,
    setFlow,
    generateTrip,
    resetWidget
  };

  return (
    <WidgetContext.Provider value={contextValue}>
      {children}
    </WidgetContext.Provider>
  );
}

// Custom hook to use the context
export function useWidget() {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
}