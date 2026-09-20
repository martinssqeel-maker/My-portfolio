import React, { useState } from 'react';

export default function InteractiveFashionDemo() {
  const [selectedCollection, setSelectedCollection] = useState('All');

  const items = [
    {
      id: 1,
      title: 'Structured Boxy Drop-Shoulder Tee',
      collection: 'Streetwear',
      price: '₦14,500',
      tag: 'Heavyweight Cotton 280gsm',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#0f0f12', '#f5f5f5', '#4a4e5a'],
    },
    {
      id: 2,
      title: 'Tailored Minimal Utility Cargo',
      collection: 'Contemporary',
      price: '₦22,000',
      tag: 'Breathable Twill & Dart Details',
      sizes: ['30', '32', '34', '36'],
      colors: ['#1c1c1f', '#3b3a32'],
    },
    {
      id: 3,
      title: 'Monochrome Panel Overshirt',
      collection: 'Streetwear',
      price: '₦19,500',
      tag: 'Textured Linen-Blend',
      sizes: ['M', 'L', 'XL'],
      colors: ['#121316', '#e8e4dc'],
    },
  ];

  const collections = ['All', 'Streetwear', 'Contemporary'];

  const filtered = items.filter(
    (i) => selectedCollection === 'All' || i.collection === selectedCollection
  );

  return (
    <div className="rounded-xl bg-[#0d0e12] border border-[#1f222c] overflow-hidden text-left font-mono">
      {/* Header */}
      <div className="px-4 py-3 bg-[#12141a] border-b border-[#1f222c] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-bold text-[#f4f5f8]">Fashion Web Showcase</span>
        </div>
        <span className="text-[11px] text-[#5b6270]">Lookbook &amp; Apparel Catalog</span>
      </div>

      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Collections filter */}
        <div className="flex gap-1.5 text-[11px]">
          {collections.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => setSelectedCollection(col)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedCollection === col
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                  : 'bg-[#161820] text-[#9ca3af] hover:text-white border border-[#202430]'
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Fashion items preview list */}
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-[#13151e] border border-[#1e222d] space-y-2 hover:border-[#2a3040] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-sans font-semibold text-[#f4f5f8]">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#5b6270] mt-0.5">
                    {item.tag}
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 shrink-0 font-mono">
                  {item.price}
                </span>
              </div>

              {/* Sizing & Color Palette Row */}
              <div className="flex items-center justify-between pt-1 border-t border-[#1a1d26] text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#5b6270]">Sizes:</span>
                  <div className="flex gap-1">
                    {item.sizes.map((s) => (
                      <span
                        key={s}
                        className="px-1.5 py-0.2 rounded bg-[#1a1d26] text-[#9ca3af] border border-[#252a38]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[#5b6270]">Colors:</span>
                  <div className="flex gap-1">
                    {item.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="w-2.5 h-2.5 rounded-full border border-[#3b4154]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#181b24] flex items-center justify-between text-[10px] text-[#5b6270]">
          <span>Project: Fashion &amp; Apparel Storefront</span>
          <span className="text-amber-400">Responsive Lookbook Interface</span>
        </div>
      </div>
    </div>
  );
}
