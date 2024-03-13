import express from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/event', eventRoutes);

export default router;
