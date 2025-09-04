// TypeScript интерфейсы для Outdoorable Widget

// Типы вопросов
export type QuestionType = 'single_select' | 'multi_select' | 'text';
export type FlowType = 'inspire' | 'planning';

// Условия для показа вопросов
export interface QuestionCondition {
  equals?: { key: string; value: string };
  notEquals?: { key: string; value: string };
  notIn?: { key: string; values: string[] };
  all?: QuestionCondition[];
  // Legacy conditions для backward compatibility
  skipIf?: { [key: string]: string[] };
  showIf?: { [key: string]: string };
  dependsOn?: string;
}

// Интерфейс вопроса
export interface Question {
  id: string;
  flow: FlowType;
  type: QuestionType;
  key: string;
  text: string;
  options?: string[];
  condition?: QuestionCondition;
  example?: string;
  other_text_key?: string;
}

// Ответы пользователя
export interface UserAnswers {
  [key: string]: string | string[];
}

// Состояния виджета
export type WidgetState = 
  | 'flow-selection'
  | 'questions'
  | 'loading'
  | 'results'
  | 'error';

// Интерфейс эксперта
export interface Expert {
  id: string;
  name: string;
  profession: string;
  bio: string;
  profileUrl: string;
  email: string;
  expertise: string[];
  travelTypes: string[];
  locations: string[];
  profileImage?: string;
  calendlyUrl?: string;
}

// Результат фильтрации экспертов
export interface ExpertMatch {
  expert: Expert;
  score: number;
  matchReason: string;
}

// API запрос для генерации гида
export interface GenerateGuideRequest {
  flow_type: FlowType;
  answers: UserAnswers;
}

// API ответ с гидом и экспертами
export interface GenerateGuideResponse {
  tripGuide: string;
  experts: ExpertMatch[];
  success: boolean;
  error?: string;
}

// Контекст виджета
export interface WidgetContextType {
  // Состояние
  currentState: WidgetState;
  currentFlow: FlowType | null;
  currentQuestionIndex: number;
  
  // Данные
  answers: UserAnswers;
  questions: Question[];
  experts: Expert[];
  tripGuide: string | null;
  matchedExperts: ExpertMatch[];
  
  // Методы
  startFlow: (flow: FlowType) => void;
  answerQuestion: (key: string, value: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  generateTripGuide: () => Promise<void>;
  reset: () => void;
  
  // Состояние загрузки и ошибок
  loading: boolean;
  error: string | null;
}

// Конфигурация OpenAI промпта
export interface PromptConfig {
  system: string;
  userTemplate: string;
  temperature: number;
  maxTokens: number;
}

// Географические данные для фильтрации экспертов
export interface GeographicData {
  continent?: string;
  country: string;
  region?: string;
  city?: string;
  specificLocation?: string;
}

// Критерии фильтрации экспертов
export interface ExpertFilterCriteria {
  geography: GeographicData;
  activities: string[];
  travelStyle: string[];
  partyType: string;
  fitnessLevel: string;
}

// Настройки виджета
export interface WidgetConfig {
  apiBaseUrl: string;
  openaiApiKey?: string;
  debugMode: boolean;
  showProgressBar: boolean;
  theme: {
    primaryColor: string;
    lightGreen: string;
    darkGreen: string;
    orange: string;
    textColor: string;
    textColorLight: string;
  };
}

// Экспортируем дефолтную тему из оригинального CSS
export const DEFAULT_THEME = {
  primaryColor: '#4A8B5C',
  lightGreen: '#E8F5E8',
  darkGreen: '#D4EDD4',
  orange: '#FF8C42',
  textColor: '#2E4B3E',
  textColorLight: '#4A6741',
};

// Утилитарные типы
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;