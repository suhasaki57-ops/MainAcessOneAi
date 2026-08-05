import { Router } from 'express';
import {
  chat,
  simplify,
  translate,
  analyze,
  summarize,
  generateAltText,
  cleanOCR,
  websiteReport,
  readingAssistant,
} from '../controllers/ai.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import {
  chatSchema,
  simplifySchema,
  translateSchema,
  analyzeSchema,
  altTextSchema,
  ocrCleanSchema,
  summarizeSchema,
  websiteReportSchema,
  readingAssistantSchema,
} from '../validations/ai.validation.js';

const router = Router();

router.use(verifyJWT);

router.post('/chat', validateRequest(chatSchema), chat);
router.post('/simplify', validateRequest(simplifySchema), simplify);
router.post('/translate', validateRequest(translateSchema), translate);
router.post('/analyze', validateRequest(analyzeSchema), analyze);
router.post('/summarize', validateRequest(summarizeSchema), summarize);
router.post('/alt-text', validateRequest(altTextSchema), generateAltText);
router.post('/ocr-clean', validateRequest(ocrCleanSchema), cleanOCR);
router.post('/accessibility-report', validateRequest(websiteReportSchema), websiteReport);
router.post('/reading-assistant', validateRequest(readingAssistantSchema), readingAssistant);

export default router;
