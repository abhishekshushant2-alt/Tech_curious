import { Request, Response } from 'express';
import { store } from '../services/store.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, status } = req.query;

    const projects = await store.getProjects({
      categorySlug: category as string,
      search: search as string,
      status: (status as string) || 'published',
    });

    res.status(200).json({ success: true, data: projects });
  } catch (error: any) {
    console.error('getProjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

export const getAllProjectsAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await store.getProjects({});
    res.status(200).json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin projects.' });
  }
};

export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    const project = await store.getProjectBySlug(slug);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    // Increment view count asynchronously
    store.incrementViewCount(slug).catch(() => {});

    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch project.' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const project = await store.getProjectById(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch project.' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    let body = req.body;

    // Handle files if uploaded via multipart/form-data
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let thumbnailUrl = body.thumbnailImage;

    if (files?.thumbnail && files.thumbnail[0]) {
      thumbnailUrl = await uploadToCloudinary(files.thumbnail[0].buffer, 'tech-curious/thumbnails');
    }

    const detailImages: string[] = [];
    if (files?.details && files.details.length > 0) {
      for (const file of files.details) {
        const url = await uploadToCloudinary(file.buffer, 'tech-curious/details');
        detailImages.push(url);
      }
    } else if (typeof body.detailImages === 'string') {
      try {
        detailImages.push(...JSON.parse(body.detailImages));
      } catch {
        if (body.detailImages) detailImages.push(body.detailImages);
      }
    }

    // Parse stringified JSON fields if received from FormData
    const parseField = (field: any, defaultVal: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return defaultVal;
        }
      }
      return field || defaultVal;
    };

    const steps = parseField(body.steps, []);
    const components = parseField(body.components, []);
    const sourceCode = parseField(body.sourceCode, []);

    // Generate unique slug
    let slug = (body.slug || body.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await store.getProjectBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const projectData = {
      title: body.title,
      slug,
      category: body.category,
      thumbnailImage: thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      detailImages: detailImages.length > 0 ? detailImages : (body.detailImages || []),
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      steps,
      components,
      sourceCode,
      youtubeLink: body.youtubeLink || '',
      instagramLink: body.instagramLink || '',
      status: body.status || 'published',
    };

    const newProject = await store.createProject(projectData);
    res.status(201).json({ success: true, data: newProject });
  } catch (error: any) {
    console.error('createProject error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create project.' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    let body = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let thumbnailUrl = body.thumbnailImage;

    if (files?.thumbnail && files.thumbnail[0]) {
      thumbnailUrl = await uploadToCloudinary(files.thumbnail[0].buffer, 'tech-curious/thumbnails');
    }

    const parseField = (field: any, fallback: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return fallback;
        }
      }
      return field !== undefined ? field : fallback;
    };

    const updateData: any = {
      title: body.title,
      category: body.category,
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      youtubeLink: body.youtubeLink,
      instagramLink: body.instagramLink,
      status: body.status,
    };

    if (thumbnailUrl) updateData.thumbnailImage = thumbnailUrl;
    if (body.steps) updateData.steps = parseField(body.steps, []);
    if (body.components) updateData.components = parseField(body.components, []);
    if (body.sourceCode) updateData.sourceCode = parseField(body.sourceCode, []);
    if (body.detailImages) updateData.detailImages = parseField(body.detailImages, []);

    const updated = await store.updateProject(id, updateData);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error('updateProject error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await store.deleteProject(id);
    res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { deviceId } = req.body;

    if (!deviceId) {
      res.status(400).json({ success: false, message: 'Device identifier is required.' });
      return;
    }

    const result = await store.toggleLike(id, deviceId);
    if (!result) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to register like.' });
  }
};
