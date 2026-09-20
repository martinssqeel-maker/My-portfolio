import React from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../data/portfolioData';
import { Code, ShieldCheck, Zap, Compass } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function About() {
  const { about } = personalData;

  const iconMap = {
    '01': Zap,
    '02': Compass,
    '03': Code,
    '04': ShieldCheck,
  };

  return (
    <section id="about" className="py-24 sm:py-32 border-b border-[#1f222c]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          className="mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <span className="font-mono text-xs uppercase tracking-wider text-blue-400 mb-2 block">
            01 / Background &amp; Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8] max-w-2xl">
            {about.headline}
          </h2>
        </motion.div>

        {/* Editorial Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Personal Narrative */}
          <motion.div
            className="lg:col-span-6 space-y-6 text-[#9ca3af] text-base sm:text-lg leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-[#f4f5f8] font-medium text-lg sm:text-xl leading-snug">
              {about.lead}
            </p>

            {about.paragraphs.map((p, idx) => (
              <p key={idx} className="text-[#9ca3af]">
                {p}
              </p>
            ))}

            {/* Practical Focus Checklist */}
            <div className="pt-6 border-t border-[#1f222c]">
              <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-4">
                What I Build &amp; Practice Daily
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-[#eceef2]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Translating UI layouts into clean, responsive HTML, CSS &amp; React code</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Shipping live products: Zapdata VTU platform and client e-commerce storefronts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Practicing version control with Git/GitHub and debugging in VS Code</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Expanding programming fundamentals with Python and algorithmic problem-solving</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column: Engineering Tenets */}
          <div className="lg:col-span-6 space-y-4">
            <motion.div
              className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-2"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              Core Principles
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-3.5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {about.principles.map((item) => {
                const IconComponent = iconMap[item.number] || Code;
                return (
                  <motion.div
                    key={item.number}
                    variants={cardItem}
                    className="p-5 rounded-xl bg-[#101217] border border-[#1f222c] hover:border-[#2d3240] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-semibold text-blue-400">
                          {item.number}
                        </span>
                        <h3 className="text-base font-semibold text-[#f4f5f8]">
                          {item.title}
                        </h3>
                      </div>
                      <IconComponent size={16} className="text-[#5b6270]" />
                    </div>
                    <p className="text-sm text-[#9ca3af] leading-relaxed pl-6">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
