import { Router } from 'express';
import { requestOtp, verifyOtp, logout, getMe } from '../controllers/authController.js';
import { otpLimiter } from '../middleware/rateLimiter.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.post('/request-otp', otpLimiter, requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);

export default router;
