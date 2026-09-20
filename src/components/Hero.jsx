import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../data/portfolioData';
import { ArrowDown, Copy, Check, Terminal, Layers, FolderKanban } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

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
      {/* Ambient blue glow behind headline */}
      <div className="hero-glow" aria-hidden="true" />

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
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12141a] border border-[#1f222c] text-xs font-mono text-[#9ca3af] mb-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span>{personalData.role}</span>
              <span className="text-[#5b6270]">/</span>
              <span className="text-[#eceef2]">{personalData.location}</span>
            </motion.div>

            {/* Name & Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f4f5f8] leading-[1.1] mb-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={1}
            >
              Hello, I&apos;m <span className="text-white underline decoration-blue-500/60 decoration-2 underline-offset-8">{personalData.name}</span>.
              <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-normal text-[#9ca3af]">
                {personalData.hero.headline}
              </span>
            </motion.h1>

            {/* Personal Statement */}
            <motion.p
              className="text-base sm:text-lg text-[#9ca3af] leading-relaxed max-w-2xl mb-8 font-normal"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={2}
            >
              {personalData.hero.description}
            </motion.p>

            {/* CTAs & Copy Email */}
            <motion.div
              className="flex flex-wrap items-center gap-3 w-full sm:w-auto"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={3}
            >
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
            </motion.div>

            {/* Real Foundation Fact Bar */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#1f222c] w-full max-w-lg"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={4}
            >
              <div>
                <div className="text-xs font-mono text-[#5b6270] uppercase tracking-wider mb-1">
                  Primary Focus
                </div>
                <div className="text-sm font-semibold text-[#f4f5f8]">
                  Web Products
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-[#5b6270] uppercase tracking-wider mb-1">
                  Delivery
                </div>
                <div className="text-sm font-semibold text-[#f4f5f8]">
                  Live &amp; Client Work
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-[#5b6270] uppercase tracking-wider mb-1">
                  Status
                </div>
                <div className="text-sm font-semibold text-emerald-400">
                  Actively Building
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Authentic Developer Spec Console */}
          <motion.div
            className="lg:col-span-5 w-full"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={2}
          >
            <div className="rounded-xl bg-[#101217] border border-[#1f222c] shadow-2xl overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d0e12] border-b border-[#1f222c]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2d313c]" />
                  <span className="ml-2 font-mono text-xs text-[#5b6270]">martinsmoses.workspace</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-[#5b6270]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>status: shipping</span>
                </div>
              </div>

              {/* Console Tabs */}
              <div className="flex border-b border-[#1f222c] bg-[#101217]">
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono border-b-2 transition-colors ${
                    activeTab === 'projects'
                      ? 'border-blue-500 text-[#f4f5f8] bg-[#161820]'
                      : 'border-transparent text-[#9ca3af] hover:text-[#f4f5f8]'
                  }`}
                >
                  <FolderKanban size={13} />
                  <span>Live Products</span>
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
                  <span>Terminal</span>
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
                  <span>Tech Stack</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 font-mono text-xs">
                {activeTab === 'projects' && (
                  <div className="space-y-3.5">
                    <div className="p-2.5 rounded bg-[#141620] border border-[#1d222e]">
                      <div className="flex items-center justify-between text-[#f4f5f8] font-bold">
                        <span>1. Zapdata</span>
                        <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">Live Product</span>
                      </div>
                      <p className="text-[11px] text-[#9ca3af] mt-1 font-sans">
                        VTU &amp; data selling platform — live at zapdata.com.ng
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#141620] border border-[#1d222e]">
                      <div className="flex items-center justify-between text-[#f4f5f8] font-bold">
                        <span>2. Suleman Fashion Store</span>
                        <span className="text-[10px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">Client Delivery</span>
                      </div>
                      <p className="text-[11px] text-[#9ca3af] mt-1 font-sans">
                        E-commerce storefront delivered for a fashion brand client.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'terminal' && (
                  <div className="text-[#9ca3af] space-y-2">
                    <div className="text-[#5b6270]">$ whoami</div>
                    <div className="text-blue-400 font-bold">Martins Moses (Martinssqeel)</div>
                    <div className="pt-1 text-[#5b6270]">$ echo $ROLE</div>
                    <div className="text-[#f4f5f8]">Frontend Developer &amp; Web Product Builder</div>
                    <div className="pt-1 text-[#5b6270]">$ cat products.txt</div>
                    <div className="text-[#eceef2]">zapdata.com.ng · suleman fashion store</div>
                    <div className="pt-1 text-[#5b6270]">$ code --status</div>
                    <div className="text-emerald-400">VS Code: workspace active · shipping</div>
                  </div>
                )}

                {activeTab === 'stack' && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[#5b6270] mb-1.5">Daily Building:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['HTML5', 'CSS3', 'JavaScript ES6+', 'React', 'Tailwind CSS'].map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded bg-[#161820] text-[#f4f5f8] border border-[#1f222c]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#5b6270] mb-1.5">Tools &amp; Learning:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Python', 'VS Code', 'Git / GitHub', 'Vite', 'Chrome DevTools'].map((tool) => (
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
                <span>Grounded in shipping products</span>
                <span className="text-emerald-400">live &amp; client-ready</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
