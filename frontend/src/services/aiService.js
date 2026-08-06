import api from './api';

export const aiService = {
  chat: async (prompt, history = [], activeDoc = null) => {
    return await api.post('/ai/chat', { prompt, history, activeDoc });
  },
  simplify: async (text, level = 'simple') => {
    return await api.post('/ai/simplify', { text, level });
  },
  translate: async (text, targetLanguage) => {
    return await api.post('/ai/translate', { text, targetLanguage });
  },
  analyze: async (text) => {
    return await api.post('/ai/analyze', { text });
  },
  summarize: async (text) => {
    return await api.post('/ai/summarize', { text });
  },
  generateAltText: async (imageDescription) => {
    return await api.post('/ai/alt-text', { imageDescription });
  },
  cleanOCR: async (rawOCRText) => {
    return await api.post('/ai/ocr-clean', { rawOCRText });
  },
  generateWebsiteReport: async (websiteContent) => {
    return await api.post('/ai/accessibility-report', { websiteContent });
  },
  readingAssistant: async (text, query) => {
    return await api.post('/ai/reading-assistant', { text, query });
  },
};

export default aiService;
