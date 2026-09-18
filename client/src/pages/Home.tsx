import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Youtube,
  Instagram,
  Bot,
  Wifi,
  CircuitBoard,
  Radio,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import api from '../lib/api';
import { Project } from '../lib/types';
import { ProjectCard } from '../components/projects/ProjectCard';

export const Home: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await api.get('/projects?status=published');
        if (res.data?.success) {
          setFeaturedProjects((res.data.data || []).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch featured projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const domains = [
    {
      icon: Bot,
      title: 'Autonomous Robotics',
      desc: 'LiDAR SLAM mapping, ROS2 node architecture, micro-ROS motor telemetry.',
      tag: 'ROS2 / SLAM',
      slug: 'robotics',
    },
    {
      icon: Wifi,
      title: 'IoT & Telemetry',
      desc: 'Non-invasive AC power meters, MQTT bridges, and Home Assistant dashboards.',
      tag: 'MQTT / ESP32',
      slug: 'iot',
    },
    {
      icon: CircuitBoard,
      title: '4-Layer PCB Design',
      desc: 'KiCAD schematics, controlled-impedance RF waveguides, and SMD reflow.',
      tag: 'KiCAD / SMD',
      slug: 'electronics',
    },
    {
      icon: Radio,
      title: 'Embedded Firmware',
      desc: 'Nordic nRF52 BLE beacons, Zephyr RTOS threads, ultra-low power states.',
      tag: 'Zephyr / BLE',
      slug: 'embedded',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-12 overflow-hidden tech-grid">
        {/* Soft atmospheric gradient */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-brand-500/10 dark:bg-brand-500/[0.08] blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 relative z-10">
          {/* Engineering Signal Tag */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-slate-700 dark:text-zinc-300 shadow-sm backdrop-blur-md">
            <div className="w-5 h-5 rounded-md overflow-hidden ring-1 ring-black/10 dark:ring-white/15 bg-black shrink-0">
              <img src="/brand-logo.jpg" alt="TC" className="w-full h-full object-cover" />
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="font-brand font-bold text-slate-950 dark:text-white tracking-normal">Tech Curious</span>
            <span className="text-slate-400 dark:text-zinc-600">&bull;</span>
            <span className="text-[11px] font-medium">OPEN HARDWARE & ROBOTICS LABS</span>
          </div>

          {/* Main Headline with Realistic High-Impact Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08] max-w-4xl mx-auto">
            Precision engineering for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-400 dark:from-brand-400 dark:via-indigo-300 dark:to-cyan-400">
              Robotics, IoT & PCBs.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Detailed hardware case studies mapped directly to YouTube build tutorials. Every project includes interactive assembly steps, verified BOM parts lists, and open-source code.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm shadow-sm transition-all"
            >
              <span>Explore Tutorial Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://www.youtube.com/@TechCuriousYT"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-elevated text-slate-800 dark:text-zinc-200 font-semibold text-sm border border-black/[0.08] dark:border-white/[0.08] shadow-sm transition-all"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Watch on YouTube</span>
            </a>
          </div>

          {/* Metrics Row */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-dark-surface/70 border border-black/[0.06] dark:border-white/[0.07] backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950 dark:text-white">
                100%
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Open Source</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-dark-surface/70 border border-black/[0.06] dark:border-white/[0.07] backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-brand-600 dark:text-brand-400">
                4-Layer
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Custom PCBs</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-dark-surface/70 border border-black/[0.06] dark:border-white/[0.07] backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950 dark:text-white">
                ROS2
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">SLAM Stacks</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-dark-surface/70 border border-black/[0.06] dark:border-white/[0.07] backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950 dark:text-white">
                Verified
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">BOM Buy Links</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Disciplines */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold tracking-wider text-brand-600 dark:text-brand-400 uppercase">
              // DOMAIN SPECIALIZATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950 dark:text-white">
              Hardware Engineering Tracks
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center"
          >
            <span>View all tutorials</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {domains.map((dom) => {
            const Icon = dom.icon;
            return (
              <Link
                key={dom.slug}
                to={`/projects?category=${dom.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-dark-surface border border-black/[0.06] dark:border-white/[0.07] hover:border-brand-500/40 dark:hover:border-brand-500/40 card-hover-glow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-dark-elevated text-slate-900 dark:text-white flex items-center justify-center group-hover:text-brand-500 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-elevated text-slate-500 dark:text-zinc-400">
                      {dom.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-display font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      {dom.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {dom.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-xs font-semibold text-slate-900 dark:text-zinc-300 group-hover:text-brand-500 flex items-center transition-colors">
                  <span>Browse Guides &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tutorials Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold tracking-wider text-brand-600 dark:text-brand-400 uppercase">
              // RECENT BUILDS
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950 dark:text-white">
              Featured Case Studies
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-dark-elevated text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          >
            <span>All Tutorials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-slate-100 dark:bg-dark-surface animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((proj) => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
          </div>
        )}
      </section>

      {/* YouTube Channel Callout Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-slate-950 dark:bg-[#12141c] border border-black/10 dark:border-white/[0.08] text-white overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center space-x-2.5 text-xs font-mono text-brand-cyan">
              <div className="w-5 h-5 rounded-md overflow-hidden ring-1 ring-white/20 bg-black shrink-0">
                <img src="/brand-logo.jpg" alt="TC" className="w-full h-full object-cover" />
              </div>
              <span className="font-brand font-bold text-white tracking-wide">TECH CURIOUS LABS</span>
              <span className="text-zinc-500">&bull;</span>
              <div className="inline-flex items-center space-x-1 text-red-400">
                <Youtube className="w-3.5 h-3.5" />
                <span>YOUTUBE & COMMUNITY</span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
              Watch real-time assembly, oscilloscope tuning & field testing.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every tutorial documented on Tech Curious corresponds 1:1 with an uncut, high-definition YouTube video walking through circuit debugging, CAD design, and component soldering.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://www.youtube.com/@TechCuriousYT"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-md shadow-red-600/20"
              >
                <Youtube className="w-4 h-4" />
                <span>Subscribe to Channel</span>
              </a>
              <a
                href="https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-pink-600 border border-white/15 text-white font-semibold text-xs transition-all"
              >
                <Instagram className="w-4 h-4 text-pink-400 group-hover:text-white" />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
