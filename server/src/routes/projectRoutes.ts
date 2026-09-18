import { Router } from 'express';
import {
  getProjects,
  getAllProjectsAdmin,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleLike,
} from '../controllers/projectController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const projectUploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'details', maxCount: 8 },
]);

router.get('/', getProjects);
router.get('/admin/all', requireAdmin, getAllProjectsAdmin);
router.get('/id/:id', getProjectById);
router.get('/:slug', getProjectBySlug);
router.post('/:id/like', toggleLike);

router.post('/', requireAdmin, projectUploadFields, createProject);
router.put('/:id', requireAdmin, projectUploadFields, updateProject);
router.delete('/:id', requireAdmin, deleteProject);

export default router;
