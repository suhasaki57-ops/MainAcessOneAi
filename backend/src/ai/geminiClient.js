import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';

export const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-8b',
];

export const getGeminiModel = (modelName = 'gemini-2.0-flash') => {
  const apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY;
  const client = new GoogleGenerativeAI(apiKey || '');
  return client.getGenerativeModel({ model: modelName });
};

export default genAI;

