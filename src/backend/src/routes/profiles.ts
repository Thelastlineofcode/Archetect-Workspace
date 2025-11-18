import { Router } from 'express';
import { profileController } from '../controllers/ProfileController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes (with authentication)
router.get('/questionnaire', authenticate, profileController.getQuestionnaire);

// Profile CRUD
router.post('/', authenticate, profileController.createProfile);
router.get('/me', authenticate, profileController.getMyProfile);
router.get('/:id', authenticate, profileController.getProfile);
router.put('/:id', authenticate, profileController.updateProfile);
router.delete('/:id', authenticate, profileController.deleteProfile);

export default router;
