import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken, AdminTokenPayload } from '../utils/jwt.js';

export interface AdminRequest extends Request {
  admin?: AdminTokenPayload;
}

export const requireAdmin = (req: AdminRequest, res: Response, next: NextFunction): void => {
  // Check cookie or Bearer token header
  const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication required.' });
    return;
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired admin session.' });
    return;
  }

  req.admin = payload;
  next();
};
