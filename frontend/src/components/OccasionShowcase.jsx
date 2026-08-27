import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const OccasionShowcase = () => {
  const occasions = [
    {
      id: 'bridal',
      title: 'Bridal Muhurtham',
      subtitle: 'Dharmavaram Temple Zari Borders',
      tag: 'Grand Weddings',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OQr5R5elEx3F9ZTcwJ0.jpg',
      link: '/shop?category=Dharmavaram+Pattu',
      accentColor: 'from-[#700B1A]/90 to-transparent',
    },
    {
      id: 'gadwal',
      title: 'Designer Pattu Gadwal',
      subtitle: 'Pure Silk with Authentic Kuttu Borders',
      tag: 'Heritage Royal',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg',
      link: '/shop?category=Designer+Pattu+Gadwal',
      accentColor: 'from-[#92400E]/90 to-transparent',
    },
    {
      id: 'ghagara',
      title: 'Wedding Ghagara & Lehengas',
      subtitle: 'Flared Resham & Zari Party Drapes',
      tag: 'Reception & Sangeet',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OYLLDoftVHEZXZfMcsW.jpg',
      link: '/shop?category=Wedding+Ghagara',
      accentColor: 'from-[#831843]/90 to-transparent',
    },
    {
      id: 'narayanpet',
      title: 'Cotton Narayanpet',
      subtitle: 'Handloom Buta & Contrast Borders',
      tag: 'Puja & Festive',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Oxz1jj4Yca3qLJ0MJW3.jpg',
      link: '/shop?category=COTTON+NARAYANPET',
      accentColor: 'from-[#064E3B]/90 to-transparent',
    },
    {
      id: 'surat',
      title: 'Surat Prints & Pattu',
      subtitle: 'Lightweight Printed Georgette & Soft Silks',
      tag: 'Daily & Office Elegance',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OQs6XbkZqaaqWGB_ux6.jpg',
      link: '/shop?category=Surat+Prints',
      accentColor: 'from-[#1F2937]/90 to-transparent',
    },
  ];

  return (
    <section className="py-12 bg-[#FAF6F0] border-b border-[#E5DDD0]">
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-3 border-b border-[#E5DDD0]">
          <div>
            <div className="flex items-center gap-1.5 text-[#700B1A] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles size={13} className="text-[#D97706]" />
              <span>Auspicious Celebrations</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.05em] text-[#380B12] uppercase">
              Curated by Occasion
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-[#700B1A] hover:text-[#D97706] flex items-center gap-1 mt-2 sm:mt-0 transition-colors uppercase tracking-wider"
          >
            <span>Explore Trousseau Lookbook</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 5-Column Occasion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {occasions.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative h-[340px] sm:h-[380px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E5DDD0] flex flex-col justify-end p-4"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.95] group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className={`absolute inset-0 bg-gradient-to-t ${item.accentColor} via-black/20 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>

              {/* Top Pill Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-white/90 backdrop-blur-xs text-[#380B12] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/40 shadow-xs">
                  {item.tag}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 text-white space-y-1">
                <h3 className="font-serif text-lg font-bold leading-tight drop-shadow-sm group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-gray-200 leading-snug line-clamp-1">
                  {item.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Shop Collection</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OccasionShowcase;
