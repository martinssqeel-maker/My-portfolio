import React, { useState } from 'react';

export default function InteractiveLuminaDemo() {
  const [toggleState, setToggleState] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState('primary');
  const [copiedToken, setCopiedToken] = useState(false);

  const copyTokenSnippet = () => {
    navigator.clipboard.writeText('<Button variant="primary" size="md" />');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="rounded-xl bg-[#0d0e12] border border-[#1f222c] p-4 sm:p-5 text-left font-mono">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1b1e26] text-xs">
        <span className="text-[#9ca3af]">Lumina UI Primitives</span>
        <span className="text-emerald-400">Zero-Dep / a11y</span>
      </div>

      <div className="space-y-4">
        {/* Component 1: Accessible Switch */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#14161d] border border-[#1e222c]">
          <div>
            <div className="text-xs text-[#f4f5f8] font-sans font-semibold">Focus Retention Mode</div>
            <div className="text-[11px] text-[#5b6270]">ARIA switch with role="switch"</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={toggleState}
            onClick={() => setToggleState(!toggleState)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              toggleState ? 'bg-blue-600' : 'bg-[#252a36]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                toggleState ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Component 2: Variant Selector */}
        <div className="p-3 rounded-lg bg-[#14161d] border border-[#1e222c]">
          <div className="text-[11px] text-[#5b6270] mb-2">Variant Preview:</div>
          <div className="flex flex-wrap gap-2">
            {['primary', 'secondary', 'ghost'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`px-3 py-1 rounded text-xs capitalize transition-all ${
                  selectedVariant === v
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1c202a] text-[#9ca3af] hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Token Snippet */}
        <button
          type="button"
          onClick={copyTokenSnippet}
          className="w-full flex items-center justify-between p-2.5 rounded bg-[#101217] border border-[#1c202a] text-[11px] text-[#9ca3af] hover:text-[#f4f5f8] transition-colors"
        >
          <span>&lt;Button variant="{selectedVariant}" /&gt;</span>
          <span className="text-blue-400">{copiedToken ? 'copied!' : 'copy code'}</span>
        </button>
      </div>
    </div>
  );
}
