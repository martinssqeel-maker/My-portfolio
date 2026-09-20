import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../data/portfolioData';
import { fetchProjects } from '../services/api';
import InteractiveZapdataDemo from './InteractiveZapdataDemo';
import { CheckCircle2, ArrowUpRight, Database, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Projects() {
  const [projectsList, setProjectsList] = useState(personalData.projects);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchProjects()
      .then((res) => {
        if (mounted && res && res.data && res.data.length > 0) {
          // Merge with features from personalData if not provided by db
          const merged = res.data.map((p) => {
            const fallback = personalData.projects.find((dp) => dp.id === p.slug || dp.slug === p.slug);
            return {
              ...p,
              tag: fallback ? fallback.tag : (p.featured ? 'Featured Project' : 'Web Project'),
              tagline: fallback ? fallback.tagline : p.description,
              role: fallback ? fallback.role : 'Frontend Developer',
              period: fallback ? fallback.period : 'Active Project',
              highlights: fallback ? fallback.highlights : [p.description],
              features: fallback ? fallback.features : [],
              problem: p.description,
              solution: p.detailedDescription || p.description,
              technologies: Array.isArray(p.technologies) ? p.technologies : [],
              liveUrl: p.liveUrl || (fallback ? fallback.liveUrl : ''),
              githubUrl: p.githubUrl || (fallback ? fallback.githubUrl : ''),
            };
          });
          setProjectsList(merged);
          setIsLiveFromDb(true);
        }
      })
      .catch((err) => {
        console.warn('Backend API notice: using verified fallback data.', err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const zapdata = projectsList.find((p) => p.id === 'zapdata' || p.slug === 'zapdata') || projectsList[0];
  const sulemanStore = projectsList.find(
    (p) => p.id === 'suleman-fashion' || p.slug === 'suleman-fashion' || p.id === 'fashion-web' || p.slug === 'fashion-web'
  ) || projectsList.find((p) => (p.tag || '').toLowerCase().includes('client'));

  const sulemanLiveUrl =
    (sulemanStore && sulemanStore.liveUrl) ||
    'https://helpful-lebkuchen-2ce9af.netlify.app/';

  return (
    <section id="projects" className="py-24 sm:py-32 border-b border-[#1f222c]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-blue-400 block">
                03 / Real-World Projects
              </span>
              {isLiveFromDb && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Database size={10} />
                  <span>database synced</span>
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8]">
              Products I Have Shipped
            </h2>
          </div>
          <p className="text-sm text-[#9ca3af] max-w-md">
            Live production products and client deliveries. Built with modern HTML, CSS,
            JavaScript, and React — used by real people every day.
          </p>
        </motion.div>

        {/* FEATURED PROJECT: Zapdata Case Study Layout */}
        {zapdata && (
          <motion.div
            className="mb-24 rounded-2xl bg-[#101217] border border-[#1f222c] p-6 sm:p-10 lg:p-12 relative overflow-hidden project-card-lift"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            
            {/* Eyebrow & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#1b1e26]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {zapdata.tag || 'Live Product'}
                </span>
                <span className="font-mono text-xs text-[#5b6270]">
                  Role: {zapdata.role || 'Frontend Developer & Creator'}
                </span>
              </div>
              <span className="font-mono text-xs text-[#5b6270]">
                Status: {zapdata.period || 'Live Product'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              
              {/* Left: Product Architecture & Problem/Solution Breakdown */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#f4f5f8] mb-2 tracking-tight">
                    {zapdata.title}
                  </h3>
                  <p className="text-sm sm:text-base text-blue-400 font-medium">
                    {zapdata.tagline}
                  </p>
                </div>

                {/* Problem / Solution Editorial Blocks */}
                <div className="space-y-4 text-sm text-[#9ca3af] leading-relaxed">
                  <div className="p-4 rounded-lg bg-[#14161e] border border-[#1d202b]">
                    <div className="font-mono text-xs font-semibold text-[#f4f5f8] uppercase tracking-wider mb-1">
                      The Problem
                    </div>
                    <p>{zapdata.problem || zapdata.description}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#14161e] border border-[#1d202b]">
                    <div className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                      What I Built &amp; Implemented
                    </div>
                    <p>{zapdata.solution || zapdata.detailedDescription || zapdata.description}</p>
                  </div>
                </div>

                {/* Key Features */}
                {zapdata.highlights && zapdata.highlights.length > 0 && (
                  <div>
                    <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-3">
                      Key Technical Features
                    </div>
                    <ul className="space-y-2">
                      {zapdata.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#eceef2]">
                          <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies Actually Used */}
                <div>
                  <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-2">
                    Technologies Used
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(zapdata.technologies || []).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-[#161820] text-[#f4f5f8] border border-[#1f222c]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links & Repository CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <a
                    href={zapdata.liveUrl || 'https://www.zapdata.com.ng/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-emerald-400 bg-[#161820] hover:bg-[#1f232e] border border-emerald-500/30 transition-all"
                  >
                    <span>View Live Product</span>
                    <ArrowUpRight size={13} />
                  </a>

                  {zapdata.githubUrl ? (
                    <a
                      href={zapdata.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-[#f4f5f8] bg-[#161820] hover:bg-[#1f232e] border border-[#1f222c] transition-all"
                    >
                      <GithubIcon size={14} />
                      <span>GitHub Repository</span>
                      <ArrowUpRight size={13} className="opacity-60" />
                    </a>
                  ) : (
                    <a
                      href={personalData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] bg-[#161820] hover:bg-[#1f232e] border border-[#1f222c] transition-all"
                      title="Visit GitHub profile"
                    >
                      <GithubIcon size={14} />
                      <span>GitHub Profile ({personalData.handle})</span>
                      <ArrowUpRight size={13} className="opacity-60" />
                    </a>
                  )}

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] transition-colors"
                  >
                    <span>Inquire / Request Code Walkthrough</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Right: Interactive Zapdata Top-Up Simulator */}
              <div className="lg:col-span-6 w-full">
                <div className="sticky top-24">
                  <div className="mb-3 flex items-center justify-between text-xs font-mono text-[#5b6270]">
                    <span>Interactive Application Prototype</span>
                    <span className="text-emerald-400">Test purchase flow</span>
                  </div>
                  
                  <InteractiveZapdataDemo />
                  
                  {/* Real Characteristic Badges */}
                  {zapdata.features && zapdata.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      {zapdata.features.map((f) => (
                        <div
                          key={f.label}
                          className="p-3 rounded-lg bg-[#0d0e12] border border-[#1c1f28] text-center"
                        >
                          <div className="text-[11px] font-mono font-semibold text-[#f4f5f8]">
                            {f.value}
                          </div>
                          <div className="text-[10px] font-mono text-[#5b6270] mt-0.5">
                            {f.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ADDITIONAL REAL PROJECTS */}
        <div className="space-y-16">
          
          {/* Project 2: Suleman Fashion Store — Client Delivery */}
          {sulemanStore && (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8 project-card-lift"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Left Column: Description */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                    {sulemanStore.tag || 'Client Delivery'}
                  </span>
                  <span className="text-xs font-mono text-[#5b6270]">
                    {sulemanStore.period || 'Client Delivery'}
                  </span>
                  <span className="text-xs font-mono text-[#5b6270]">
                    · {sulemanStore.role || 'Frontend Developer — Freelance'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#f4f5f8]">
                  {sulemanStore.title}
                </h3>
                <p className="text-sm text-amber-300 font-medium">
                  {sulemanStore.tagline}
                </p>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  {sulemanStore.problem || sulemanStore.description}
                </p>

                {sulemanStore.highlights && (
                  <div className="space-y-1.5 pt-1">
                    {sulemanStore.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#eceef2]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {(sulemanStore.technologies || []).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-[#14161d] text-[#9ca3af] border border-[#1f222c]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={sulemanLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold text-[#090a0d] bg-amber-400 hover:bg-amber-300 border border-amber-300/40 transition-all active:scale-[0.98]"
                  >
                    <ExternalLink size={14} />
                    <span>View Live Storefront</span>
                  </a>

                  {sulemanStore.githubUrl ? (
                    <a
                      href={sulemanStore.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f4f5f8] hover:text-amber-400 transition-colors"
                    >
                      <GithubIcon size={14} />
                      <span>View Repository</span>
                      <ArrowUpRight size={13} />
                    </a>
                  ) : (
                    <a
                      href={personalData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] transition-colors"
                    >
                      <GithubIcon size={14} />
                      <span>GitHub Profile</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Live storefront preview card */}
              <div className="lg:col-span-6">
                <a
                  href={sulemanLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden border border-[#1f222c] bg-[#0d0e12] hover:border-amber-500/40 transition-all group"
                >
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#101217] border-b border-[#1f222c]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                    <span className="ml-2 font-mono text-[11px] text-[#5b6270] truncate">
                      helpful-lebkuchen-2ce9af.netlify.app
                    </span>
                  </div>
                  <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[260px] bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <ExternalLink size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-[#f4f5f8] mb-1">Suleman Fashion Store</h4>
                    <p className="text-xs font-mono text-[#9ca3af] max-w-xs mb-5">
                      Live client e-commerce storefront — open the production URL to browse the full experience.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-amber-400/15 text-amber-300 border border-amber-500/30 group-hover:bg-amber-400/25 transition-colors">
                      <span>Open Live Storefront</span>
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </a>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
