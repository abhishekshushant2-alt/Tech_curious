import { Router } from 'express';
import {
  getProjectFeedback,
  getAllFeedbackAdmin,
  createFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { feedbackLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/admin/all', requireAdmin, getAllFeedbackAdmin);
router.get('/:id', getProjectFeedback);
router.post('/:id', feedbackLimiter, createFeedback);
router.delete('/:id', requireAdmin, deleteFeedback);

export default router;
