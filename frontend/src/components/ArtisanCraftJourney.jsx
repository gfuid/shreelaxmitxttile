import React, { useState } from 'react';
import { Sparkles, Layers, Gem, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

const ArtisanCraftJourney = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      num: '01',
      title: 'Mulberry Silk Selection',
      subtitle: 'Pure Grade-A Natural Fibers',
      description: 'We source raw high-twist Katan and Mulberry silk yarns directly from certified sericulture clusters, ensuring unmatched tensile strength, natural luster, and a fluid drape.',
      highlight: '100% Pure Mulberry Cocoon Filament',
      image: 'https://images.unsplash.com/photo-1610030469668-9359e8979313?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 2,
      num: '02',
      title: 'Gold & Silver Zari Spinning',
      subtitle: 'Electroplated Metallic Threads',
      description: 'Our signature Zari is spun using fine silver-coated micro-wires bonded with pure silk cores, then dipped in liquid gold for a luminous, non-tarnishing heirloom sheen.',
      highlight: 'Tested & Pure Metallic Zari Threads',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 3,
      num: '03',
      title: 'Kadwa Handloom Weaving',
      subtitle: '180+ Hours of Master Artistry',
      description: 'Using traditional pit and shuttle looms, master weavers manually engrave intricate floral jaals, shikargah hunting motifs, and paisley butis without loose threads on the reverse.',
      highlight: 'Zero Loose Weft Floating Threads',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 4,
      num: '04',
      title: 'Silk Mark & Velvet Casing',
      subtitle: 'Certified Quality Dispatch',
      description: 'Every completed saree undergoes a 5-point quality audit, receives the Silk Mark Government Hologram, and is nestled inside a breathable muslin velvet preservation box.',
      highlight: 'Government Certified Silk Mark Guarantee',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-[#E5DDD0]">
      <div className="container">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 bg-[#FDF2F4] text-[#4A0E17] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={11} className="text-[#D97706]" />
            <span>Behind The Masterpiece</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[0.05em] text-[#380B12] uppercase">
            From Loom to Luxury
          </h2>
          <p className="text-xs sm:text-sm text-[#736B63] mt-2">
            The extraordinary 4-stage handloom journey behind every Sri Vijaylaxmi heirloom saree.
          </p>
        </div>

        {/* Step Navigation Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-300 border ${
                activeStep === idx
                  ? 'bg-[#380B12] text-white border-[#380B12] shadow-lg scale-[1.02]'
                  : 'bg-[#FAF8F5] text-[#380B12] border-[#E5DDD0] hover:border-[#4A0E17]/40 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-black font-mono ${activeStep === idx ? 'text-[#E8A87C]' : 'text-gray-400'}`}>
                  STEP {step.num}
                </span>
                {activeStep === idx && (
                  <span className="w-2 h-2 rounded-full bg-[#E8A87C] animate-pulse"></span>
                )}
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-bold line-clamp-1">
                {step.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Active Step Showcase Card */}
        <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 border border-[#E5DDD0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Image with Mughal Curved Frame */}
          <div className="lg:col-span-5 relative">
            <div className="w-full aspect-[4/3] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-white bg-black/10 relative">
              <img
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="w-full h-full object-cover object-top transition-all duration-700"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Step {steps[activeStep].num} of 04
              </div>
            </div>
          </div>

          {/* Right: Description & Points */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D97706] block">
                {steps[activeStep].subtitle}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#380B12] mt-1">
                {steps[activeStep].title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
              {steps[activeStep].description}
            </p>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E5DDD0] flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-xs font-bold text-[#380B12]">
                {steps[activeStep].highlight}
              </span>
            </div>
          </div>

        </div>

        {/* Stats Counter Ribbon */}
        <div className="mt-10 pt-8 border-t border-[#E5DDD0] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#380B12] block">50+ Years</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">Weaving Heritage</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#380B12] block">500+ Looms</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">Master Weaver Families</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#380B12] block">10,000+</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">Brides Celebrated</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#380B12] block">100% Pure</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">Silk Mark Certified</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ArtisanCraftJourney;
