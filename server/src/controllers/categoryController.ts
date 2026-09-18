import { Request, Response } from 'express';
import { store } from '../services/store.js';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await store.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const category = await store.createCategory(name.trim(), slug);
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await store.deleteCategory(id);
    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
};
