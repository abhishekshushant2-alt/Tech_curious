import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Youtube,
  Instagram,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from './SearchModal.js';
import { BrandLogo } from './BrandLogo.js';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { admin } = useAuth();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tutorials', path: '/projects' },
  ];

  return (
    <>
      <div className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none">
        <header className="pointer-events-auto max-w-5xl mx-auto glass-surface rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg shadow-black/[0.03] dark:shadow-black/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Production-Level Typography */}
            <Link to="/" className="group flex items-center shrink-0" title="Tech Curious Home">
              <BrandLogo size="sm" showSubtitle={false} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-white bg-slate-900 dark:bg-white dark:text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <a
                href="#contact"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                Contact
              </a>
            </nav>

            {/* Right Action Tools */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              {/* Search Pill Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-500 dark:text-zinc-400 bg-slate-100/80 dark:bg-dark-elevated/70 hover:bg-slate-200/80 dark:hover:bg-dark-elevated border border-black/[0.06] dark:border-white/[0.08] rounded-full transition-all"
                title="Search tutorials (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline font-medium">Search</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-white dark:bg-dark-surface rounded-md border border-black/10 dark:border-white/10 text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* YouTube Link */}
              <a
                href="https://www.youtube.com/@TechCuriousYT"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex p-2 text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
                title="YouTube Channel (@TechCuriousYT)"
              >
                <Youtube className="w-4 h-4" />
              </a>

              {/* Instagram Link */}
              <a
                href="https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex p-2 text-slate-500 hover:text-pink-500 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors"
                title="Instagram (@techcuriouss)"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* Admin Portal Shortcut */}
              <Link
                to={admin ? '/admin/dashboard' : '/admin/login'}
                className={`p-2 rounded-full transition-all relative ${
                  admin
                    ? 'text-brand-mint bg-brand-mint/10 border border-brand-mint/30'
                    : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={admin ? `Admin Dashboard (${admin.email})` : 'Admin Login'}
              >
                <ShieldCheck className="w-4 h-4" />
                {admin && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-mint rounded-full animate-ping" />
                )}
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-black/5 dark:border-white/5 mt-3 pt-3 pb-2 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Tutorials & Case Studies
              </Link>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Contact & Inquiries
              </a>
              <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                <a
                  href="https://www.youtube.com/@TechCuriousYT"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-red-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span>YouTube Channel</span>
                  <Youtube className="w-4 h-4 text-red-500" />
                </a>
                <a
                  href="https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-600 dark:text-zinc-300 hover:text-pink-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span>Instagram</span>
                  <Instagram className="w-4 h-4 text-pink-500" />
                </a>
              </div>
            </div>
          )}
        </header>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
