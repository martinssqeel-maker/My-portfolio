import React, { useState } from 'react';
import { personalData } from '../data/portfolioData';
import { ArrowDown, Copy, Check, Terminal, Layers, Activity } from 'lucide-react';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('standards');

  const copyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-[#1f222c] overflow-hidden"
    >
      {/* Subtle background tech grid */}
      <div
        className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Identity, Narrative, and Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Status & Identity Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12141a] border border-[#1f222c] text-xs font-mono text-[#9ca3af] mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span>{personalData.role}</span>
              <span className="text-[#5b6270]">/</span>
              <span className="text-[#eceef2]">{personalData.location}</span>
            </div>

            {/* Name & Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f4f5f8] leading-[1.1] mb-6">
              Hello, I'm <span className="text-white underline decoration-blue-500/60 decoration-2 underline-offset-8">{personalData.name}</span>.
              <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-normal text-[#9ca3af]">
                Engineering fast, deliberate web interfaces.
              </span>
            </h1>

            {/* Personal Statement */}
            <p className="text-base sm:text-lg text-[#9ca3af] leading-relaxed max-w-2xl mb-8 font-normal">
              {personalData.hero.description}
            </p>

            {/* CTAs & Copy Email */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#f4f5f8] text-[#090a0d] hover:bg-white shadow-sm transition-all active:scale-[0.98]"
              >
                <span>{personalData.hero.primaryCta}</span>
                <ArrowDown size={15} />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-[#f4f5f8] bg-[#161820] hover:bg-[#1d202a] border border-[#1f222c] transition-all active:scale-[0.98]"
              >
                <span>{personalData.hero.secondaryCta}</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] bg-[#101217] hover:bg-[#161820] border border-[#1f222c] transition-all"
                title="Copy email to clipboard"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">email copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>{personalData.email}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#1f222c] w-full max-w-lg">
              <div>
                <div className="text-xs font-mono text-[#5b6270] uppercase tracking-wider mb-1">
                  Core Craft
                </div>
                <div className="text-sm font-semibold text-[#f4f5f8]">
                  React &amp; Modern UI
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-[#5b6270] uppercase tracking-wider mb-1">
                  Field Work
                </div>
                <div className="text-sm font-semibold text-[#f4f5f8]">
                  SIWES Trained
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-[#5b6270] uppercase tracking-wider mb-1">
                  Commitment
                </div>
                <div className="text-sm font-semibold text-emerald-400">
                  Production Ready
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Engineering Spec Console */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-xl bg-[#101217] border border-[#1f222c] shadow-2xl overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d0e12] border-b border-[#1f222c]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                  <span className="ml-2 font-mono text-xs text-[#5b6270]">martins.spec.ts</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-[#5b6270]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>runtime: active</span>
                </div>
              </div>

              {/* Console Tabs */}
              <div className="flex border-b border-[#1f222c] bg-[#101217]">
                <button
                  type="button"
                  onClick={() => setActiveTab('standards')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-b-2 transition-colors ${
                    activeTab === 'standards'
                      ? 'border-blue-500 text-[#f4f5f8] bg-[#161820]'
                      : 'border-transparent text-[#9ca3af] hover:text-[#f4f5f8]'
                  }`}
                >
                  <Activity size={13} />
                  <span>Standards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('terminal')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-b-2 transition-colors ${
                    activeTab === 'terminal'
                      ? 'border-blue-500 text-[#f4f5f8] bg-[#161820]'
                      : 'border-transparent text-[#9ca3af] hover:text-[#f4f5f8]'
                  }`}
                >
                  <Terminal size={13} />
                  <span>Git Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('stack')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-b-2 transition-colors ${
                    activeTab === 'stack'
                      ? 'border-blue-500 text-[#f4f5f8] bg-[#161820]'
                      : 'border-transparent text-[#9ca3af] hover:text-[#f4f5f8]'
                  }`}
                >
                  <Layers size={13} />
                  <span>Stack</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 font-mono text-xs">
                {activeTab === 'standards' && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#1b1e26]">
                      <span className="text-[#9ca3af]">Interface Latency</span>
                      <span className="text-emerald-400 font-semibold">&lt; 16ms (60 FPS)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#1b1e26]">
                      <span className="text-[#9ca3af]">Cumulative Layout Shift</span>
                      <span className="text-emerald-400 font-semibold">0.00 (Zero Shift)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#1b1e26]">
                      <span className="text-[#9ca3af]">Semantic &amp; a11y Target</span>
                      <span className="text-blue-400 font-semibold">WCAG 2.1 AA Compliant</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#1b1e26]">
                      <span className="text-[#9ca3af]">Responsive Adaptation</span>
                      <span className="text-[#f4f5f8]">320px – 4K Viewports</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-[#9ca3af]">Bundle Philosophy</span>
                      <span className="text-[#f4f5f8]">Zero Unused Bloat</span>
                    </div>
                  </div>
                )}

                {activeTab === 'terminal' && (
                  <div className="text-[#9ca3af] space-y-2">
                    <div className="text-[#5b6270]">$ git status -s</div>
                    <div className="text-emerald-400">M  src/portfolio/martins.config</div>
                    <div className="text-blue-400">?? src/components/Experience.jsx (SIWES)</div>
                    <div className="pt-2 text-[#5b6270]">$ git log -1 --pretty=format:"%h %s"</div>
                    <div className="text-[#f4f5f8]">cb3856b Refined frontend engineering systems</div>
                    <div className="pt-2 text-[#5b6270]">$ whoami</div>
                    <div className="text-blue-400">Martins (martinssqeel-maker)</div>
                  </div>
                )}

                {activeTab === 'stack' && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[#5b6270] mb-1">Client Engineering:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['React 19', 'JavaScript ESNext', 'HTML5 Semantic', 'Tailwind CSS'].map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded bg-[#161820] text-[#f4f5f8] border border-[#1f222c]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#5b6270] mb-1">Architecture &amp; Tools:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Vite', 'Git / GitHub', 'REST APIs', 'Chrome DevTools'].map((tool) => (
                          <span key={tool} className="px-2 py-0.5 rounded bg-[#161820] text-[#9ca3af] border border-[#1f222c]">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Console Footer */}
              <div className="px-5 py-2.5 bg-[#0d0e12] border-t border-[#1f222c] flex items-center justify-between text-[11px] font-mono text-[#5b6270]">
                <span>Status: Engineered for production</span>
                <span className="text-blue-400">verified</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
