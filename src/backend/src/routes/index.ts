import { Router } from 'express';
import authRoutes from './auth';
import profileRoutes from './profiles';

const router = Router();

// API v1 routes
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);

export default router;
