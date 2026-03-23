import { Router } from 'express';
import authRoutes from './auth.routes';
import itemRoutes from './item.routes';
import claimRoutes from './claim.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/claims', claimRoutes);
router.use('/notifications', notificationRoutes);

export default router;
