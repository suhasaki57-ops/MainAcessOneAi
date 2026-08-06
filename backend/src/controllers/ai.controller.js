import { asyncHandler } from '../utils/asyncHandler.js';
import { aiEngine } from '../ai/aiService.js';
import ActivityLogService from '../services/activityLogService.js';

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

  ActivityLogService.logAIChat(req.user?.id || 'demo-user-101', prompt || 'Copilot Chat', output?.length || 0, req);

  return formatAIResponse(res, 200, { response: output }, 'AI Copilot response generated', startTime);
});

export const simplify = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text, level } = req.body;
  const output = await aiEngine.simplifyText(text, level);

  ActivityLogService.logTextSimplification(req.user?.id || 'demo-user-101', text?.length || 0, level || 'simple', req);

  return formatAIResponse(res, 200, { simplifiedText: output, level }, 'Text simplified successfully', startTime);
});

export const translate = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text, targetLanguage } = req.body;
  const output = await aiEngine.translateText(text, targetLanguage);

  ActivityLogService.logTranslation(req.user?.id || 'demo-user-101', 'English', targetLanguage || 'Spanish', text?.length || 0, req);

  return formatAIResponse(res, 200, { translatedText: output, targetLanguage }, 'Translation completed successfully', startTime);
});

export const analyze = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text } = req.body;
  const report = await aiEngine.analyzeAccessibility(text);

  ActivityLogService.logAudit(req.user?.id || 'demo-user-101', 'Submitted Text', report?.accessibilityScore || 90, req);

  return formatAIResponse(res, 200, report, 'Accessibility analysis completed', startTime);
});

export const summarize = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text } = req.body;
  const summaryObj = await aiEngine.summarizeDocument(text);

  ActivityLogService.createLog({
    userId: req.user?.id || 'demo-user-101',
    action: 'Document Summarization',
    category: 'Prompts',
    description: `Summarized document: "${summaryObj?.title || 'Document'}"`,
    req,
  });

  return formatAIResponse(res, 200, summaryObj, 'Document summary generated', startTime);
});

export const generateAltText = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { imageDescription } = req.body;
  const altObj = await aiEngine.generateAltText(imageDescription);

  ActivityLogService.createLog({
    userId: req.user?.id || 'demo-user-101',
    action: 'Alt Text Generated',
    category: 'Scans',
    description: `Generated screen reader alt text for image`,
    req,
  });

  return formatAIResponse(res, 200, altObj, 'Alt text generated successfully', startTime);
});

export const cleanOCR = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { rawOCRText } = req.body;
  const cleanObj = await aiEngine.cleanOCRText(rawOCRText);

  ActivityLogService.logOCRProcessing(req.user?.id || 'demo-user-101', 'Uploaded Document OCR', req);

  return formatAIResponse(res, 200, cleanObj, 'OCR text sanitized and structured', startTime);
});

export const websiteReport = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { websiteContent } = req.body;
  const report = await aiEngine.generateWebsiteReport(websiteContent);

  ActivityLogService.logWebsiteScan(req.user?.id || 'demo-user-101', websiteContent || 'Website URL', req);

  return formatAIResponse(res, 200, report, 'Website accessibility report generated', startTime);
});

export const readingAssistant = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { text, query } = req.body;
  const answer = await aiEngine.readingAssistant(text, query);
  return formatAIResponse(res, 200, { answer }, 'Reading assistant answer generated', startTime);
});
