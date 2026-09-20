import React, { useState } from 'react';
import { Search, MapPin, MessageCircle } from 'lucide-react';

export default function InteractiveCampusMarketDemo() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  const listings = [
    {
      id: 1,
      title: 'Engineering Mathematics (K.A. Stroud)',
      category: 'Textbooks',
      price: 3500,
      condition: 'Good condition',
      location: 'Hall 3, Room 14',
      seller: 'Chinedu (Faculty of Eng.)',
      whatsapp: '2348012345678',
    },
    {
      id: 2,
      title: 'Casio FX-991EX ClassWiz Calculator',
      category: 'Electronics',
      price: 7500,
      condition: 'Original, with cover',
      location: 'Science Complex Quad',
      seller: 'Fatima (Math Dept.)',
      whatsapp: '2348087654321',
    },
    {
      id: 3,
      title: 'Dual-Speed Rechargeable Desk Fan',
      category: 'Dorm Gear',
      price: 6500,
      condition: 'Tested, holds battery 5 hrs',
      location: 'Hostel Block B',
      seller: 'Samuel (Computer Sci.)',
      whatsapp: '2348055554433',
    },
    {
      id: 4,
      title: 'Compact 1.2L Stainless Electric Kettle',
      category: 'Dorm Gear',
      price: 4800,
      condition: 'Like new',
      location: 'Hostel Block A',
      seller: 'Blessing (Biochemistry)',
      whatsapp: '2348099887766',
    },
  ];

  const categories = ['All', 'Textbooks', 'Electronics', 'Dorm Gear'];

  const filtered = listings.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleContactSeller = (item) => {
    setActiveChat({
      seller: item.seller,
      item: item.title,
      price: item.price,
    });
  };

  return (
    <div className="rounded-xl bg-[#0d0e12] border border-[#1f222c] overflow-hidden text-left font-mono">
      {/* Header */}
      <div className="px-4 py-3 bg-[#12141a] border-b border-[#1f222c] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-bold text-[#f4f5f8]">Campus Marketplace</span>
        </div>
        <span className="text-[11px] text-[#5b6270]">Student Peer Exchange</span>
      </div>

      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Search & Category Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-[#5b6270]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search textbooks, dorm items, calculators..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-xs text-white placeholder-[#5b6270] focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-[#161820] text-[#9ca3af] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Feed */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#5b6270]">
              No campus listings matching your search.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-[#13151e] border border-[#1e222d] hover:border-[#2a3040] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="text-xs font-sans font-semibold text-[#f4f5f8] leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#9ca3af] flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">₦{item.price.toLocaleString()}</span>
                      <span>·</span>
                      <span className="text-[#5b6270]">{item.condition}</span>
                    </div>
                    <div className="text-[10px] text-[#5b6270] flex items-center gap-1">
                      <MapPin size={10} />
                      <span>{item.location} ({item.seller})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleContactSeller(item)}
                    className="px-2.5 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold shrink-0 flex items-center gap-1 transition-all"
                  >
                    <MessageCircle size={11} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* WhatsApp Simulation Notification Modal */}
        {activeChat && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] space-y-1 animate-fadeIn">
            <div className="flex items-center justify-between font-bold">
              <span>Simulated WhatsApp Handshake:</span>
              <button
                type="button"
                onClick={() => setActiveChat(null)}
                className="text-[#9ca3af] hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-[#eceef2]">
              "Hi {activeChat.seller}, I saw your listing for '{activeChat.item}' on Campus Marketplace for ₦{activeChat.price.toLocaleString()}. Is it still available?"
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-[#181b24] flex items-center justify-between text-[10px] text-[#5b6270]">
          <span>Project: Campus Marketplace</span>
          <span className="text-blue-400">Student Buyer / Seller Flow</span>
        </div>
      </div>
    </div>
  );
}
