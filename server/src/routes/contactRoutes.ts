import { Router } from 'express';
import { submitContact } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', contactLimiter, submitContact);

export default router;
