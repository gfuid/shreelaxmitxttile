import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

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
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
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
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Ox5SbJ78Va4rRaIz45u.jpg',
      category: 'Surat Pouch',
      link: '/shop?category=Surat+Pouch',
    },
  ];

  return (
    <section className="bg-[#380B12] py-8 sm:py-12 px-3 sm:px-6 relative overflow-hidden border-b border-[#2C050B]">
      
      {/* Background Subtle Floral/Texture Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8A87C_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="container max-w-6xl relative z-10">
        
        {/* 4 Mughal Scalloped Arch Windows Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {arches.map((arch, idx) => (
            <Link
              key={arch.id}
              to={arch.link}
              className="group relative flex flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-2"
            >
              {/* Outer Mughal Arch Shape Container */}
              <div className="w-full aspect-[2/3.5] scalloped-arch rounded-t-[100px] sm:rounded-t-[130px] border-2 border-[#E8A87C]/30 group-hover:border-[#E8A87C] transition-colors p-1 bg-[#2C050B]/80 shadow-2xl overflow-hidden">
                <div className="w-full h-full rounded-t-[96px] sm:rounded-t-[126px] overflow-hidden relative">
                  
                  {/* Saree Model Photography */}
                  <img
                    src={arch.image}
                    alt={arch.title}
                    className="w-full h-full object-cover object-top filter brightness-[0.95] group-hover:brightness-105 group-hover:scale-105 transition-all duration-700"
                    loading="eager"
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
