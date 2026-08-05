import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';

const genAI = new GoogleGenerativeAI(env.geminiApiKey || 'mock_key');

// gemini-1.5-flash is ultra-fast, lightweight, and optimized for Free Tier quotas
export const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;
