import React from 'react';
import { personalData } from '../data/portfolioData';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function Experience() {
  const { experience } = personalData;

  return (
    <section id="experience" className="py-24 sm:py-32 border-b border-[#1f222c] bg-[#0c0d10]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-blue-400 mb-2 block">
              04 / Progression &amp; Field Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8]">
              Experience &amp; Practical Training
            </h2>
          </div>
          <p className="text-sm text-[#9ca3af] max-w-md">
            Hands-on software development through industrial training (SIWES), rigorous
            independent project engineering, and continuous technical refinement.
          </p>
        </div>

        {/* Timeline / Editorial Journey Cards */}
        <div className="relative border-l border-[#1f222c] ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12">
          {experience.map((item) => {
            const isSIWES = item.period.includes('SIWES');

            return (
              <div key={item.period} className="relative group">
                
                {/* Timeline Node */}
                <div
                  className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    isSIWES
                      ? 'bg-blue-500 border-[#090a0d] ring-4 ring-blue-500/20'
                      : 'bg-[#1a1d26] border-[#323746]'
                  }`}
                />

                <div className="rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8 hover:border-[#2d3240] transition-colors">
                  
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#1b1e26]">
                    <div>
                      <div className="flex items-center gap-2">
                        {isSIWES && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Practical Training
                          </span>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold text-[#f4f5f8]">
                          {item.role}
                        </h3>
                      </div>
                      <div className="text-sm text-[#9ca3af] font-medium mt-0.5">
                        {item.organization}
                      </div>
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
                  <div className="space-y-2 mb-6">
                    <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider mb-2">
                      Key Technical Contributions
                    </div>
                    {item.contributions.map((c, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#eceef2]">
                        <CheckCircle2 size={15} className="text-blue-500 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills Tag Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#1a1d26]">
                    <span className="font-mono text-xs text-[#5b6270] mr-2">
                      Competencies:
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

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
