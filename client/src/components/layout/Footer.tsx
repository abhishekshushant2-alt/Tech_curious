import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/api.js';
import { BrandLogo } from './BrandLogo.js';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      setStatus('loading');
      const res = await api.post('/contact', formData);
      if (res.data?.success) {
        setStatus('success');
        setFeedbackMsg(res.data.message || 'Message received. Thank you for reaching out!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <footer id="contact" className="border-t border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-dark-surface pt-16 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-black/[0.06] dark:border-white/[0.06]">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block group" title="Tech Curious">
              <BrandLogo size="md" showSubtitle={true} />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm font-normal">
              Open-source hardware engineering, autonomous robotics SLAM, IoT telemetry architectures, and custom PCB designs.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <a
                href="https://www.youtube.com/@TechCuriousYT"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
              <a
                href="https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white text-xs font-semibold transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Tracks
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-zinc-400">
              <li>
                <Link to="/" className="hover:text-slate-950 dark:hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-slate-950 dark:hover:text-white transition-colors">All Projects</Link>
              </li>
              <li>
                <Link to="/projects?category=robotics" className="hover:text-slate-950 dark:hover:text-white transition-colors">Robotics</Link>
              </li>
              <li>
                <Link to="/projects?category=iot" className="hover:text-slate-950 dark:hover:text-white transition-colors">IoT & Power</Link>
              </li>
              <li>
                <Link to="/projects?category=electronics" className="hover:text-slate-950 dark:hover:text-white transition-colors">PCB Design</Link>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-sm font-display font-bold text-slate-950 dark:text-white">
              Get in Touch / Project Collaboration
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Inquiries regarding hardware sponsorships, open-source builds, or creator collaborations:
            </p>

            {status === 'success' ? (
              <div className="p-3.5 rounded-xl bg-brand-mint/10 border border-brand-mint/30 text-brand-mint text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-dark-elevated border border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-dark-elevated border border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Your message or collaboration idea..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-dark-elevated border border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 resize-none"
                />
                {status === 'error' && (
                  <div className="text-xs text-rose-500 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 transition-all disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-zinc-500 space-y-2 sm:space-y-0">
          <p>© {currentYear} Tech Curious. All rights reserved.</p>
          <p className="font-mono text-[11px]">Designed with curiosity & engineering precision.</p>
        </div>
      </div>
    </footer>
  );
};
