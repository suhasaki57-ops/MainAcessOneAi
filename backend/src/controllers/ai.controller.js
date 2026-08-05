import { asyncHandler } from '../utils/asyncHandler.js';
import { aiEngine } from '../ai/aiService.js';

const formatAIResponse = (res, statusCode, data, message = 'Success', startTime) => {
  const processingTime = `${Date.now() - startTime} ms`;
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString(),
    processingTime,
  });
};

export const chat = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { prompt, history } = req.body;
  const output = await aiEngine.copilotChat(prompt, history);
  return formatAIResponse(res, 200, { response: output }, 'AI Copilot response generated', startTime);
});

export const simplify = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text, level } = req.body;
  const output = await aiEngine.simplifyText(text, level);
  return formatAIResponse(res, 200, { simplifiedText: output, level }, 'Text simplified successfully', startTime);
});

export const translate = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text, targetLanguage } = req.body;
  const output = await aiEngine.translateText(text, targetLanguage);
  return formatAIResponse(res, 200, { translatedText: output, targetLanguage }, 'Translation completed successfully', startTime);
});

export const analyze = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text } = req.body;
  const report = await aiEngine.analyzeAccessibility(text);
  return formatAIResponse(res, 200, report, 'Accessibility analysis completed', startTime);
});

export const summarize = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text } = req.body;
  const summaryObj = await aiEngine.summarizeDocument(text);
  return formatAIResponse(res, 200, summaryObj, 'Document summary generated', startTime);
});

export const generateAltText = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { imageDescription } = req.body;
  const altObj = await aiEngine.generateAltText(imageDescription);
  return formatAIResponse(res, 200, altObj, 'Alt text generated successfully', startTime);
});

export const cleanOCR = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { rawOCRText } = req.body;
  const cleanObj = await aiEngine.cleanOCRText(rawOCRText);
  return formatAIResponse(res, 200, cleanObj, 'OCR text sanitized and structured', startTime);
});

export const websiteReport = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { websiteContent } = req.body;
  const report = await aiEngine.generateWebsiteReport(websiteContent);
  return formatAIResponse(res, 200, report, 'Website accessibility report generated', startTime);
});

export const readingAssistant = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text, query } = req.body;
  const answer = await aiEngine.readingAssistant(text, query);
  return formatAIResponse(res, 200, { answer }, 'Reading assistant answer generated', startTime);
});
