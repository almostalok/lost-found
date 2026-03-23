import { Router } from 'express';
import { claimController } from '../controllers/claim.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, claimController.create);
router.get('/me', authMiddleware, claimController.getMyClaims);
router.get('/item/:itemId', authMiddleware, claimController.getByItem);
router.patch('/:id/status', authMiddleware, claimController.updateStatus);

export default router;
