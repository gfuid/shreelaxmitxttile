import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';

const HeroArches = () => {
  const arches = [
    {
      id: 1,
      title: 'Grand Dharmavaram Bridal Silk',
      subtitle: 'Pure Dharmavaram Temple Border',
      price: '₹1,500',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OQr5R5elEx3F9ZTcwJ0.jpg',
      category: 'Dharmavaram Pattu',
      link: '/shop?category=Dharmavaram+Pattu',
    },
    {
      id: 2,
      title: 'Opulent Banaras Cream Brocade',
      subtitle: 'Auspicious Heritage Katan Silk',
      price: '₹1,110',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OM6NfPNKJ2Pk83g0g4I.jpg',
      category: 'Banaras Wed Cream',
      link: '/shop?category=Banaras+Wed+Cream',
    },
    {
      id: 3,
      title: 'Flared Resham Fancy Ghagara',
      subtitle: 'Designer Partywear & Baby Ghagaras',
      price: '₹999',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Olv0mNDF0bIMMRKjEPG.jpg',
      category: 'Fancy Ghagara',
      link: '/shop?category=Fancy+Ghagara',
    },
    {
      id: 4,
      title: 'Surat Pouch & Printed Sarees',
      subtitle: 'Featherlight Soft Silk & Kasturi Prints',
      price: '₹425',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Ox5SbJ78Va4rRaIz45t.jpg',
      category: 'Surat Pouch',
      link: '/shop?category=Surat+Pouch',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#380B12] via-[#2F070E] to-[#250409] py-10 sm:py-16 px-3 sm:px-6 relative overflow-hidden border-b border-[#2C050B]">
      
      {/* Background Subtle Royal Golden Starlight & Radial Aura */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E8A87C_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-[#E8A87C]/15 to-transparent blur-3xl pointer-events-none"></div>

      <div className="container max-w-6xl relative z-10">
        
        {/* Majestic Brand Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          
          {/* Top Heritage Badge with Floating Animation */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#520C17]/90 border border-[#E8A87C]/40 text-[#E8A87C] text-[10.5px] sm:text-[11.5px] font-bold tracking-widest uppercase mb-5 shadow-lg animate-float">
            <ShieldCheck size={14} className="text-[#E8A87C] animate-pulse" />
            <span>Direct Wholesale Manufacturer Since August 1994 • Rikab Gunj, Hyderabad</span>
          </div>

          {/* Regal Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#F5E6D3] tracking-tight leading-[1.12] mb-5">
            Master Handloom Silks <br className="hidden sm:inline" />
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#E8A87C] via-[#FDE68A] to-[#E8A87C]">
              Woven for Royalty & Bridal Grandeur
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-amber-100/85 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            100% Silk Mark Certified pure Dharmavarm Pattu, Gadwal Silk, Banarasi Brocades, and Festive Ghagaras at authentic weaver wholesale rates.
          </p>

          {/* High-Converting Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/shop"
              className="px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E8A87C] to-[#D49363] hover:from-[#f0b991] hover:to-[#dfa071] text-[#380B12] font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Explore Saree Catalogues</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="https://wa.me/919394512326?text=Namaste%20Sri%20Vijay%20Laxmi%2C%20I%20would%20like%20to%20place%20a%20wholesale%20order"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Phone size={14} />
              <span>WhatsApp Video Call</span>
            </a>
          </div>

          {/* Quick Trust Pillars Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 pt-5 border-t border-[#520C17]/60 text-[11px] sm:text-xs text-amber-200/80 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#E8A87C]" /> 100% Pure Silk Mark Certified
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#E8A87C]" /> Min. Order ₹15,000/- Free Packing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#E8A87C]" /> Supplying Malls, Boutiques & Resellers
            </span>
          </div>

        </div>
        
        {/* 4 Mughal Scalloped Arch Windows Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {arches.map((arch, idx) => (
            <Link
              key={arch.id}
              to={arch.link}
              className="group relative flex flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-2.5 shine-effect"
            >
              {/* Outer Mughal Arch Shape Container */}
              <div className="w-full aspect-[2/3.5] scalloped-arch rounded-t-[100px] sm:rounded-t-[130px] border-2 border-[#E8A87C]/30 group-hover:border-amber-400 group-hover:shadow-[0_12px_35px_rgba(232,168,124,0.35)] transition-all duration-500 p-1 bg-[#2C050B]/80 shadow-2xl overflow-hidden">
                <div className="w-full h-full rounded-t-[96px] sm:rounded-t-[126px] overflow-hidden relative">
                  
                  {/* Saree Model Photography */}
                  <img
                    src={arch.image}
                    alt={arch.title}
                    className="w-full h-full object-cover object-top filter brightness-[0.95] group-hover:brightness-105 group-hover:scale-105 transition-all duration-700"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg';
                    }}
                  />

                  {/* Gradient Overlay at Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#200408]/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                  {/* Center Brand Watermark on second arch matching image.png */}
                  {idx === 1 && (
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
                      <span className="font-royal text-[9px] sm:text-[10px] text-amber-200 uppercase tracking-[0.25em] font-bold block">
                        SRI VIJAYLAXMI
                      </span>
                    </div>
                  )}

                  {/* Hover Caption */}
                  <div className="absolute bottom-3 left-3 right-3 text-center text-white">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#E8A87C] font-semibold block">
                      {arch.category}
                    </span>
                    <span className="font-serif text-xs sm:text-sm font-bold line-clamp-1 block mt-0.5">
                      {arch.title}
                    </span>
                  </div>

                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HeroArches;
