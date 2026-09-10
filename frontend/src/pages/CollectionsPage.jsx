import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CollectionsPage = () => {
  const collections = [
    {
      id: 'dharmavaram-pattu',
      title: 'Grand Dharmavaram Bridal Pattu',
      category: 'Dharmavaram Pattu',
      tagline: 'Silk Mark Certified Pure Mulberry Silk & Temple Zari Borders',
      description: 'Auspicious South Indian heritage weaves featuring heavy golden temple borders, contrast grand pallus, and pure silk mark certification. Direct wholesale rates from our Hyderabad looms.',
      priceRange: '₹1,500 Direct Loom',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OQmalLAtk_pT71qG9Wo.jpg',
      link: '/shop?category=Dharmavaram+Pattu',
      itemCount: '10+ Master Weaves',
      bgTag: 'Silk Mark Certified',
    },
    {
      id: 'designer-pattu-gadwal',
      title: 'Designer Pattu Gadwal',
      category: 'Designer Pattu Gadwal',
      tagline: 'Heritage Pure Silk with Authentic Kuttu Interlocking Borders',
      description: 'Prestigious Gadwal handloom silk sarees renowned for lightweight pure silk bodies attached with heavyweight pure zari borders and contrast artistic pallus.',
      priceRange: '₹4,850 Direct Factory',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg',
      link: '/shop?category=Designer+Pattu+Gadwal',
      itemCount: '10+ Weaves',
      bgTag: 'Royal Heritage',
    },
    {
      id: 'banaras-wed-cream',
      title: 'Banaras Wed Cream',
      category: 'Banaras Wed Cream',
      tagline: 'Auspicious Heritage Cream & Gold Katan Silks',
      description: 'Opulent Banarasi wedding cream and golden brocade sarees handwoven with fine floral jaals, shikargah hunting motifs, and delicate butis for muhurthams and rituals.',
      priceRange: 'Starting from ₹1,110',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OM6NfPNKJ2Pk83g0g4I.jpg',
      link: '/shop?category=Banaras+Wed+Cream',
      itemCount: '11+ Weaves',
      bgTag: 'Bridal Auspicious',
    },
    {
      id: 'wedding-ghagara',
      title: 'Bridal Wedding Ghagara',
      category: 'Wedding Ghagara',
      tagline: 'Heavy Flared Resham & Zari Bridal Lehenga Cholis',
      description: 'Grand bridal and sangeet wedding ghagaras with multi-tiered circular flares, elaborate resham embroidery, micro-velvet blouses, and ornate designer dupattas.',
      priceRange: '₹1,775 – ₹2,460',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OVr8xe0qy6e5m-oTGDt.jpg',
      link: '/shop?category=Wedding+Ghagara',
      itemCount: '9+ Grand Sets',
      bgTag: 'Bridal Trousseau',
    },
    {
      id: 'fancy-ghagara',
      title: 'Partywear Fancy Ghagara',
      category: 'Fancy Ghagara',
      tagline: 'Flared Resham Embroidery & Sangeet Party Drapes',
      description: 'Glamorous festive partywear and big size ghagaras crafted with rich flared resham threads, contrast borders, and comfortable lightweight lining for celebrations.',
      priceRange: '₹950 – ₹1,080',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Olv0mNDF0bIMMRKjEPG.jpg',
      link: '/shop?category=Fancy+Ghagara',
      itemCount: '22+ Styles',
      bgTag: 'Festive Bestseller',
    },
    {
      id: 'baby-ghagara',
      title: 'Kids & Baby Festive Ghagara',
      category: 'Baby Ghagara',
      tagline: 'Charming Silk Ghagara Cholis for Young Princesses',
      description: 'Vibrant and comfortable festive kids ghagara cholis woven in cheerful silk colors with soft skin-friendly inner linings and delicate golden border trims.',
      priceRange: 'Special ₹699',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Olv3N1RcUGDBn_byQm7.jpg',
      link: '/shop?category=Baby+Ghagara',
      itemCount: '12+ Styles',
      bgTag: 'Kids Festive',
    },
    {
      id: 'cotton-narayanpet',
      title: 'Handloom Cotton Narayanpet',
      category: 'COTTON NARAYANPET',
      tagline: 'Traditional Checks, Temple Borders & Pure Breathable Cotton',
      description: 'Authentic Narayanpet handloom cotton sarees featuring classic butas, checks, and vibrant contrast temple borders. Ideal for puja ceremonies and elegant daily luxury.',
      priceRange: 'Direct Loom ₹890',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Oxz1jj4Yca3qLJ0MJW3.jpg',
      link: '/shop?category=COTTON+NARAYANPET',
      itemCount: '8+ Weaves',
      bgTag: 'Pure Handloom',
    },
    {
      id: 'surat-pattu',
      title: 'Surat Pattu Silk Sarees',
      category: 'Surat Pattu',
      tagline: 'Lustrous Dual-Tone Silks with Rich Golden Zari Weaving',
      description: 'Rich festive Surat Pattu silk sarees featuring glistening golden zari work, traditional peacock and floral border motifs, and graceful fluid draping.',
      priceRange: '₹730 – ₹870',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OZDgVsJRcjIBxHcybqp.jpg',
      link: '/shop?category=Surat+Pattu',
      itemCount: '11+ Styles',
      bgTag: 'Festive Radiance',
    },
    {
      id: 'surat-pouch',
      title: 'Surat Pouch Silk Sarees',
      category: 'Surat Pouch',
      tagline: 'Soft Silk Sarees in Special Luxury Pouch Packing',
      description: 'Featherlight and smooth soft silk sarees packaged in individual zip pouches. Beloved for gifting during weddings, housewarmings, and everyday celebrations.',
      priceRange: 'Starting from ₹350',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Ox5SbJ78Va4rRaIz45t.jpg',
      link: '/shop?category=Surat+Pouch',
      itemCount: '24+ Varieties',
      bgTag: 'Pouch Special',
    },
    {
      id: 'surat-printed',
      title: 'Surat Printed Sarees',
      category: 'Surat Printed',
      tagline: 'Digital Floral Georgette & Kasturi Crepe Daily Drapes',
      description: 'Super lightweight digital printed sarees in floral, botanical, and geometric patterns on soft chiffon, georgette, and Kasturi crepe for effortless daily elegance.',
      priceRange: 'Wholesale ₹260',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OUEaRa2W-YKrUNH1FUA.jpg',
      link: '/shop?category=Surat+Printed',
      itemCount: '11+ Designs',
      bgTag: 'Everyday Chic',
    },
    {
      id: 'single-colour-offer',
      title: 'Single Colour Wholesale Specials',
      category: 'Single Colour Offer',
      tagline: 'Exclusive Manufacturer Flat 40% Off Bulk Deals',
      description: 'Direct manufacturer wholesale specials on pure single-tone silk sarees. Unbeatable factory rates for bulk wedding orders, resellers, and festive family gifting.',
      priceRange: 'Flat Wholesale ₹1,500',
      image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OdsOBarhJkNk_LvqNyB.jpg',
      link: '/shop?category=Single+Colour+Offer',
      itemCount: '11+ Offers',
      bgTag: 'Flat 40% Off',
    },
  ];

  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] via-[#2E070F] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E8A87C_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none"></div>
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-300" />
            <span>Showroom Catalogues • 11 Weave Categories</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            AUTHENTIC WEAVE COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Direct weaver wholesale collections from Sri Vijaylaxmi Textiles, Rikab Gunj, Hyderabad. 100% Silk Mark Certified pure bridal pattu, Gadwal silks, Banarasi brocades, and festive ghagaras.
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
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"></div>
                  
                  {/* Badge Pills */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#4A0E17] text-[#E8A87C] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#E8A87C]/30 shadow-md">
                      {col.bgTag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      {col.itemCount}
                    </span>
                    <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20">
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
