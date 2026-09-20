import React, { useState, useEffect } from 'react';
import { personalData } from '../data/portfolioData';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Journey & SIWES', href: '#experience', id: 'experience' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#090a0d]/90 backdrop-blur-md border-b border-[#1f222c] py-3.5 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 text-decoration-none focus-visible:outline-none"
          aria-label="Martins - Back to top"
        >
          <span className="font-mono text-sm tracking-tight font-semibold text-[#f4f5f8] group-hover:text-blue-400 transition-colors">
            {personalData.name.toLowerCase()}.dev
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">available</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                  isActive
                    ? 'text-[#f4f5f8] bg-[#161820] font-semibold shadow-xs'
                    : 'text-[#9ca3af] hover:text-[#f4f5f8] hover:bg-[#12141a]'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={personalData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] hover:bg-[#161820] border border-[#1f222c] transition-all"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={14} />
            <span>GitHub</span>
            <ArrowUpRight size={12} className="opacity-60" />
          </a>
          <a
            href="#contact"
            className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#f4f5f8] text-[#090a0d] hover:bg-white transition-all active:scale-[0.98]"
          >
            Connect
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#161820] border border-[#1f222c] focus-visible:outline-none"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-[#090a0d]/98 backdrop-blur-xl border-t border-[#1f222c] p-6 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-2 pt-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5b6270] mb-2 px-3">
              Navigation
            </span>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-base ${
                    isActive
                      ? 'text-[#f4f5f8] bg-[#161820] font-semibold'
                      : 'text-[#9ca3af] hover:text-[#f4f5f8] hover:bg-[#12141a]'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#1f222c] flex flex-col gap-3">
            <a
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-mono text-[#f4f5f8] bg-[#161820] border border-[#1f222c]"
            >
              <GithubIcon size={16} />
              <span>github.com/{personalData.handle}</span>
              <ArrowUpRight size={14} className="opacity-60" />
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-3 rounded-lg text-sm font-medium bg-[#f4f5f8] text-[#090a0d]"
            >
              Start Conversation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
