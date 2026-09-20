import React from 'react';
import { personalData } from '../data/portfolioData';
import InteractiveZapdataDemo from './InteractiveZapdataDemo';
import InteractiveCampusMarketDemo from './InteractiveCampusMarketDemo';
import InteractiveFashionDemo from './InteractiveFashionDemo';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Projects() {
  const { projects } = personalData;
  const zapdata = projects.find((p) => p.id === 'zapdata') || projects[0];
  const campusMarket = projects.find((p) => p.id === 'campus-marketplace');
  const fashionWeb = projects.find((p) => p.id === 'fashion-web');

  return (
    <section id="projects" className="py-24 sm:py-32 border-b border-[#1f222c]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-blue-400 mb-2 block">
              03 / Real-World Projects
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8]">
              Applications I Have Built
            </h2>
          </div>
          <p className="text-sm text-[#9ca3af] max-w-md">
            Grounded in practical daily use cases. Built with modern HTML, CSS, JavaScript,
            and React to solve real problems for students and everyday users.
          </p>
        </div>

        {/* FEATURED PROJECT: Zapdata Case Study Layout */}
        <div className="mb-24 rounded-2xl bg-[#101217] border border-[#1f222c] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#1b1e26]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {zapdata.tag}
              </span>
              <span className="font-mono text-xs text-[#5b6270]">
                Role: {zapdata.role}
              </span>
            </div>
            <span className="font-mono text-xs text-[#5b6270]">
              Status: {zapdata.period}
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
                  <p>{zapdata.problem}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#14161e] border border-[#1d202b]">
                  <div className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                    What I Built &amp; Implemented
                  </div>
                  <p>{zapdata.solution}</p>
                </div>
              </div>

              {/* Key Features */}
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

              {/* Technologies Actually Used */}
              <div>
                <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-2">
                  Technologies Used
                </div>
                <div className="flex flex-wrap gap-2">
                  {zapdata.technologies.map((t) => (
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
                  href={zapdata.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-[#f4f5f8] bg-[#161820] hover:bg-[#1f232e] border border-[#1f222c] transition-all"
                >
                  <GithubIcon size={14} />
                  <span>GitHub Repository</span>
                  <ArrowUpRight size={13} className="opacity-60" />
                </a>

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
              </div>
            </div>

          </div>
        </div>

        {/* ADDITIONAL REAL PROJECTS */}
        <div className="space-y-16">
          
          {/* Project 2: Campus Marketplace */}
          {campusMarket && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8">
              {/* Left Column: Interactive Campus Marketplace Demo */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <InteractiveCampusMarketDemo />
              </div>

              {/* Right Column: Project Description */}
              <div className="lg:col-span-6 space-y-4 text-left order-1 lg:order-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161820] text-blue-400 border border-[#1f222c]">
                    {campusMarket.tag}
                  </span>
                  <span className="text-xs font-mono text-[#5b6270]">
                    {campusMarket.period}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#f4f5f8]">
                  {campusMarket.title}
                </h3>
                <p className="text-sm text-blue-400 font-medium">
                  {campusMarket.tagline}
                </p>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  {campusMarket.problem} {campusMarket.solution}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-1">
                  {campusMarket.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#eceef2]">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {campusMarket.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-[#14161d] text-[#9ca3af] border border-[#1f222c]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <a
                    href={campusMarket.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f4f5f8] hover:text-blue-400 transition-colors"
                  >
                    <GithubIcon size={14} />
                    <span>View Repository</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Project 3: Fashion Web Showcase */}
          {fashionWeb && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8">
              {/* Left Column: Description */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#161820] text-amber-400 border border-[#1f222c]">
                    {fashionWeb.tag}
                  </span>
                  <span className="text-xs font-mono text-[#5b6270]">
                    {fashionWeb.period}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#f4f5f8]">
                  {fashionWeb.title}
                </h3>
                <p className="text-sm text-amber-300 font-medium">
                  {fashionWeb.tagline}
                </p>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  {fashionWeb.problem} {fashionWeb.solution}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-1">
                  {fashionWeb.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#eceef2]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {fashionWeb.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-[#14161d] text-[#9ca3af] border border-[#1f222c]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <a
                    href={fashionWeb.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f4f5f8] hover:text-amber-400 transition-colors"
                  >
                    <GithubIcon size={14} />
                    <span>View Repository</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Fashion Lookbook */}
              <div className="lg:col-span-6">
                <InteractiveFashionDemo />
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
