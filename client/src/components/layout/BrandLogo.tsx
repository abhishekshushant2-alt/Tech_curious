import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  const subSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
  };

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 select-none ${className}`}>
      {/* Sleek TC Monogram Emblem Badge */}
      <div
        className={`relative ${iconSizes[size]} overflow-hidden shadow-md shadow-brand-500/10 ring-1 ring-black/10 dark:ring-white/15 bg-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
      >
        <img
          src="/brand-logo.jpg"
          alt="Tech Curious Logo"
          className="w-full h-full object-cover select-none"
          loading="eager"
        />
      </div>

      {/* Production-Level Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-brand font-bold ${textSizes[size]} text-slate-950 dark:text-white tracking-[-0.035em] leading-none`}
          >
            Tech
          </span>
          <span
            className={`font-brand font-bold ${textSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 dark:from-brand-400 dark:via-indigo-300 dark:to-cyan-400 tracking-[-0.035em] leading-none ml-1`}
          >
            Curious
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${subSizes[size]} font-mono font-medium tracking-[0.16em] uppercase text-slate-400 dark:text-zinc-500 leading-none mt-0.5`}
          >
            Robotics &bull; IoT &bull; Hardware
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
