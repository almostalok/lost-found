import { Router } from 'express';
import { itemController } from '../controllers/item.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createItemSchema, updateItemSchema } from '../validations/item.validation';

const router = Router();

// Public
router.get('/', itemController.getAll);
router.get('/:id', itemController.getById);
router.get('/:id/matches', itemController.getMatches);

// Protected
router.post('/', authMiddleware, validate(createItemSchema), itemController.create);
router.get('/user/me', authMiddleware, itemController.getMyItems);
router.put('/:id', authMiddleware, validate(updateItemSchema), itemController.update);
router.delete('/:id', authMiddleware, itemController.delete);

export default router;
