import { isConnectedToMongo } from '../config/db.js';
import { Category, ICategory } from '../models/Category.js';
import { Project, IProject } from '../models/Project.js';
import { Feedback, IFeedback } from '../models/Feedback.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { OtpSession } from '../models/OtpSession.js';
import { initialCategories, initialProjects } from '../seed/seedData.js';

// In-Memory Fallback Collections
let memCategories = [...initialCategories];
let memProjects = [...initialProjects];
let memFeedback: any[] = [
  {
    _id: 'fb-1',
    project: 'proj-esp32-rover',
    name: 'Alex Rivera',
    message: 'Incredible SLAM tutorial! The micro-ROS baud rate tip saved me hours of debugging.',
    rating: 5,
    approved: true,
    createdAt: new Date('2026-08-20'),
  },
  {
    _id: 'fb-2',
    project: 'proj-smart-energy',
    name: 'Devin K.',
    message: 'Built this over the weekend with 4 CT clamps. Home Assistant dashboard works like a charm.',
    rating: 5,
    approved: true,
    createdAt: new Date('2026-08-30'),
  },
];
let memContactMessages: any[] = [];
let memOtpSessions: any[] = [];

// Seed MongoDB if empty on startup
export const initDatabaseIfConnected = async () => {
  if (!isConnectedToMongo) return;
  try {
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('🌱 Seeding initial categories into MongoDB...');
      const createdCats: Record<string, any> = {};
      for (const cat of initialCategories) {
        const c = await Category.create({ name: cat.name, slug: cat.slug });
        createdCats[cat._id] = c._id;
      }

      console.log('🌱 Seeding initial projects into MongoDB...');
      for (const p of initialProjects) {
        await Project.create({
          ...p,
          _id: undefined,
          category: createdCats[p.category] || null,
        });
      }
      console.log('✅ MongoDB database seeded successfully.');
    }
  } catch (error) {
    console.warn('⚠️ Seeding error:', error);
  }
};

export const store = {
  // Categories
  async getCategories() {
    if (isConnectedToMongo) {
      return await Category.find().sort({ name: 1 });
    }
    return memCategories;
  },

  async createCategory(name: string, slug: string) {
    if (isConnectedToMongo) {
      return await Category.create({ name, slug });
    }
    const newCat = { _id: `cat-${Date.now()}`, name, slug, createdAt: new Date() };
    memCategories.push(newCat);
    return newCat;
  },

  async deleteCategory(id: string) {
    if (isConnectedToMongo) {
      return await Category.findByIdAndDelete(id);
    }
    memCategories = memCategories.filter((c) => c._id !== id);
    return true;
  },

  // Projects
  async getProjects(filters: { categorySlug?: string; search?: string; status?: string }) {
    if (isConnectedToMongo) {
      const query: any = {};
      if (filters.status) query.status = filters.status;
      if (filters.categorySlug) {
        const cat = await Category.findOne({ slug: filters.categorySlug });
        if (cat) query.category = cat._id;
      }
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { shortDescription: { $regex: filters.search, $options: 'i' } },
        ];
      }
      return await Project.find(query).populate('category').sort({ createdAt: -1 });
    }

    let results = [...memProjects];
    if (filters.status) {
      results = results.filter((p) => p.status === filters.status);
    }
    if (filters.categorySlug) {
      const cat = memCategories.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        results = results.filter((p) => p.category === cat._id || (p.category as any)?._id === cat._id);
      }
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (p) => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }

    // Populate category object for memory items
    return results.map((p) => {
      const catObj = memCategories.find((c) => c._id === p.category || (p.category as any)?._id === c._id);
      return { ...p, category: catObj || { name: 'General', slug: 'general' } };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getProjectBySlug(slug: string) {
    if (isConnectedToMongo) {
      return await Project.findOne({ slug }).populate('category');
    }
    const proj = memProjects.find((p) => p.slug === slug);
    if (!proj) return null;
    const catObj = memCategories.find((c) => c._id === proj.category || (proj.category as any)?._id === c._id);
    return { ...proj, category: catObj || { name: 'General', slug: 'general' } };
  },

  async getProjectById(id: string) {
    if (isConnectedToMongo) {
      return await Project.findById(id).populate('category');
    }
    const proj = memProjects.find((p) => p._id === id);
    if (!proj) return null;
    const catObj = memCategories.find((c) => c._id === proj.category);
    return { ...proj, category: catObj || { name: 'General', slug: 'general' } };
  },

  async createProject(projectData: any) {
    if (isConnectedToMongo) {
      return await Project.create(projectData);
    }
    const newProj = {
      ...projectData,
      _id: `proj-${Date.now()}`,
      likeCount: 0,
      likedBy: [],
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memProjects.unshift(newProj);
    return newProj;
  },

  async updateProject(id: string, updateData: any) {
    if (isConnectedToMongo) {
      return await Project.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true });
    }
    const idx = memProjects.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    memProjects[idx] = { ...memProjects[idx], ...updateData, updatedAt: new Date() };
    return memProjects[idx];
  },

  async deleteProject(id: string) {
    if (isConnectedToMongo) {
      await Feedback.deleteMany({ project: id });
      return await Project.findByIdAndDelete(id);
    }
    memProjects = memProjects.filter((p) => p._id !== id);
    memFeedback = memFeedback.filter((f) => f.project !== id);
    return true;
  },

  async incrementViewCount(slug: string) {
    if (isConnectedToMongo) {
      return await Project.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } });
    }
    const proj = memProjects.find((p) => p.slug === slug);
    if (proj) proj.viewCount = (proj.viewCount || 0) + 1;
    return proj;
  },

  async toggleLike(projectId: string, deviceId: string) {
    if (isConnectedToMongo) {
      const proj = await Project.findById(projectId);
      if (!proj) return null;
      const alreadyLiked = proj.likedBy.includes(deviceId);
      if (alreadyLiked) {
        proj.likedBy = proj.likedBy.filter((id) => id !== deviceId);
        proj.likeCount = Math.max(0, proj.likeCount - 1);
      } else {
        proj.likedBy.push(deviceId);
        proj.likeCount += 1;
      }
      await proj.save();
      return { liked: !alreadyLiked, likeCount: proj.likeCount };
    }

    const proj = memProjects.find((p) => p._id === projectId);
    if (!proj) return null;
    const alreadyLiked = proj.likedBy.includes(deviceId);
    if (alreadyLiked) {
      proj.likedBy = proj.likedBy.filter((id) => id !== deviceId);
      proj.likeCount = Math.max(0, proj.likeCount - 1);
    } else {
      proj.likedBy.push(deviceId);
      proj.likeCount += 1;
    }
    return { liked: !alreadyLiked, likeCount: proj.likeCount };
  },

  // Feedback
  async getProjectFeedback(projectId: string) {
    if (isConnectedToMongo) {
      return await Feedback.find({ project: projectId, approved: true }).sort({ createdAt: -1 });
    }
    return memFeedback
      .filter((f) => f.project === projectId && f.approved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAllFeedbackForAdmin() {
    if (isConnectedToMongo) {
      return await Feedback.find().populate('project', 'title slug').sort({ createdAt: -1 });
    }
    return memFeedback.map((f) => {
      const proj = memProjects.find((p) => p._id === f.project);
      return { ...f, project: proj ? { _id: proj._id, title: proj.title, slug: proj.slug } : null };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createFeedback(feedbackData: any) {
    if (isConnectedToMongo) {
      return await Feedback.create(feedbackData);
    }
    const newFb = {
      ...feedbackData,
      _id: `fb-${Date.now()}`,
      approved: true,
      createdAt: new Date(),
    };
    memFeedback.unshift(newFb);
    return newFb;
  },

  async deleteFeedback(id: string) {
    if (isConnectedToMongo) {
      return await Feedback.findByIdAndDelete(id);
    }
    memFeedback = memFeedback.filter((f) => f._id !== id);
    return true;
  },

  // Contact
  async createContactMessage(data: { name: string; email: string; message: string }) {
    if (isConnectedToMongo) {
      return await ContactMessage.create(data);
    }
    const newMsg = { ...data, _id: `msg-${Date.now()}`, createdAt: new Date() };
    memContactMessages.push(newMsg);
    return newMsg;
  },

  // OTP Sessions
  async saveOtp(email: string, otpHash: string) {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    if (isConnectedToMongo) {
      await OtpSession.deleteMany({ email });
      return await OtpSession.create({ email, otpHash, expiresAt, verified: false });
    }
    memOtpSessions = memOtpSessions.filter((s) => s.email !== email);
    const session = { email, otpHash, expiresAt, verified: false };
    memOtpSessions.push(session);
    return session;
  },

  async getValidOtpSession(email: string) {
    const now = new Date();
    if (isConnectedToMongo) {
      return await OtpSession.findOne({ email, expiresAt: { $gt: now } }).sort({ expiresAt: -1 });
    }
    return memOtpSessions.find((s) => s.email === email && new Date(s.expiresAt) > now);
  },

  async deleteOtpSession(email: string) {
    if (isConnectedToMongo) {
      return await OtpSession.deleteMany({ email });
    }
    memOtpSessions = memOtpSessions.filter((s) => s.email !== email);
    return true;
  },
};
