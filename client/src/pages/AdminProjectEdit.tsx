import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ProjectEditor } from '../components/admin/ProjectEditor.js';
import { Project } from '../lib/types.js';
import api from '../lib/api.js';

export const AdminProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { admin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const res = await api.get(`/projects/id/${id}`);
        if (res.data?.success) {
          setProject(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load project for editing:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (admin) {
      fetchProject();
    }
  }, [id, admin]);

  if (authLoading || loadingData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-slate-500">
        Project not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Edit Project: {project.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update specifications, bill of materials, source files, or status.
        </p>
      </div>

      <ProjectEditor initialProject={project} isEditMode={true} />
    </div>
  );
};
