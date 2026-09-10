import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, MessageSquare, ShieldCheck, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SareeLoader from '../components/common/SareeLoader';

const OrderQueryPage = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-14 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E8A87C]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#E8A87C]/10 blur-3xl pointer-events-none"></div>

        <div className="container max-w-4xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-300" />
            <span>Sri Vijay Laxmi Sarees & Textiles</span>
          </div>

          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            ORDER & PRODUCT QUERY
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a question about a saree, custom bridal weave, bulk wholesale order, or tracking your delivery? 
            Fill in the details below and our Hyderabad showroom specialists will connect with you directly.
          </p>

          {/* Quick Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-[#E8A87C]">
            <span className="flex items-center gap-1.5 bg-[#4A0E17]/60 border border-[#E8A87C]/30 px-3 py-1 rounded-full">
              <ShieldCheck size={14} />
              <span>100% Pure Silk Mark Certified</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#4A0E17]/60 border border-[#E8A87C]/30 px-3 py-1 rounded-full">
              <Clock size={14} />
              <span>Quick Response within 2-4 Hours</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#4A0E17]/60 border border-[#E8A87C]/30 px-3 py-1 rounded-full">
              <Phone size={14} />
              <span>WhatsApp: +91 93945 12326</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="container max-w-4xl mx-auto">
          {/* Back link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4A0E17] hover:text-[#BE185D] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Saree Catalogues</span>
            </Link>

            <Link
              to="/contact"
              className="text-xs text-gray-500 hover:text-[#4A0E17] transition-colors"
            >
              Visit Showroom & Office Info →
            </Link>
          </div>

          {/* Card Container for Iframe */}
          <div className="bg-white rounded-3xl border border-[#E5DDD0] shadow-xl overflow-hidden p-3 sm:p-6 md:p-8 relative">
            
            {/* Header inside card */}
            <div className="border-b border-[#E5DDD0] pb-4 mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#380B12]">
                Submit Your Query or Request
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Please provide your contact information and query details so our curators can assist you with pricing, availability, or photos.
              </p>
            </div>

            {/* Custom Royal Saree Weaving Loader while iframe is loading */}
            {(showLoader || !iframeLoaded) && (
              <div className="my-6">
                <SareeLoader
                  size="card"
                  message="Weaving Your Sri Vijay Laxmi Order Desk..."
                  subtext="Connecting with Hyderabad Master Handloom Registry..."
                />
              </div>
            )}

            {/* FlowConnect Iframe */}
            <div className={`transition-opacity duration-500 ${!showLoader && iframeLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              <iframe
                src="https://app.flowconnect.ai/form/sri-vijay-laxmi-sarees-textiles-order-query--mtud52ox"
                width="100%"
                height="650"
                frameBorder="0"
                style={{ border: 'none', minHeight: '650px', width: '100%' }}
                title="Sri Vijay Laxmi Sarees & Textiles Order Query Form"
                className="w-full rounded-2xl"
                onLoad={() => setIframeLoaded(true)}
              ></iframe>
            </div>

            {/* Direct WhatsApp Alternative Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 bg-[#FAF7F2] p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-600 shrink-0" />
                <span>Prefer to chat on WhatsApp directly with our saree specialist?</span>
              </div>
              <a
                href="https://wa.me/919394512326?text=Hi%20Sri%20Vijay%20Laxmi%20Textiles%2C%20I%20have%20an%20order%20query."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
              >
                <Phone size={13} />
                <span>WhatsApp Now</span>
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderQueryPage;
