import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

const FlashDeals = ({ products, onQuickView }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products
    .filter((p) => p.discountPercent >= 45 || p.isTrending || p.isBestSeller)
    .slice(0, 4);

  if (dealProducts.length === 0) return null;

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <section className="py-12 bg-gradient-to-b from-[#FAF8F5] to-white border-b border-[#E8E2D9]">
      <div className="container">
        {/* Deal Header with Live Countdown */}
        <div className="bg-gradient-to-r from-[#700B1A] via-[#881337] to-[#45030C] rounded-2xl p-5 sm:p-7 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-5 border border-amber-500/20">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-black flex items-center justify-center shadow-lg shrink-0">
              <Flame size={28} className="fill-amber-950 text-amber-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                <span>Festival Special Flash Sale</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Deals of the Day — Flat 50% Off
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mr-2">
              <Clock size={16} className="text-[#D97706]" />
              <span className="hidden sm:inline">Ends In:</span>
            </div>

            <div className="flex items-center gap-1.5 text-center">
              <div className="bg-[#700B1A] border border-amber-500/40 rounded-lg px-2.5 py-1 min-w-[36px]">
                <span className="text-base font-black text-amber-200 block">{pad(timeLeft.hours)}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-300 block">Hrs</span>
              </div>
              <span className="text-amber-300 font-bold">:</span>
              <div className="bg-[#700B1A] border border-amber-500/40 rounded-lg px-2.5 py-1 min-w-[36px]">
                <span className="text-base font-black text-amber-200 block">{pad(timeLeft.minutes)}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-300 block">Min</span>
              </div>
              <span className="text-amber-300 font-bold">:</span>
              <div className="bg-[#700B1A] border border-amber-500/40 rounded-lg px-2.5 py-1 min-w-[36px]">
                <span className="text-base font-black text-amber-200 block">{pad(timeLeft.seconds)}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-300 block">Sec</span>
              </div>
            </div>
          </div>

        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/shop?sort=discount"
            className="btn btn-outline font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full inline-flex items-center gap-2"
          >
            <span>View All Discounted Sarees</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
