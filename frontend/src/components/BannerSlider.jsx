import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { bannersApi } from '../services/api';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannersApi.getActive();
        if (res.data && res.data.length > 0) {
          setBanners(res.data);
        }
      } catch (e) {
        console.error('Failed to load banners', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Autoplay interval
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading || banners.length === 0) {
    return (
      <div className="w-full h-80 sm:h-96 md:h-[460px] bg-gradient-to-r from-[#4A0404] to-[#1F0000] animate-pulse flex items-center justify-center text-amber-200">
        <div className="flex items-center gap-2">
          <Sparkles className="animate-spin" />
          <span>Curating Sri Vijaylaxmi Weaves...</span>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#1C1917]">
      <div 
        className="w-full min-h-[360px] sm:min-h-[420px] md:min-h-[480px] flex items-center transition-all duration-700"
        style={{
          background: currentBanner.bgGradient || 'linear-gradient(135deg, #4A0404 0%, #1F0000 100%)',
        }}
      >
        <div className="container py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 text-white space-y-4 sm:space-y-6 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#D97706]/30 border border-[#D97706] text-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <Sparkles size={13} className="text-[#FDE68A]" />
                <span>{currentBanner.badgeText || 'HERITAGE FESTIVE COLLECTION'}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {currentBanner.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light max-w-xl">
                {currentBanner.subtitle || 'Handcrafted pure zari silk sarees directly from the master artisans of Varanasi and Kanchipuram.'}
              </p>

              {/* Discount Tag & CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={currentBanner.link || '/shop'}
                  className="btn btn-gold text-black font-black px-6 py-3 rounded-full text-sm sm:text-base flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={18} />
                </Link>

                <div className="bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-amber-200">
                  {currentBanner.discountText || 'UP TO 50% OFF'}
                </div>
              </div>
            </div>

            {/* Right Image Graphic */}
            <div className="md:col-span-5 flex justify-center items-center">
              <div className="relative w-64 sm:w-80 md:w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-center bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                  <span className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider block">
                    Authentic Handloom Weave
                  </span>
                  <span className="text-xs text-white font-bold">100% Pure Silk Mark Certified</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all z-20 backdrop-blur-sm"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all z-20 backdrop-blur-sm"
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-8 bg-[#D97706]' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
