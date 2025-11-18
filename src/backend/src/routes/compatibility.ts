import { Router } from 'express';
import { compatibilityController } from '../controllers/CompatibilityController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Compatibility calculations
router.post('/pair', authenticate, compatibilityController.calculatePairCompatibility);
router.post('/team', authenticate, compatibilityController.calculateTeamCompatibility);

export default router;
