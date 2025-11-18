import { Router } from 'express';
import authRoutes from './auth';
import profileRoutes from './profiles';
import compatibilityRoutes from './compatibility';

const router = Router();

// API v1 routes
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/compatibility', compatibilityRoutes);

export default router;
