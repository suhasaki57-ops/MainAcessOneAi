import { Router } from 'express';
import { getHistory } from '../controllers/history.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT);
router.get('/', getHistory);

export default router;
