import { useState, useMemo } from 'react';
import { Question, QuestionnaireData, FlowType } from '@/types/questionnaire';

export function useQuestionnaire(questions: Question[], flowType: FlowType) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startedAt] = useState(new Date());

  // Filter questions based on conditional logic
  const visibleQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (!question.conditionalLogic) {
        return true;
      }

      const { showIf, values } = question.conditionalLogic;
      const dependentAnswer = answers[showIf];
      
      if (!dependentAnswer) {
        return false;
      }

      // Handle array answers (multi-select)
      if (Array.isArray(dependentAnswer)) {
        return values.some(value => dependentAnswer.includes(value));
      }

      // Handle single value answers
      return values.includes(dependentAnswer);
    });
  }, [questions, answers]);

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === visibleQuestions.length - 1;

  const nextQuestion = () => {
    if (!isLast) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (!isFirst) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const setAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getQuestionnaireData = (): QuestionnaireData => {
    return {
      flowType,
      answers,
      startedAt,
      completedAt: isLast ? new Date() : undefined
    };
  };

  const isCurrentQuestionValid = () => {
    if (!currentQuestion) return false;
    
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.required) {
      if (answer === undefined || answer === null || answer === '') {
        return false;
      }
      
      // For multi-select questions, check if at least one option is selected
      if (Array.isArray(answer) && answer.length === 0) {
        return false;
      }
    }
    
    return true;
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < visibleQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  return {
    currentQuestionIndex,
    currentQuestion,
    visibleQuestions,
    answers,
    progress: Math.round(progress),
    isFirst,
    isLast,
    nextQuestion,
    prevQuestion,
    setAnswer,
    getQuestionnaireData,
    isCurrentQuestionValid,
    goToQuestion,
    totalQuestions: visibleQuestions.length
  };
}