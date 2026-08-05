import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import documentRoutes from './document.routes.js';
import aiRoutes from './ai.routes.js';
import historyRoutes from './history.routes.js';
import settingsRoutes from './settings.routes.js';
import accessibilityRoutes from './accessibility.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/document', documentRoutes);
router.use('/ai', aiRoutes);
router.use('/history', historyRoutes);
router.use('/settings', settingsRoutes);
router.use('/accessibility', accessibilityRoutes);

export default router;
