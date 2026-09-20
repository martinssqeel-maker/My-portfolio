import React, { useState } from 'react';
import { Sliders, X, Check, Copy, FileCode } from 'lucide-react';

export default function ManualNoticeModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const configPath = 'src/data/portfolioData.js';

  const copyPath = () => {
    navigator.clipboard.writeText(configPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Discreet floating trigger in corner */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#14161f]/90 hover:bg-[#1a1d28] border border-[#232736] text-xs font-mono text-[#9ca3af] hover:text-[#f4f5f8] shadow-lg backdrop-blur-sm transition-all"
          title="Open Authenticity & Data Config Guide"
        >
          <Sliders size={13} className="text-blue-400" />
          <span className="hidden sm:inline">Authenticity Checklist</span>
        </button>
      </div>

      {/* Modal Backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-[#0f1117] border border-[#222633] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1b1e28]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileCode size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#f4f5f8]">
                    Authenticity Audit &amp; Data Configuration
                  </h3>
                  <p className="text-xs text-[#9ca3af]">
                    Representing Martins' real projects, SIWES training &amp; tools
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#181b24] transition-colors"
                aria-label="Close configuration guide"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs font-mono text-[#9ca3af]">
              
              <div className="p-3.5 rounded-lg bg-[#13151d] border border-[#1d202b] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#f4f5f8] font-semibold">Config File Location:</span>
                  <button
                    type="button"
                    onClick={copyPath}
                    className="flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'copied!' : 'copy path'}</span>
                  </button>
                </div>
                <code className="block p-2 rounded bg-[#0a0b0e] text-blue-300 select-all border border-[#181b24]">
                  {configPath}
                </code>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider">
                  Remaining Manual Action Required Items:
                </div>
                
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-3 rounded-lg bg-[#12141a] border border-[#1b1e26]">
                    <span className="font-mono font-semibold text-emerald-400 block mb-1">
                      1. Zapdata &amp; Campus Marketplace URLs
                    </span>
                    <span className="text-[#9ca3af] text-xs">
                      If your projects are hosted on Vercel/Netlify or live domains, paste their URLs into <code>projects[].liveUrl</code> and confirm your repository names in <code>githubUrl</code>.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#12141a] border border-[#1b1e26]">
                    <span className="font-mono font-semibold text-emerald-400 block mb-1">
                      2. SIWES Employer &amp; Institution Name
                    </span>
                    <span className="text-[#9ca3af] text-xs">
                      In <code>experience[0]</code>, fill in your actual SIWES IT firm / placement organization and your university or polytechnic name.
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#12141a] border border-[#1b1e26]">
                    <span className="font-mono font-semibold text-[#f4f5f8] block mb-1">
                      3. WhatsApp Contact Link (Optional)
                    </span>
                    <span className="text-[#9ca3af] text-xs">
                      In <code>personalData.whatsapp</code>, optionally provide your direct WhatsApp link (e.g. <code>"https://wa.me/234XXXXXXXXXX"</code>).
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#12141a] border border-[#1b1e26]">
                    <span className="font-mono font-semibold text-[#f4f5f8] block mb-1">
                      4. Profile Headshot Photo (Optional)
                    </span>
                    <span className="text-[#9ca3af] text-xs">
                      Place your real photo at <code>src/assets/profile.jpg</code> to display your picture instead of the monogram badge.
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#f4f5f8] text-[#090a0d] hover:bg-white transition-colors"
                >
                  Close &amp; Continue Viewing
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
