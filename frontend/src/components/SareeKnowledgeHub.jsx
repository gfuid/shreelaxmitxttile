import React, { useState } from 'react';
import { BookOpen, Sparkles, Check, HelpCircle, Shield, Feather, Scissors, Sun } from 'lucide-react';

const SareeKnowledgeHub = () => {
  const [activeTab, setActiveTab] = useState('authenticity');

  const tabs = [
    {
      id: 'authenticity',
      title: 'Silk Authenticity',
      icon: Shield,
    },
    {
      id: 'zari',
      title: 'Zari Grading',
      icon: Sparkles,
    },
    {
      id: 'draping',
      title: 'Styling & Draping',
      icon: Scissors,
    },
    {
      id: 'care',
      title: 'Heirloom Care',
      icon: Sun,
    },
  ];

  const content = {
    authenticity: {
      headline: 'How to Identify Authentic Pure Handloom Silk',
      tagline: 'Silk Mark Government Hologram Standards',
      points: [
        {
          title: 'Burn Test Nuance',
          text: 'Pure silk burns slowly with the aroma of burnt hair and leaves fine, crushable black ash. Synthetic fibers melt into hard plastic beads with a chemical smell.',
        },
        {
          title: 'Natural Temperature Adaptation',
          text: 'Genuine mulberry silk feels warm when rubbed against the skin and breathes naturally, keeping you comfortable during long wedding ceremonies.',
        },
        {
          title: 'Reverse Weft Inspection',
          text: 'Handloom Kadwa weaves show neatly cut ends or completely locked motifs on the reverse side, unlike scratchy mass-produced power-loom mesh.',
        },
      ],
    },
    zari: {
      headline: 'Understanding Zari Weft Purity',
      tagline: 'From Electroplated Gold to Metallic Sheen',
      points: [
        {
          title: 'Pure Gold & Silver Zari',
          text: 'Traditional Banarasi bridal heirlooms utilize silver-electroplated copper core threads bathed in 24k gold, ensuring luster that lasts for generations.',
        },
        {
          title: 'Tested Metallic Zari',
          text: 'High-grade tested zari utilizes specialized metallic polyester films wrapped over silk cores for brilliant shimmer at accessible wedding price points.',
        },
        {
          title: 'Tarnish Prevention',
          text: 'All Sri Vijaylaxmi zari undergoes an anti-oxidation seal coating to preserve its brilliant luster and prevent discoloration from humidity.',
        },
      ],
    },
    draping: {
      headline: 'Connoisseur Styling & Blouse Harmony',
      tagline: 'Creating the Royal Silhouette',
      points: [
        {
          title: 'Heavy Pallu Pinning',
          text: 'For heavy brocade Katan and Kanjivaram pallus, use broad shoulder pleats (4–5 folds) to showcase the grand peacock or shikargah artwork.',
        },
        {
          title: 'Contrast Blouse Pairing',
          text: 'Pair deep crimson sarees with antique emerald green blouses, or mustard gold weaves with royal purple velvet to enhance regal contrast.',
        },
        {
          title: '1-Minute Ready Pleats',
          text: 'Take advantage of our complimentary fall & pico service. Pre-pleated options are also available on request for effortless draping in under 2 minutes.',
        },
      ],
    },
    care: {
      headline: 'Heirloom Preservation & Storage Secrets',
      tagline: 'Preserving Silk Heirlooms Across Generations',
      points: [
        {
          title: 'Pure Muslin Wrap',
          text: 'Never store pure silk in plastic bags which trap moisture. Wrap your sarees in pure unbleached cotton or muslin cloth to let the silk fibers breathe.',
        },
        {
          title: 'Dry Clean Only',
          text: 'Always dry-clean your silk sarees. For minor spills, blot gently with clean water—never rub vigorously against zari weaves.',
        },
        {
          title: 'Periodic Refolding',
          text: 'Unfold and air out your heirloom sarees in a shaded room every 3–4 months and change the fold lines to prevent crease fatigue.',
        },
      ],
    },
  };

  const currentContent = content[activeTab];

  return (
    <section className="py-14 bg-white border-b border-[#E5DDD0]">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 bg-[#FDF2F4] text-[#4A0E17] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            <BookOpen size={11} className="text-[#D97706]" />
            <span>Saree Connoisseur's Guide</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[0.05em] text-[#380B12] uppercase">
            The Saree Knowledge Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#736B63] mt-2">
            Master the art of identifying, styling, and preserving pure handloom silks.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#380B12] text-white shadow-md'
                    : 'bg-[#FAF8F5] text-[#380B12] hover:bg-[#F3EFE9] border border-[#E5DDD0]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#E8A87C]' : 'text-gray-400'} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 border border-[#E5DDD0] max-w-4xl mx-auto shadow-xs">
          <div className="mb-6 pb-4 border-b border-[#E5DDD0]">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D97706] block">
              {currentContent.tagline}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#380B12] mt-1">
              {currentContent.headline}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentContent.points.map((point, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#E8A87C] flex items-center justify-center text-[#700B1A] font-serif font-bold text-xs mb-3">
                    0{idx + 1}
                  </div>
                  <h4 className="font-serif text-sm font-bold text-[#380B12] mb-1.5">
                    {point.title}
                  </h4>
                  <p className="text-xs text-[#736B63] leading-relaxed">
                    {point.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SareeKnowledgeHub;
