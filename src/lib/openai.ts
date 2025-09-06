import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY2 || process.env.OPENAI_API_KEY,
});

export const MODELS = {
  TRIP_GUIDE: 'gpt-4o-mini',
  TAGGING: 'gpt-4o-mini',
} as const;

export type OpenAIModel = typeof MODELS[keyof typeof MODELS];