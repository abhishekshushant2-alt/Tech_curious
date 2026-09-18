import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ProjectEditor } from '../components/admin/ProjectEditor.js';

export const AdminProjectNew: React.FC = () => {
  const { admin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, loading, navigate]);

  if (loading || !admin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Create New Project Tutorial
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Publish an in-depth hardware build guide with step-by-step assembly, BOM parts list, and firmware.
        </p>
      </div>

      <ProjectEditor isEditMode={false} />
    </div>
  );
};
