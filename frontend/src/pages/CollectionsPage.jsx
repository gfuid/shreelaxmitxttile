import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Layers, Eye } from 'lucide-react';

const CollectionsPage = () => {
  const collections = [
    {
      id: 'banarasi',
      title: 'Royal Banarasi Katan Silk',
      tagline: 'Kadwa Jaals & Floral Butis Woven in Kashi',
      description: 'The pinnacle of Indian handloom heritage. High-twist mulberry katan silk woven with pure silver and gold dipped zari threads. Timeless bridal and festival heirlooms.',
      priceRange: 'Starting from ₹2,999',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Banarasi+Silk',
      itemCount: '120+ Weaves',
      bgTag: 'Heirloom Masterpiece',
    },
    {
      id: 'kanjivaram',
      title: 'Kanjivaram Temple Heritage',
      tagline: 'Interlocking Korvai Borders & Auspicious Mayil Motifs',
      description: 'Handcrafted South Indian silks featuring heavyweight temple motifs, contrast Korvai borders, and authentic gold zari pallus designed for traditional muhurthams.',
      priceRange: 'Starting from ₹3,499',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Kanjivaram+Silk',
      itemCount: '85+ Weaves',
      bgTag: 'South Grandeur',
    },
    {
      id: 'organza',
      title: 'Pastel Hand-Painted Organza',
      tagline: 'Feather-Light Sheer Drape with Scalloped Edges',
      description: 'Ethereal sheer organza silks in blush pastels, hand-painted water lily florals, fine pearl scalloped borders, and delicately embroidered blouse pairings.',
      priceRange: 'Starting from ₹1,999',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Organza+Sarees',
      itemCount: '60+ Weaves',
      bgTag: 'Modern Grace',
    },
    {
      id: 'georgette',
      title: 'Georgette & Foil Mirror Work',
      tagline: 'Fluid Party Wear & Sangeet Soirée Drapes',
      description: 'Body-hugging breezy faux georgettes with shimmering foil mirror borders, ton-sur-ton sequin embroidery, and vibrant festive color palettes.',
      priceRange: 'Starting from ₹1,899',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Chiffon+%26+Georgette',
      itemCount: '75+ Weaves',
      bgTag: 'Party Glamour',
    },
    {
      id: 'chanderi',
      title: 'Chanderi & Tussar Cotton Silks',
      tagline: 'Lightweight Golden Ashrafi Buti Weaves',
      description: 'Breathable, feather-light handloom cotton-silks from central India. Ideal for daytime puja rituals, family gatherings, and subtle office luxury.',
      priceRange: 'Starting from ₹1,499',
      image: 'https://images.unsplash.com/photo-1610030469668-9359e8979313?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Chanderi+%26+Tussar',
      itemCount: '50+ Weaves',
      bgTag: 'Everyday Silk',
    },
    {
      id: 'ready-to-wear',
      title: '1-Minute Ready-to-Wear Sarees',
      tagline: 'Pre-Pleated Precision for Instant Elegance',
      description: 'Say goodbye to pleating struggles. Pre-stitched with adjustable waist hooks, pre-draped pleats, and matching readymade padded designer blouses.',
      priceRange: 'Starting from ₹2,299',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Ready+To+Wear+Sarees',
      itemCount: '40+ Styles',
      bgTag: 'Instant Drape',
    },
    {
      id: 'bridal',
      title: 'Grand Bridal Trousseau Sanctuary',
      tagline: 'Bespoke Heirlooms for the Royal Indian Bride',
      description: 'High-density pure tissue silks, kaddhwa jaals, real gold electroplated threads, and heavy stone work crafted exclusively for Indian brides.',
      priceRange: 'Starting from ₹4,999',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Bridal+%26+Wedding',
      itemCount: '90+ Masterpieces',
      bgTag: 'Bridal Royalty',
    },
    {
      id: 'lehengas',
      title: 'Designer Flared Lehengas',
      tagline: 'Micro-Velvet & Resham Thread Flares',
      description: 'Multi-tiered circular flares with double can-can, matching designer cholis, and four-sided embroidered net dupattas for grand wedding receptions.',
      priceRange: 'Starting from ₹5,499',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
      link: '/shop?category=Designer+Lehengas',
      itemCount: '30+ Designs',
      bgTag: 'Reception Luxe',
    },
  ];

  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-300" />
            <span>Curated Weave Lookbook</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            SIGNATURE COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Explore authentic handloom traditions across Varanasi, Kanchipuram, Chanderi, and contemporary bridal ateliers.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-14">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-3xl border border-[#E5DDD0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group"
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Badge Pills */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white/90 backdrop-blur-xs text-[#380B12] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/40 shadow-xs">
                      {col.bgTag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      {col.itemCount}
                    </span>
                    <span className="text-xs font-bold text-white bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                      {col.priceRange}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#380B12] group-hover:text-[#700B1A] transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
                      {col.tagline}
                    </p>
                    <p className="text-xs text-[#736B63] leading-relaxed line-clamp-3 pt-1">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={col.link}
                      className="btn-price-pill inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default CollectionsPage;
