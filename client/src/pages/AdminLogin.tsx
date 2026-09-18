import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { OtpLoginForm } from '../components/admin/OtpLoginForm.js';

export const AdminLogin: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Tech Curious Public Site</span>
        </Link>
      </div>

      <OtpLoginForm />
    </div>
  );
};
