import { Router } from 'express';
import {
  uploadDocument,
  processUrl,
  processText,
  getDocuments,
  getDocumentById,
  deleteDocument,
  processDocumentWithAI,
  setContext,
} from '../controllers/document.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { processUrlSchema, processTextSchema, setContextSchema } from '../validations/document.validation.js';

const router = Router();

router.use(verifyJWT);

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/url', validateRequest(processUrlSchema), processUrl);
router.post('/text', validateRequest(processTextSchema), processText);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.post('/process', processDocumentWithAI);
router.post('/context', validateRequest(setContextSchema), setContext);

export default router;
