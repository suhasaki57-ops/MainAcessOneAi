import { getGeminiModel, CANDIDATE_MODELS } from './geminiClient.js';
import {
  buildSimplifierPrompt,
  buildTranslationPrompt,
  buildAccessibilityAnalyzerPrompt,
  buildAltTextPrompt,
  buildOCRCleanPrompt,
  buildSummarizerPrompt,
  buildWebsiteAdvisorPrompt,
  buildReadingAssistantPrompt,
  buildCopilotChatPrompt,
} from './promptBuilder.js';
import aiCache from './aiCache.js';
import env from '../config/env.js';

// Core Gemini API Execution Engine (Pure Live Gemini Model Linkage)
const executeGeminiCall = async (systemInstruction, promptText, modelName = 'gemini-2.0-flash') => {
  const apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    throw new Error('GEMINI_API_KEY is unconfigured. Please configure a valid GEMINI_API_KEY in your backend environment variables.');
  }

  const modelsToTry = Array.from(new Set([modelName, ...CANDIDATE_MODELS]));
  let lastError = null;

  for (const candidateModel of modelsToTry) {
    try {
      const model = getGeminiModel(candidateModel);
      const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${promptText}` : promptText;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const textOutput = response.text();

      if (textOutput && textOutput.trim().length > 0) {
        return textOutput.trim();
      }
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model '${candidateModel}' execution note: ${err.message}`);
    }
  }

  throw new Error(`Gemini AI service error: ${lastError?.message || 'Failed to generate response from Gemini AI'}`);
};

// Safe JSON parser for Gemini responses
const parseGeminiJSON = (rawText) => {
  if (typeof rawText !== 'string') return rawText;
  const cleanJSON = rawText.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(cleanJSON);
  } catch (err) {
    return { rawResponse: rawText };
  }
};

export const aiEngine = {
  // 1. Text Simplifier
  simplifyText: async (text, level = 'simple') => {
    const cacheKey = `simplify_${level}_${text}`;
    const cached = aiCache.get(text, cacheKey);
    if (cached) return cached;

    const { systemInstruction, prompt } = buildSimplifierPrompt(text, level);
    const output = await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
    aiCache.set(text, cacheKey, output);
    return output;
  },

  // 2. Multi-Language Translator (Pure Gemini API Linkage)
  translateText: async (text, targetLang) => {
    const cacheKey = `translate_${targetLang}_${text}`;
    const cached = aiCache.get(text, cacheKey);
    if (cached) return cached;

    const { systemInstruction, prompt } = buildTranslationPrompt(text, targetLang);
    let output = await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');

    // Clean up any leading language prefixes if generated
    if (typeof output === 'string') {
      output = output.replace(/^(?:Traduction en [^:]+:|Traducción al [^:]+:|[\w\s]+ Translation:)\s*/i, '').trim();
    }

    aiCache.set(text, cacheKey, output);
    return output;
  },

  // 3. Accessibility Auditor
  analyzeAccessibility: async (text) => {
    const cacheKey = `analyze_${text}`;
    const cached = aiCache.get(text, cacheKey);
    if (cached) return cached;

    const { systemInstruction, prompt } = buildAccessibilityAnalyzerPrompt(text);
    const rawOutput = await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
    const result = parseGeminiJSON(rawOutput);

    aiCache.set(text, cacheKey, result);
    return result;
  },

  // 4. Alt Text Generator
  generateAltText: async (imageDescription) => {
    const cacheKey = `alttext_${imageDescription}`;
    const cached = aiCache.get(imageDescription, cacheKey);
    if (cached) return cached;

    const { systemInstruction, prompt } = buildAltTextPrompt(imageDescription);
    const rawOutput = await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
    const result = parseGeminiJSON(rawOutput);

    aiCache.set(imageDescription, cacheKey, result);
    return result;
  },

  // 5. OCR Post-Processing Engine
  cleanOCRText: async (rawOCRText) => {
    const cacheKey = `ocr_${rawOCRText}`;
    const cached = aiCache.get(rawOCRText, cacheKey);
    if (cached) return cached;

    const { systemInstruction, prompt } = buildOCRCleanPrompt(rawOCRText);
    const rawOutput = await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
    const result = parseGeminiJSON(rawOutput);

    aiCache.set(rawOCRText, cacheKey, result);
    return result;
  },

  // 6. Document Summarizer
  summarizeDocument: async (text) => {
    const cacheKey = `summary_${text}`;
    const cached = aiCache.get(text, cacheKey);
    if (cached) return cached;

    const { systemInstruction, prompt } = buildSummarizerPrompt(text);
    const rawOutput = await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
    const result = parseGeminiJSON(rawOutput);

    aiCache.set(text, cacheKey, result);
    return result;
  },

  // 7. Website Accessibility Auditor
  generateWebsiteReport: async (websiteContent) => {
    const cacheKey = `web_audit_${websiteContent}`;
    const cached = aiCache.get(websiteContent, cacheKey);
    if (cached) return cached;

    const { systemInstruction, prompt } = buildWebsiteAdvisorPrompt(websiteContent);
    const rawOutput = await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
    const result = parseGeminiJSON(rawOutput);

    aiCache.set(websiteContent, cacheKey, result);
    return result;
  },

  // 8. Reading Assistant Q&A
  readingAssistant: async (text, query) => {
    const { systemInstruction, prompt } = buildReadingAssistantPrompt(text, query);
    return await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
  },

  // 9. Gemini Copilot Chat
  copilotChat: async (query, history = [], activeDoc = null) => {
    const { systemInstruction, prompt } = buildCopilotChatPrompt(query, history, activeDoc);
    return await executeGeminiCall(systemInstruction, prompt, 'gemini-2.0-flash');
  },
};

export default aiEngine;
