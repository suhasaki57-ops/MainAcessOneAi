import { asyncHandler } from '../utils/asyncHandler.js';
import { processFileDocument, processURLDocument, processTextDocument } from '../services/document/documentProcessor.js';
import { documentStorage } from '../services/document/documentStorageService.js';
import { setActiveDocumentContext } from '../services/document/contextBuilder.js';
import { aiEngine } from '../ai/aiService.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Document file is required (PDF, Image, Text)');
  }
  const result = await processFileDocument(req.file, req.user?.id, req.body.title);
  return res.status(201).json(new ApiResponse(201, result, 'Document uploaded and processed successfully'));
});

export const processUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const result = await processURLDocument(url, req.user?.id);
  return res.status(201).json(new ApiResponse(201, result, 'Website URL content scraped and saved'));
});

export const processText = asyncHandler(async (req, res) => {
  const { title, text } = req.body;
  const result = await processTextDocument(title, text, req.user?.id);
  return res.status(201).json(new ApiResponse(201, result, 'Raw text document ingested and saved'));
});

export const getDocuments = asyncHandler(async (req, res) => {
  const { type, search, favorite } = req.query;
  const documents = await documentStorage.getUserDocuments(req.user?.id, { type, search, favorite });
  return res.status(200).json(new ApiResponse(200, documents, 'User documents fetched successfully'));
});

export const getDocumentById = asyncHandler(async (req, res) => {
  const document = await documentStorage.getDocumentById(req.params.id);
  if (!document) {
    throw new ApiError(404, 'Document not found');
  }
  return res.status(200).json(new ApiResponse(200, document, 'Document details retrieved'));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await documentStorage.deleteDocument(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Document deleted successfully'));
});

export const processDocumentWithAI = asyncHandler(async (req, res) => {
  const { documentId, feature } = req.body;
  const doc = await documentStorage.getDocumentById(documentId);
  if (!doc) {
    throw new ApiError(404, 'Target document not found');
  }

  let aiOutput = null;
  const text = doc.extracted_text || doc.title;

  switch (feature) {
    case 'summarize':
      aiOutput = await aiEngine.summarizeDocument(text);
      break;
    case 'simplify':
      aiOutput = await aiEngine.simplifyText(text, 'simple');
      break;
    case 'translate':
      aiOutput = await aiEngine.translateText(text, 'Spanish');
      break;
    case 'analyze':
      aiOutput = await aiEngine.analyzeAccessibility(text);
      break;
    default:
      aiOutput = await aiEngine.summarizeDocument(text);
  }

  return res.status(200).json(new ApiResponse(200, { feature, aiOutput }, 'Document processed with AI Engine'));
});

export const setContext = asyncHandler(async (req, res) => {
  const { documentId } = req.body;
  const doc = await documentStorage.getDocumentById(documentId);
  if (!doc) {
    throw new ApiError(404, 'Target document not found for AI context');
  }

  setActiveDocumentContext(req.user?.id, doc);
  return res.status(200).json(new ApiResponse(200, { activeDocumentId: doc.id, title: doc.title }, 'Document context activated for AI Copilot'));
});
