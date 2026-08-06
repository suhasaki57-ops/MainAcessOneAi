import { Router } from 'express';
import { getHistory, createHistory, toggleFavorite, deleteHistory } from '../controllers/history.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT);
router.get('/', getHistory);
router.post('/', createHistory);
router.patch('/:id/favorite', toggleFavorite);
router.delete('/:id', deleteHistory);

export default router;
