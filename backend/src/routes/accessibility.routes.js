import { Router } from 'express';
import {
  getAccessibilityPreferences,
  updateAccessibilityPreferences,
  getAccessibilityProfile,
  updateAccessibilityProfile,
  runAudit,
  runWebsiteAudit,
  getReportHistory,
  getReportById,
  deleteReport,
  exportReport,
  getAnalytics,
} from '../controllers/accessibility.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.get('/preferences', getAccessibilityPreferences);
router.put('/preferences', updateAccessibilityPreferences);
router.get('/profile', getAccessibilityProfile);
router.put('/profile', updateAccessibilityProfile);

router.post('/audit', runAudit);
router.post('/website', runWebsiteAudit);
router.post('/document', runAudit);
router.get('/history', getReportHistory);
router.get('/report/:id', getReportById);
router.delete('/report/:id', deleteReport);

router.post('/export/pdf', exportReport);
router.post('/export/json', exportReport);
router.post('/export/markdown', exportReport);
router.post('/export/txt', exportReport);

router.get('/analytics', getAnalytics);

export default router;
