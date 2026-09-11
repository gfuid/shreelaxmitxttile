import React from 'react';
import { Sparkles, ShieldCheck, Truck, Phone, Award, Building2 } from 'lucide-react';

const MarqueeRibbon = () => {
  const items = [
    { text: 'SRI VIJAY LAXMI TEXTILES (INDIA) PRIVATE LIMITED', icon: Building2, highlight: true },
    { text: 'RUNNING 28+ YEARS SINCE AUGUST 1994', icon: Award },
    { text: 'TOTAL WHOLESALE OR SET-TO-SET WHOLESALE ONLY', icon: ShieldCheck, highlight: true },
    { text: 'PLEASE ORDER MINIMUM ₹15,000/- (PACKING CHARGES FREE)', icon: Truck, highlight: true },
    { text: 'SUPPLYING BIG MALLS, SHOWROOMS & HOUSEHOLD LADIES RESELLERS', icon: Sparkles },
    { text: 'FOUNDER: MOHAN KUMAR • RIKABGUNJ, HYDERABAD', icon: Building2 },
    { text: 'DIRECT WHATSAPP & CALL: +91 9394512326', icon: Phone, highlight: true },
    { text: 'VERIFIED REVIEWS ON GOOGLE', icon: ShieldCheck },
  ];

  return (
    <div className="relative w-full bg-gradient-to-r from-[#2C050B] via-[#4A0E17] to-[#2C050B] border-y border-[#D97706]/40 py-2.5 overflow-hidden select-none shadow-md">
      {/* Left and Right Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#2C050B] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#2C050B] to-transparent z-10 pointer-events-none"></div>

      {/* Infinite Scrolling Track */}
      <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
        {/* Track 1 */}
        <div className="flex items-center shrink-0">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`track1-${idx}`}
                className="inline-flex items-center gap-2 mx-4 sm:mx-6 text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-colors"
              >
                <Icon
                  size={14}
                  className={`shrink-0 ${item.highlight ? 'text-amber-400 animate-pulse' : 'text-[#E8A87C]'}`}
                />
                <span
                  className={
                    item.highlight
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 font-extrabold'
                      : 'text-[#F5E6D3]'
                  }
                >
                  {item.text}
                </span>
                <span className="text-[#E8A87C]/40 mx-2">•</span>
              </div>
            );
          })}
        </div>

        {/* Track 2 (Duplicate for Seamless Loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`track2-${idx}`}
                className="inline-flex items-center gap-2 mx-4 sm:mx-6 text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-colors"
              >
                <Icon
                  size={14}
                  className={`shrink-0 ${item.highlight ? 'text-amber-400 animate-pulse' : 'text-[#E8A87C]'}`}
                />
                <span
                  className={
                    item.highlight
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 font-extrabold'
                      : 'text-[#F5E6D3]'
                  }
                >
                  {item.text}
                </span>
                <span className="text-[#E8A87C]/40 mx-2">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarqueeRibbon;
