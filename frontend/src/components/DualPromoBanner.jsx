import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const DualPromoBanner = () => {
  return (
    <section className="py-12 bg-[#F8F4EE] border-b border-[#E5DDD0]">
      <div className="container">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Banner 1: The Royal Banarasi Edit */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#4A0E17] to-[#200408] text-white p-6 sm:p-8 flex flex-col justify-between min-h-[360px] sm:min-h-[400px] border-2 border-[#E8A87C]/30 shadow-xl group">
            
            {/* Background Texture & Image */}
            <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-700">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
                alt="Banarasi Weave Background"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#200408] via-[#4A0E17]/80 to-transparent"></div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-xs">
                <Sparkles size={11} className="text-amber-300" />
                <span>Varanasi Loom Heritage</span>
              </span>
              <span className="font-royal text-[10px] text-amber-200 tracking-widest uppercase">
                Est. 1974
              </span>
            </div>

            {/* Middle / Bottom Content */}
            <div className="relative z-10 mt-12 space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#E8A87C] uppercase block">
                  The Royal Banarasi Edit
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                  Intricate Kadwa Jaal & Floral Butis
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
                Woven with pure silver and gold dipped zari threads on high-twist mulberry katan silk. Timeless bridal heirlooms.
              </p>

              <div className="pt-3">
                <Link
                  to="/shop?category=Banarasi+Silk"
                  className="btn-price-pill inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider"
                >
                  <span>Explore Banarasi Edit</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>

          {/* Banner 2: The Temple Kanjivaram Grandeur */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D1A10] to-[#120803] text-white p-6 sm:p-8 flex flex-col justify-between min-h-[360px] sm:min-h-[400px] border-2 border-[#D97706]/30 shadow-xl group">
            
            {/* Background Texture & Image */}
            <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-700">
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80"
                alt="Kanjivaram Weave Background"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#120803] via-[#2D1A10]/80 to-transparent"></div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-xs">
                <Sparkles size={11} className="text-amber-300" />
                <span>Kanchipuram Silk Guild</span>
              </span>
              <span className="font-royal text-[10px] text-amber-200 tracking-widest uppercase">
                Pure Korvai
              </span>
            </div>

            {/* Middle / Bottom Content */}
            <div className="relative z-10 mt-12 space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-[0.2em] text-amber-300 uppercase block">
                  The Southern Grandeur
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                  Temple Borders & Heavy Zari Pallus
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
                Featuring interlocking Korvai borders, Mayil (peacock) motifs, and pure 3-ply mulberry silk for unmatched drape.
              </p>

              <div className="pt-3">
                <Link
                  to="/shop?category=Kanjivaram+Silk"
                  className="btn-price-pill inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider"
                >
                  <span>Explore Kanjivaram Edit</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DualPromoBanner;
