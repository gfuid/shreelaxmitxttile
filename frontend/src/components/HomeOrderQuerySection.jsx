import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Clock, Phone, MessageSquare, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SareeLoader from './common/SareeLoader';

const HomeOrderQuerySection = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <section id="order-form-section" className="py-20 bg-gradient-to-b from-[#FAF4EE] via-[#F3ECE0] to-[#FAF4EE] relative overflow-hidden border-t-2 border-b-2 border-[#E5DDD0]">
      {/* Decorative floral & royal arch subtle glows */}
      <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-[#E8A87C]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-[#380B12]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container max-w-5xl relative z-10 px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-[#3A0810] border border-[#E8A87C]/50 text-[#F5E6D3] px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-md">
            <Sparkles size={13} className="text-amber-300" />
            <span>Direct Manufacturer Ordering Desk</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <h2 className="font-royal text-2xl sm:text-4xl lg:text-5xl font-black text-[#380B12] tracking-wider leading-tight">
            ORDER & CUSTOM SAREE QUERY
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed font-serif">
            Direct wholesale prices from Rikab Gunj, Hyderabad. Fill out this form for immediate catalog availability, custom bridal trousseau weaving, or pan-India bulk order dispatch.
          </p>

          {/* Luxury Heritage Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-[11px] text-[#4A0E17] font-semibold">
            <span className="flex items-center gap-1.5 bg-white/90 border border-[#E5DDD0] px-3.5 py-1.5 rounded-full shadow-xs">
              <Award size={15} className="text-[#D97706]" />
              <span>100% Pure Silk Mark Certified</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 border border-[#E5DDD0] px-3.5 py-1.5 rounded-full shadow-xs">
              <Clock size={15} className="text-[#BE185D]" />
              <span>Response in 2 to 4 Business Hours</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 border border-[#E5DDD0] px-3.5 py-1.5 rounded-full shadow-xs">
              <Phone size={15} className="text-emerald-700" />
              <span>Direct WhatsApp Desk: +91 93945 12326</span>
            </span>
          </div>
        </div>

        {/* Form Container Card with Royal Filigree Accents */}
        <div className="bg-white rounded-3xl border-2 border-[#E5DDD0] shadow-2xl overflow-hidden p-4 sm:p-8 relative">
          
          {/* Ornate Gold Corner Accent Indicators */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#E8A87C] rounded-tl-lg pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#E8A87C] rounded-tr-lg pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#E8A87C] rounded-bl-lg pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#E8A87C] rounded-br-lg pointer-events-none"></div>

          {/* Header inside Form Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#EDE5D8] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#380B12]">
                  Sri Vijay Laxmi Sarees & Textiles — Live Booking Portal
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Every submission is securely routed into our dispatch manager's order dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold bg-[#FAF4EE] text-[#BE185D] px-2.5 py-1 rounded-full border border-[#E5DDD0]">
                ⚡ Verified Handloom Channel
              </span>
              <Link
                to="/order-query"
                className="text-xs font-bold text-[#4A0E17] hover:text-[#BE185D] flex items-center gap-1 transition-colors"
              >
                <span>Full Page View</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Custom Royal Saree Weaving Loader while Iframe loads */}
          {!iframeLoaded && (
            <div className="my-6">
              <SareeLoader
                size="card"
                message="Weaving Your Sri Vijay Laxmi Order Desk..."
                subtext="Connecting with Hyderabad Master Handloom Registry..."
              />
            </div>
          )}

          {/* Embedded FlowConnect Iframe */}
          <div className={`transition-opacity duration-500 ${iframeLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <iframe
              src="https://app.flowconnect.ai/form/sri-vijay-laxmi-sarees-textiles-order-new"
              name="lovable-form-sri-vijay-laxmi-sarees-textiles-order-new"
              width="100%"
              height="650"
              frameBorder="0"
              style={{ border: 'none', minHeight: '600px', width: '100%' }}
              title="Sri Vijay Laxmi Sarees & Textiles Order Form"
              className="w-full rounded-2xl"
              loading="lazy"
              onLoad={() => setIframeLoaded(true)}
            ></iframe>
          </div>

          {/* Bottom WhatsApp Alternative Support Strip */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8]">
            <div className="flex items-center gap-2.5 text-gray-700">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageSquare size={16} />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Prefer Direct WhatsApp Conversation?</span>
                <span className="text-[11px] text-gray-500">Share catalog photos or video call directly with our saree stylist.</span>
              </div>
            </div>
            <a
              href="https://wa.me/919394512326?text=Hi%20Sri%20Vijay%20Laxmi%20Textiles%2C%20I%20want%20to%20place%20an%20order%20or%20inquire%20about%20sarees."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
            >
              <Phone size={13} />
              <span>WhatsApp Showroom Now</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HomeOrderQuerySection;
