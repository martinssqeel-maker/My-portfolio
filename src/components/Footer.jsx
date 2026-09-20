import React from 'react';
import { personalData } from '../data/portfolioData';
import { ArrowUp, Mail } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Footer({ onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-[#090a0d] border-t border-[#1f222c]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1b1e26]">
          
          {/* Identity & Short Statement */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left">
            <span className="font-mono text-sm font-bold text-[#f4f5f8]">
              {personalData.name.toLowerCase()}.dev
            </span>
            <span className="text-[#5b6270] hidden sm:inline">/</span>
            <span className="text-xs text-[#9ca3af]">
              Frontend Engineer focused on performance, accessibility, and craft.
            </span>
          </div>

          {/* Socials & Top Trigger */}
          <div className="flex items-center gap-4">
            <a
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#9ca3af] hover:text-[#f4f5f8] hover:bg-[#161820] transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={17} />
            </a>

            <a
              href={`mailto:${personalData.email}`}
              className="p-2 rounded-lg text-[#9ca3af] hover:text-[#f4f5f8] hover:bg-[#161820] transition-colors"
              aria-label="Send direct email"
            >
              <Mail size={17} />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] bg-[#12141a] hover:bg-[#181b22] border border-[#1f222c] transition-all"
              aria-label="Scroll back to top"
            >
              <span>top</span>
              <ArrowUp size={13} />
            </button>
          </div>

        </div>

        {/* Bottom Credits & Admin Console Trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#5b6270]">
          <div>
            &copy; {currentYear} {personalData.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Full-Stack Node + React + SQLite</span>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors underline decoration-dotted"
            >
              Admin Console
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
