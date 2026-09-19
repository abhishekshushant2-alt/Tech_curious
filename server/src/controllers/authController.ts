import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { signAdminToken } from '../utils/jwt.js';
import { store } from '../services/store.js';
import { AdminRequest } from '../middleware/requireAdmin.js';

// Support comma-separated admin emails or fallback
const getAdminEmails = (): string[] => {
  const configured = process.env.ADMIN_EMAIL || 'admin@techcurious.com';
  return configured
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
};

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'A valid email is required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const allowedAdmins = getAdminEmails();

    // Security practice: do not leak whether an email exists if rejected
    if (!allowedAdmins.includes(normalizedEmail)) {
      // Small artificial delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 400));
      res.status(403).json({ success: false, message: 'Access denied. You are not authorized to access the admin portal.' });
      return;
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await store.saveOtp(normalizedEmail, otpHash);
    await sendOtpEmail(normalizedEmail, otp);

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}. (Valid for 5 minutes)`,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error: any) {
    console.error('Request OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate OTP code. Please try again.' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Email and 6-digit OTP code are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const session = await store.getValidOtpSession(normalizedEmail);

    if (!session) {
      res.status(400).json({ success: false, message: 'OTP code expired or session invalid. Please request a new code.' });
      return;
    }

    const isMatch = await bcrypt.compare(otp.trim(), session.otpHash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
      return;
    }

    // Clean up session
    await store.deleteOtpSession(normalizedEmail);

    // Generate JWT token
    const token = signAdminToken(normalizedEmail);

    // Set secure httpOnly cookie (supports cross-origin Vercel <-> Render in production)
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      email: normalizedEmail,
      token, // also return token for header fallback
    });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP code.' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AdminRequest, res: Response): Promise<void> => {
  if (req.admin) {
    res.status(200).json({ success: true, admin: req.admin });
  } else {
    res.status(401).json({ success: false, message: 'Unauthenticated.' });
  }
};
