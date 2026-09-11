import React from 'react';
import { Truck, PhoneCall, CreditCard, Send, Building2 } from 'lucide-react';

const TrustPerksBar = () => {
  const perks = [
    {
      id: 1,
      icon: Truck,
      title: 'Free Shipping & Packing',
      subtitle: 'Free packing on orders ₹15,000+',
    },
    {
      id: 2,
      icon: PhoneCall,
      title: '24/7 Wholesale Support',
      subtitle: 'Call / WhatsApp: +91 9394512326',
    },
    {
      id: 3,
      icon: CreditCard,
      title: 'Online Payment',
      subtitle: 'Secure UPI, NEFT / RTGS Transfer',
    },
    {
      id: 4,
      icon: Send,
      title: 'Fast Delivery',
      subtitle: 'Pan-India Transport & Parcel Freight',
    },
    {
      id: 5,
      icon: Building2,
      title: 'Set to Set Wholesale',
      subtitle: 'For Malls, Showrooms & Home Resellers',
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
