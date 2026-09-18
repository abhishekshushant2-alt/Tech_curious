import { Request, Response } from 'express';
import { store } from '../services/store.js';
import { sendContactNotification } from '../utils/sendEmail.js';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMsg = message.trim();

    const saved = await store.createContactMessage({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMsg,
    });

    // Notify admin
    await sendContactNotification(trimmedName, trimmedEmail, trimmedMsg);

    res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      data: saved,
    });
  } catch (error: any) {
    console.error('Contact submit error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};
