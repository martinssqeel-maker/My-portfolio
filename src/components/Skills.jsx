import React, { useState, useEffect } from 'react';
import { personalData } from '../data/portfolioData';
import { fetchSkills } from '../services/api';
import { Cpu, Layout, Wrench, Code2, Database } from 'lucide-react';

export default function Skills() {
  const [skillsList, setSkillsList] = useState(personalData.skills);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let mounted = true;
    fetchSkills()
      .then((res) => {
        if (mounted && res && res.data && res.data.length > 0) {
          // Re-group from flat array
          const categoryOrder = [
            'Core Web Development',
            'Frameworks & Client Architecture',
            'Programming & Foundations',
            'Developer Tools & Environment',
          ];

          const categoryDescriptions = {
            'Core Web Development': 'Fundamental languages and technologies used daily to construct responsive web pages',
            'Frameworks & Client Architecture': 'Component-driven tools for structuring dynamic user interfaces',
            'Programming & Foundations': 'Core logic, scripting, and algorithmic problem-solving',
            'Developer Tools & Environment': 'Everyday workflow and version control tools',
          };

          const groupedMap = {};
          res.data.forEach((item) => {
            if (!groupedMap[item.category]) {
              groupedMap[item.category] = [];
            }
            groupedMap[item.category].push({
              name: item.name,
              level: item.level || 'Working Knowledge',
              note: item.note || '',
            });
          });

          const formatted = Object.keys(groupedMap).map((cat) => ({
            category: cat,
            description: categoryDescriptions[cat] || 'Technical competencies and tools',
            items: groupedMap[cat],
          })).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a.category);
            const indexB = categoryOrder.indexOf(b.category);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
          });

          setSkillsList(formatted);
          setIsLiveFromDb(true);
        }
      })
      .catch((err) => {
        console.warn('Backend API notice: using fallback skills data.', err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categoryIcons = {
    'Core Web Development': Layout,
    'Frameworks & Client Architecture': Code2,
    'Programming & Foundations': Cpu,
    'Developer Tools & Environment': Wrench,
  };

  const categories = ['All', ...skillsList.map((s) => s.category)];

  const displayedSkills =
    selectedCategory === 'All'
      ? skillsList
      : skillsList.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-24 sm:py-32 border-b border-[#1f222c] bg-[#0c0d10]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-blue-400 block">
                02 / Technical Stack &amp; Tools
              </span>
              {isLiveFromDb && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Database size={10} />
                  <span>database synced</span>
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8]">
              Verified Skills &amp; Tools
            </h2>
          </div>
          <p className="text-sm text-[#9ca3af] max-w-md">
            Technologies I have actually worked with or am actively learning.
            No inflated percentages or fabricated senior expertise.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-[#1f222c]">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-[#f4f5f8] text-[#090a0d] font-semibold shadow-xs'
                    : 'bg-[#12141a] text-[#9ca3af] hover:text-[#f4f5f8] hover:bg-[#181b22] border border-[#1f222c]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Skills Layout: Editorial List by Domain */}
        <div className="grid grid-cols-1 gap-8">
          {displayedSkills.map((categoryGroup) => {
            const Icon = categoryIcons[categoryGroup.category] || Layout;
            return (
              <div
                key={categoryGroup.category}
                className="rounded-xl bg-[#101217] border border-[#1f222c] p-6 sm:p-8"
              >
                {/* Domain Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-[#1b1e26]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#161820] text-blue-400 border border-[#1f222c]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#f4f5f8]">
                        {categoryGroup.category}
                      </h3>
                      <p className="text-xs text-[#9ca3af]">
                        {categoryGroup.description}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#5b6270]">
                    {categoryGroup.items.length} technologies
                  </span>
                </div>

                {/* Skill Items List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryGroup.items.map((skill) => (
                    <div
                      key={skill.name}
                      className="group p-3.5 rounded-lg bg-[#14161d] border border-[#1c1f29] hover:border-[#2a2f3e] transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-[#f4f5f8] group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1a1d26] text-[#9ca3af] border border-[#222633]">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-[#5b6270] leading-snug group-hover:text-[#9ca3af] transition-colors">
                        {skill.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
