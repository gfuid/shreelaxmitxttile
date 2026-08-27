import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Sun, Wind, Scissors, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';

const SilkCarePage = () => {
  const commandments = [
    {
      id: 1,
      icon: Droplets,
      title: 'Always Opt for Professional Dry Cleaning',
      description: 'Never hand-wash or machine-wash pure handloom Katan or Kanjivaram silks in water. Water weakens the natural sericin proteins in silk fibers and can bleed vegetable dyes.',
    },
    {
      id: 2,
      icon: Wind,
      title: 'Wrap in Pure Unbleached Muslin Cloth',
      description: 'Plastic bags trap ambient humidity, leading to permanent yellowing and zari tarnishing. Wrap each saree in breathable, unbleached cotton or pure muslin cloth.',
    },
    {
      id: 3,
      icon: Scissors,
      title: 'Rotate Fold Lines Every 3 Months',
      description: 'Heirloom silks kept in static folds for years can suffer from crease fatigue. Unfold your sarees every few months, air them in a shaded room, and refold along new lines.',
    },
    {
      id: 4,
      icon: Sun,
      title: 'Never Dry or Air in Direct Sunlight',
      description: 'Ultraviolet rays break down natural silk luster and fade delicate pastels. Always air out your silks in a cool, well-ventilated shaded indoor room.',
    },
    {
      id: 5,
      icon: Sparkles,
      title: 'Iron on Medium Heat Under a Protective Cloth',
      description: 'Never place a hot iron directly on zari embroidery. Place a clean cotton muslin sheet over the saree and iron on the reverse side using medium-low silk heat.',
    },
    {
      id: 6,
      icon: Shield,
      title: 'Use Natural Dry Neem Leaves for Protection',
      description: 'Avoid chemical naphthalene balls directly touching silk fabrics. Place dried neem leaves or pure cedarwood blocks inside the wardrobe to repel moths naturally.',
    },
  ];

  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-300" />
            <span>Preserving Generational Heirlooms</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            PURE SILK CARE GUIDE
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Essential care rituals to keep your Banarasi, Kanjivaram, and Organza silks as luminous and pristine as the day they left the handloom.
          </p>
        </div>
      </section>

      {/* 6 Commandments Grid */}
      <section className="py-14">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#380B12] uppercase">
              The 6 Principles of Heirloom Silk Care
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Passed down through master weaver families in Varanasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commandments.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  className="bg-white p-6 rounded-3xl border border-[#E5DDD0] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FDF2F4] text-[#700B1A] flex items-center justify-center shadow-xs">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#380B12]">
                      {cmd.title}
                    </h3>
                    <p className="text-xs text-[#736B63] leading-relaxed">
                      {cmd.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Silk Mark Authentication Test Guide */}
      <section className="py-14 bg-white border-t border-[#E5DDD0]">
        <div className="container max-w-4xl space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest block">
              Connoisseur Verification
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#380B12] mt-1">
              How to Test Pure Handloom Silk at Home
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E5DDD0]">
            <div className="space-y-2">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                ✓ 100% Pure Silk (The Burn Test)
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                When a single loose warp thread of pure silk is ignited, it burns slowly, emits the natural scent of burning hair, and leaves a soft, crushable black ash that turns to powder when pinched.
              </p>
            </div>

            <div className="space-y-2">
              <span className="inline-block bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                ✗ Synthetic / Art Silk (Polyester)
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                Synthetic fabrics melt rapidly with a black smoke, produce an acrid chemical smell like burning plastic, and leave a hard, uncrushable plastic bead at the tip.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/shop"
              className="btn-price-pill inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider"
            >
              <span>Explore Certified Silk Sarees</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SilkCarePage;
