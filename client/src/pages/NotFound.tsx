import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
        <Cpu className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white font-mono">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Page Signal Lost</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
        The circuit trace you followed does not connect to an active endpoint.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/20 hover:bg-brand-600 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};
