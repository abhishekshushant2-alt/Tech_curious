import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.get('/', getCategories);
router.post('/', requireAdmin, createCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
