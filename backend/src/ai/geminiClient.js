import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';

const genAI = new GoogleGenerativeAI(env.geminiApiKey || 'mock_key');

export const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-8b',
];

export const getGeminiModel = (modelName = 'gemini-2.0-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;

