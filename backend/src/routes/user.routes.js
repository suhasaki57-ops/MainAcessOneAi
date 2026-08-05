import { Router } from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../validations/auth.validation.js';

const router = Router();

router.use(verifyJWT);

router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileSchema), updateProfile);
router.put('/change-password', validateRequest(changePasswordSchema), changePassword);
router.delete('/delete-account', deleteAccount);

export default router;
