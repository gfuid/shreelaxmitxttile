import React, { useState, useEffect } from 'react';
import { Sparkles, Award } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const WEAVING_PHRASES = [
  'Interlacing Pure Mulberry Silk Warp & Weft...',
  'Spinning Authentic Dharmavaram & Gadwal Zari...',
  'Silk Mark Certified Handloom Inspection...',
  'Curating Master Artisan Saree Presentation...'
];

const SareeLoader = ({
  size = 'card', // 'fullscreen' | 'card' | 'compact'
  message = 'Weaving Pure Silk Elegance...',
  subtext = null,
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % WEAVING_PHRASES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // 1. Compact Mini Spinner (for inline buttons, search triggers, small badges)
  if (size === 'compact') {
    return (
      <div className="inline-flex items-center gap-2.5 select-none">
        <div className="relative w-6 h-6 flex items-center justify-center">
          {/* Outer Rotating Golden Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#E8A87C]/30 border-t-[#D97706] border-r-[#BE185D] animate-spin"></div>
          {/* Inner Golden Sparkle Stone */}
          <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#BE185D] to-[#E8A87C] shadow-xs animate-pulse"></div>
        </div>
        <span className="text-xs font-semibold text-[#4A0E17]">{message}</span>
      </div>
    );
  }

  const isFullscreen = size === 'fullscreen';

  return (
    <div
      className={`flex flex-col items-center justify-center select-none text-center relative overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-xl p-6 min-h-screen'
          : 'py-10 sm:py-12 px-4 w-full bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] rounded-3xl border border-[#E5DDD0] shadow-sm'
      }`}
    >
      {/* Royal Corner Accents in Fullscreen */}
      {isFullscreen && (
        <>
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#E8A87C]/60 rounded-tl-xl pointer-events-none"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#E8A87C]/60 rounded-tr-xl pointer-events-none"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#E8A87C]/60 rounded-bl-xl pointer-events-none"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#E8A87C]/60 rounded-br-xl pointer-events-none"></div>
        </>
      )}

      {/* Luminous Warm Amber & Rose Silk Ambient Halo */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#E8A87C]/25 via-[#BE185D]/15 to-amber-200/25 blur-3xl pointer-events-none animate-royal-glow"></div>

      {/* Centerpiece: Royal Golden Zari Mandala & Crest */}
      <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center mb-5 shrink-0">
        
        {/* Layer 1: Concentric SVG Rotating Mandala Rings */}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 w-full h-full drop-shadow-sm overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Liquid 24K Gold Zari Gradient */}
            <linearGradient id="loaderGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8A87C" />
              <stop offset="25%" stopColor="#FFF2D6" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Ruby Silk Gradient */}
            <linearGradient id="loaderRuby" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#BE185D" />
              <stop offset="100%" stopColor="#5C161D" />
            </linearGradient>

            {/* Silk Glow Filter */}
            <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Subtle Dashed Rim */}
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke="#E8A87C"
            strokeWidth="0.8"
            strokeDasharray="3 4"
            opacity="0.4"
          />

          {/* Clockwise Outer Ring with 12 Sun/Jewel Dots */}
          <g className="animate-royal-spin">
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="url(#loaderGold)"
              strokeWidth="1.6"
              strokeDasharray="18 10"
              strokeLinecap="round"
            />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 80 + 68 * Math.cos(rad);
              const y = 80 + 68 * Math.sin(rad);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={i % 3 === 0 ? "2.6" : "1.6"}
                  fill={i % 3 === 0 ? "url(#loaderGold)" : "#BE185D"}
                  filter={i % 3 === 0 ? "url(#royalGlow)" : undefined}
                />
              );
            })}
          </g>

          {/* Counter-Clockwise Middle Filigree Lotus Petal Ring */}
          <g className="animate-royal-spin-counter">
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeDasharray="6 6"
              opacity="0.6"
            />
            {/* 8 Symmetrical Lotus Petals / Diamond Points */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => (
              <path
                key={idx}
                d={`M 80 80 L ${80 + 54 * Math.cos((deg * Math.PI) / 180)} ${80 + 54 * Math.sin((deg * Math.PI) / 180)}`}
                stroke="url(#loaderGold)"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.5"
              />
            ))}
          </g>

          {/* Inner Golden Beaded Halo */}
          <circle
            cx="80"
            cy="80"
            r="44"
            fill="none"
            stroke="url(#loaderGold)"
            strokeWidth="2"
            filter="url(#royalGlow)"
          />
        </svg>

        {/* Center Royal Medallion with Brand Logo / Crest */}
        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-[#FAF7F2] via-white to-[#F5EDE1] p-1 shadow-lg border-2 border-[#E8A87C] flex items-center justify-center overflow-hidden z-10 group">
          {/* Subtle inner gold shimmer reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/20 to-transparent pointer-events-none"></div>
          
          <img
            src={logoImg}
            alt="Sri Vijay Laxmi Sarees"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xs transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback if logo fails: show Royal SVL Monogram
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />

          {/* Fallback Monogram */}
          <div className="hidden flex-col items-center justify-center text-center">
            <span className="font-serif font-black text-sm text-[#4A0E17] tracking-wider">SVL</span>
            <span className="text-[8px] font-bold text-[#D97706] tracking-widest uppercase">1980</span>
          </div>

          {/* Shimmering micro-badge on bottom of emblem */}
          <div className="absolute -bottom-0.5 inset-x-0 mx-auto w-max px-1.5 py-0.2 bg-[#4A0E17] border border-[#E8A87C] rounded-full text-[7px] text-[#FDE68A] font-black uppercase tracking-widest shadow-xs">
            Silk Mark
          </div>
        </div>

        {/* Orbiting Sparkles */}
        <div className="absolute -top-1 right-2 text-amber-400 animate-ping opacity-75 pointer-events-none">
          <Sparkles size={13} />
        </div>
        <div className="absolute bottom-2 left-1 text-[#E8A87C] animate-pulse pointer-events-none">
          <Sparkles size={11} />
        </div>
      </div>

      {/* Layer 2: Animated Silk Warp & Weft Threads SVG */}
      <div className="w-56 h-6 mb-3 relative flex items-center justify-center">
        <svg viewBox="0 0 220 24" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="silkThreadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#BE185D" stopOpacity="0.2" />
              <stop offset="35%" stopColor="#E8A87C" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFBEB" stopOpacity="1" />
              <stop offset="65%" stopColor="#D97706" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5C161D" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Primary Silk Sine-Wave Thread (Warp) */}
          <path
            d="M 10 12 C 40 2, 70 22, 110 12 C 150 2, 180 22, 210 12"
            fill="none"
            stroke="url(#silkThreadGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-silk-thread"
          />

          {/* Secondary Interlacing Weft Thread */}
          <path
            d="M 10 12 C 40 22, 70 2, 110 12 C 150 22, 180 2, 210 12"
            fill="none"
            stroke="#E8A87C"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Layer 3: Typography & Live Craft Status */}
      <div className="space-y-2 max-w-md mx-auto z-10 px-2">
        
        {/* Heritage Trust Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#4A0E17]/8 text-[#4A0E17] border border-[#E8A87C]/40 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xs">
          <Award size={12} className="text-[#D97706]" />
          <span>Sri Vijay Laxmi Sarees & Textiles • Hyderabad</span>
        </div>

        {/* Dynamic Heading with Rich Dark Maroon & Gold Sheen */}
        <h3 className="font-royal text-sm sm:text-base md:text-lg font-black tracking-wider text-[#380B12] uppercase leading-tight">
          {message}
        </h3>

        {/* Smooth Rotating Handloom Phrase */}
        <p className="text-xs text-[#736B63] font-serif italic min-h-[1.25rem] transition-all duration-300">
          {subtext || WEAVING_PHRASES[phraseIndex]}
        </p>

        {/* Hairline Golden Zari Progress Bar with Gleam Sweep */}
        <div className="w-44 sm:w-52 h-1 bg-[#EDE5D8] rounded-full mx-auto overflow-hidden mt-3 relative">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#E8A87C] to-[#BE185D] rounded-full animate-royal-gleam"></div>
        </div>

      </div>

    </div>
  );
};

export default SareeLoader;
