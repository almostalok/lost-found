import { Router } from 'express';
import { claimController } from '../controllers/claim.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, claimController.create);
router.get('/me', authMiddleware, claimController.getMyClaims);
router.get('/chats', authMiddleware, claimController.getMyChats);
router.get('/item/:itemId', authMiddleware, claimController.getByItem);
router.patch('/:id/status', authMiddleware, claimController.updateStatus);

router.get('/:id/messages', authMiddleware, claimController.getMessages);
router.post('/:id/messages', authMiddleware, claimController.addMessage);

export default router;
