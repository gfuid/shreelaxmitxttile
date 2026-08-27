import React from 'react';
import { Award, Truck, Scissors, RotateCcw, Video } from 'lucide-react';

const TrustPerksBar = () => {
  const perks = [
    {
      id: 1,
      icon: Award,
      title: '100% Pure Silk Mark',
      subtitle: 'Government Hologram Certified',
    },
    {
      id: 2,
      icon: Truck,
      title: 'Free Express Shipping',
      subtitle: 'Pan-India in 2-4 Days & Global',
    },
    {
      id: 3,
      icon: Scissors,
      title: 'Complimentary Fall & Pico',
      subtitle: 'Ready to Drape on Delivery',
    },
    {
      id: 4,
      icon: RotateCcw,
      title: 'Hassle-Free 7-Day Returns',
      subtitle: 'Doorstep Pickup & Easy Exchange',
    },
    {
      id: 5,
      icon: Video,
      title: 'Live Video Shopping',
      subtitle: '1-on-1 Stylist Consultation',
    },
  ];

  return (
    <section className="bg-white border-y border-[#E5DDD0] py-6 relative shadow-xs">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.id}
                className="flex items-center gap-3.5 px-2 sm:px-3 py-2 group transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FDF7F2] border border-[#E8A87C]/40 flex items-center justify-center text-[#700B1A] group-hover:bg-[#700B1A] group-hover:text-[#E8A87C] group-hover:scale-110 transition-all duration-300 shrink-0 shadow-xs">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-[#380B12] leading-tight group-hover:text-[#700B1A] transition-colors line-clamp-1">
                    {perk.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#736B63] mt-0.5 leading-snug line-clamp-1">
                    {perk.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustPerksBar;
