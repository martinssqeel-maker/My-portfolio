import React from 'react';
import { personalData } from '../data/portfolioData';
import InteractivePulseDemo from './InteractivePulseDemo';
import InteractiveLuminaDemo from './InteractiveLuminaDemo';
import InteractiveApexDemo from './InteractiveApexDemo';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Projects() {
  const { projects } = personalData;
  const featured = projects.find((p) => p.featured) || projects[0];
  const otherProjects = projects.filter((p) => p.id !== featured.id);

  return (
    <section id="projects" className="py-24 sm:py-32 border-b border-[#1f222c]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-blue-400 mb-2 block">
              03 / Selected Production Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8]">
              Engineered Web Systems
            </h2>
          </div>
          <p className="text-sm text-[#9ca3af] max-w-md">
            Deliberately built applications emphasizing state stability, responsive precision,
            and fast interaction times. Each project solves a distinct technical challenge.
          </p>
        </div>

        {/* FEATURED PROJECT: Flagship Case Study Layout */}
        <div className="mb-24 rounded-2xl bg-[#101217] border border-[#1f222c] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#1b1e26]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {featured.tag}
              </span>
              <span className="font-mono text-xs text-[#5b6270]">
                Role: {featured.role}
              </span>
            </div>
            <span className="font-mono text-xs text-[#5b6270]">
              Release: {featured.period}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left: Product Architecture & Problem/Solution Breakdown */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#f4f5f8] mb-2 tracking-tight">
                  {featured.title}
                </h3>
                <p className="text-sm sm:text-base text-blue-400 font-medium">
                  {featured.tagline}
                </p>
              </div>

              {/* Problem / Solution Editorial Blocks */}
              <div className="space-y-4 text-sm text-[#9ca3af] leading-relaxed">
                <div className="p-4 rounded-lg bg-[#14161e] border border-[#1d202b]">
                  <div className="font-mono text-xs font-semibold text-[#f4f5f8] uppercase tracking-wider mb-1">
                    The Problem
                  </div>
                  <p>{featured.problem}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#14161e] border border-[#1d202b]">
                  <div className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                    The Architecture &amp; Solution
                  </div>
                  <p>{featured.solution}</p>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-3">
                  Engineering Highlights
                </div>
                <ul className="space-y-2">
                  {featured.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#eceef2]">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div>
                <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-2">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {featured.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-[#161820] text-[#f4f5f8] border border-[#1f222c]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links & CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href={featured.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-[#f4f5f8] bg-[#161820] hover:bg-[#1f232e] border border-[#1f222c] transition-all"
                >
                  <GithubIcon size={14} />
                  <span>Inspect Source</span>
                  <ArrowUpRight size={13} className="opacity-60" />
                </a>

                {/* Notice link for manual configuration */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] transition-colors"
                >
                  <span>Request Live Sandbox</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Right: Interactive Product Simulator */}
            <div className="lg:col-span-6 w-full">
              <div className="sticky top-24">
                <div className="mb-3 flex items-center justify-between text-xs font-mono text-[#5b6270]">
                  <span>Live Interactive Preview</span>
                  <span className="text-emerald-400">Interact with UI</span>
                </div>
                <InteractivePulseDemo />
                
                {/* Product Performance Metric Cards */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {featured.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-lg bg-[#0d0e12] border border-[#1c1f28] text-center"
                    >
                      <div className="font-mono text-xs sm:text-sm font-bold text-[#f4f5f8]">
                        {m.value}
                      </div>
                      <div className="text-[10px] font-mono text-[#5b6270] mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ADDITIONAL PROJECTS: Varied Editorial Layouts */}
        <div className="space-y-16">
          
          {/* Project 2: Lumina */}
          {otherProjects[0] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8">
              {/* Left Column: Interactive Component Demo */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <InteractiveLuminaDemo />
              </div>

              {/* Right Column: Project Description */}
              <div className="lg:col-span-7 space-y-4 text-left order-1 lg:order-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161820] text-blue-400 border border-[#1f222c]">
                    {otherProjects[0].tag}
                  </span>
                  <span className="text-xs font-mono text-[#5b6270]">
                    {otherProjects[0].period}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#f4f5f8]">
                  {otherProjects[0].title}
                </h3>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  {otherProjects[0].problem} {otherProjects[0].solution}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {otherProjects[0].technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-[#14161d] text-[#9ca3af] border border-[#1f222c]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={otherProjects[0].githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f4f5f8] hover:text-blue-400 transition-colors"
                  >
                    <GithubIcon size={13} />
                    <span>View Repository</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Project 3: Apex */}
          {otherProjects[1] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8">
              {/* Left Column: Description */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161820] text-blue-400 border border-[#1f222c]">
                    {otherProjects[1].tag}
                  </span>
                  <span className="text-xs font-mono text-[#5b6270]">
                    {otherProjects[1].period}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#f4f5f8]">
                  {otherProjects[1].title}
                </h3>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  {otherProjects[1].problem} {otherProjects[1].solution}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {otherProjects[1].technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-[#14161d] text-[#9ca3af] border border-[#1f222c]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={otherProjects[1].githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f4f5f8] hover:text-blue-400 transition-colors"
                  >
                    <GithubIcon size={13} />
                    <span>View Repository</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Financial Tool */}
              <div className="lg:col-span-5">
                <InteractiveApexDemo />
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
