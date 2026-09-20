import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../data/portfolioData';
import { fetchExperience } from '../services/api';
import { Calendar, MapPin, CheckCircle2, Database } from 'lucide-react';

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
    transition: { staggerChildren: 0.14, delayChildren: 0.06 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Experience() {
  const [experienceList, setExperienceList] = useState(personalData.experience);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchExperience()
      .then((res) => {
        if (mounted && res && res.data && res.data.length > 0) {
          const formatted = res.data.map((item) => {
            const fallback = personalData.experience.find((fe) => fe.role === item.title || fe.organization === item.organization);
            return {
              period: item.startDate ? `${item.startDate} – ${item.endDate || 'Present'}` : (fallback?.period || 'Ongoing'),
              role: item.title,
              organization: item.organization,
              institution: item.institution || fallback?.institution || null,
              location: 'Nigeria',
              summary: item.description,
              contributions: (item.contributions && item.contributions.length > 0)
                ? item.contributions
                : (fallback ? fallback.contributions : []),
              skillsApplied: (item.skillsApplied && item.skillsApplied.length > 0)
                ? item.skillsApplied
                : (fallback ? fallback.skillsApplied : []),
            };
          });
          setExperienceList(formatted);
          setIsLiveFromDb(true);
        }
      })
      .catch((err) => {
        console.warn('Backend API notice: using fallback experience data.', err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="experience" className="py-24 sm:py-32 border-b border-[#1f222c] bg-[#0c0d10]">
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
                04 / Builder Journey
              </span>
              {isLiveFromDb && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Database size={10} />
                  <span>database synced</span>
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8]">
              Experience &amp; Growth
            </h2>
          </div>
          <p className="text-sm text-[#9ca3af] max-w-md">
            Freelance client delivery, live product work (Zapdata &amp; Suleman Fashion Store),
            and continuous technical growth as a frontend builder.
          </p>
        </motion.div>

        {/* Timeline / Editorial Journey Cards */}
        <motion.div
          className="relative border-l border-[#1f222c] ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {experienceList.map((item, index) => (
            <motion.div key={`${item.role}-${item.period}`} className="relative group" variants={cardItem}>
              
              {/* Timeline Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  index === 0
                    ? 'bg-blue-500 border-[#090a0d] ring-4 ring-blue-500/20'
                    : 'bg-[#1a1d26] border-[#323746]'
                }`}
              />

              <div className="rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8 hover:border-[#2d3240] transition-colors">
                
                {/* Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#1b1e26]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#f4f5f8]">
                        {item.role}
                      </h3>
                    </div>
                    
                    <div className="text-sm text-[#9ca3af] font-medium mt-1">
                      {item.organization}
                    </div>

                    {item.institution && (
                      <div className="text-xs text-[#5b6270] font-mono mt-0.5">
                        {item.institution}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#5b6270]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {item.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed mb-6">
                  {item.summary}
                </p>

                {/* Contributions */}
                {item.contributions && item.contributions.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-2">
                      Key Activities &amp; Responsibilities
                    </div>
                    {item.contributions.map((c, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#eceef2]">
                        <CheckCircle2 size={15} className="text-blue-500 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Tag Bar */}
                {item.skillsApplied && item.skillsApplied.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#1a1d26]">
                    <span className="font-mono text-xs text-[#5b6270] mr-2">
                      Technologies &amp; Competencies:
                    </span>
                    {item.skillsApplied.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-xs font-mono bg-[#14161d] text-[#9ca3af] border border-[#1f222c]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
