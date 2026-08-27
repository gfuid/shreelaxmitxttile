import React from 'react';
import { Star, CheckCircle, Sparkles, Heart, Quote } from 'lucide-react';

const CustomerReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Dr. Radhika Sharma',
      city: 'New Delhi',
      rating: 5,
      saree: 'Royal Crimson Banarasi Katan Silk',
      occasion: 'Wedding Day / Muhurtham',
      comment: 'I ordered my bridal Banarasi saree online with a lot of hesitation, but the moment I opened the velvet casing, I was mesmerized! The Kadwa zari work is so delicate and lightweight. Truly royal.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      name: 'Ananya Subramanian',
      city: 'Chennai',
      rating: 5,
      saree: 'Heritage Mustard Gold Kanjivaram',
      occasion: 'Reception & Temple Puja',
      comment: 'The Korvai border and heavy pallu are authentic temple craft. The Silk Mark certification card gave me 100% confidence. Their team even did the fall & pico complimentary before shipping!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      name: 'Meera Chawla',
      city: 'Mumbai',
      rating: 5,
      saree: 'Blush Pink Embroidered Organza',
      occasion: 'Sangeet Night',
      comment: 'The sheer elegance and subtle scalloped border turned heads throughout the party. It draped so effortlessly. Sri Vijaylaxmi has become my go-to luxury saree brand.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const instaPhotos = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      handle: '@priya_v_wedding',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
      handle: '@deepika.festive',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80',
      handle: '@sneha.saree.diaries',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
      handle: '@ananya_trousseau',
    },
  ];

  return (
    <section className="py-14 bg-[#FAF6F0] border-b border-[#E5DDD0]">
      <div className="container">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-[#E5DDD0]">
          <div>
            <div className="flex items-center gap-1.5 text-[#700B1A] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles size={13} className="text-[#D97706]" />
              <span>Connoisseur Voices</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.05em] text-[#380B12] uppercase">
              Loved by 10,000+ Patrons & Brides
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#E5DDD0] shadow-xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#380B12]">
              4.9 / 5.0 Rating
            </span>
            <span className="text-[11px] text-gray-400 border-l border-gray-200 pl-2">
              1,250+ Verified Reviews
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="space-y-3">
                {/* Rating & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle size={11} />
                    <span>Verified Bride</span>
                  </span>
                </div>

                {/* Saree Tag */}
                <div className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E5DDD0] text-[11px] font-medium text-[#700B1A]">
                  Draped: <strong>{rev.saree}</strong>
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#736B63] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-5 pt-4 border-t border-[#F0ECE6] flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5DDD0]"
                />
                <div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-[#380B12]">
                    {rev.name}
                  </h4>
                  <span className="text-[10px] text-gray-400">
                    {rev.city} • {rev.occasion}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Wall / Instagram Strip */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DDD0] shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#380B12] uppercase">
              #SriVijaylaxmiBrides on Instagram
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              Tag <strong className="text-[#700B1A]">@srivijaylaxmisarees</strong> on your celebration to get featured in our royal gallery.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {instaPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-[#E5DDD0]"
              >
                <img
                  src={photo.image}
                  alt="Customer Drape"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[10px] text-white font-medium">
                    {photo.handle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CustomerReviewsSection;
