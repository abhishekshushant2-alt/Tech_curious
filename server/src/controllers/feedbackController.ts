import { Request, Response } from 'express';
import { store } from '../services/store.js';

export const getProjectFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const feedback = await store.getProjectFeedback(id);
    res.status(200).json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch feedback.' });
  }
};

export const getAllFeedbackAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const feedback = await store.getAllFeedbackForAdmin();
    res.status(200).json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch all feedback.' });
  }
};

export const createFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { name, email, message, rating } = req.body;

    if (!name || !message) {
      res.status(400).json({ success: false, message: 'Name and message are required.' });
      return;
    }

    const newFeedback = await store.createFeedback({
      project: id,
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      message: message.trim(),
      rating: rating ? Number(rating) : undefined,
      approved: true, // auto-publish with admin post-moderation
    });

    res.status(201).json({ success: true, data: newFeedback, message: 'Feedback submitted successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to submit feedback.' });
  }
};

export const deleteFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await store.deleteFeedback(id);
    res.status(200).json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete feedback.' });
  }
};
