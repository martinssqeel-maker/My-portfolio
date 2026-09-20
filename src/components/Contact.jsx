import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../data/portfolioData';
import { submitContactMessage } from '../services/api';
import { Copy, Check, Send, MessageSquare, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import { GithubIcon } from './Icons';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle, sending, success, error

  const copyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus({ state: 'sending', message: 'Sending message securely to server...' });

    try {
      const result = await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Portfolio Inquiry',
        message: formData.message,
      });

      setStatus({
        state: 'success',
        message: result.message || 'Your message has been sent successfully and stored in the database!',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setStatus({
        state: 'error',
        message: err.message || 'Something went wrong. Please try again or email directly.',
      });
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 border-b border-[#1f222c] relative">
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
            05 / Direct Communication
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f5f8] max-w-2xl">
            Let&apos;s start a conversation.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#9ca3af] max-w-xl">
            Whether you are considering me for an engineering role, discussing a frontend
            challenge, or looking to collaborate, my inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Contact Info & Verification */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            
            {/* Primary Email Card */}
            <div className="p-6 rounded-xl bg-[#101217] border border-[#1f222c] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#5b6270] uppercase tracking-wider">
                  Direct Email
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <a
                href={`mailto:${personalData.email}`}
                className="text-base sm:text-lg font-mono font-semibold text-[#f4f5f8] hover:text-blue-400 transition-colors block break-all"
              >
                {personalData.email}
              </a>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#161820] hover:bg-[#1f232e] text-[#f4f5f8] border border-[#1f222c] transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy address</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${personalData.email}?subject=Frontend%20Engineering%20Inquiry`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] transition-colors"
                >
                  <span>Open client</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="p-6 rounded-xl bg-[#101217] border border-[#1f222c] space-y-3">
              <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider">
                Source Repositories
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GithubIcon size={20} className="text-[#f4f5f8]" />
                  <div>
                    <div className="text-sm font-semibold text-[#f4f5f8]">
                      github.com/{personalData.handle}
                    </div>
                    <div className="text-xs text-[#5b6270]">Active public codebase</div>
                  </div>
                </div>
                <a
                  href={personalData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[#9ca3af] hover:text-[#f4f5f8] hover:bg-[#161820] transition-colors"
                  aria-label="Visit GitHub Profile"
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Availability Notice */}
            <div className="p-5 rounded-xl bg-[#0e1015] border border-[#1b1e26] text-xs font-mono text-[#9ca3af] leading-relaxed">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: Actively Available</span>
              </div>
              Open for full-time frontend roles, contract engineering, and open-source projects.
              Messages are stored securely in the portfolio database and answered within 24 hours.
            </div>

          </motion.div>

          {/* Right Column: Real Full-Stack Message Form */}
          <motion.div
            className="lg:col-span-7"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="p-6 sm:p-8 rounded-xl bg-[#101217] border border-[#1f222c]">
              
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1b1e26]">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-400" />
                  <h3 className="text-base font-semibold text-[#f4f5f8]">
                    Send a Message
                  </h3>
                </div>
                <span className="font-mono text-xs text-emerald-400">API &amp; Database Connected</span>
              </div>

              {status.state === 'success' ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-[#f4f5f8]">
                    Message Sent &amp; Recorded
                  </h4>
                  <p className="text-sm text-[#9ca3af] max-w-md mx-auto">
                    {status.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus({ state: 'idle', message: '' })}
                    className="px-4 py-2 rounded-lg text-xs font-mono bg-[#161820] text-[#9ca3af] hover:text-white border border-[#1f222c]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {status.state === 'error' && (
                    <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{status.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-mono text-[#9ca3af] mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#14161d] border border-[#1f222c] text-sm text-[#f4f5f8] placeholder-[#5b6270] focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-mono text-[#9ca3af] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#14161d] border border-[#1f222c] text-sm text-[#f4f5f8] placeholder-[#5b6270] focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-mono text-[#9ca3af] mb-1.5"
                    >
                      Subject (Optional)
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Frontend Engineering Opportunity"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#14161d] border border-[#1f222c] text-sm text-[#f4f5f8] placeholder-[#5b6270] focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-mono text-[#9ca3af] mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Martins Moses, I'd like to discuss a project..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#14161d] border border-[#1f222c] text-sm text-[#f4f5f8] placeholder-[#5b6270] focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#5b6270]">
                      Protected against spam &amp; stored safely
                    </span>
                    <button
                      type="submit"
                      disabled={status.state === 'sending'}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#f4f5f8] text-[#090a0d] hover:bg-white transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                      {status.state === 'sending' ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
