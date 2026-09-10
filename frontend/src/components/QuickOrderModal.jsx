import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Phone } from 'lucide-react';
import SareeLoader from './common/SareeLoader';

const QuickOrderModal = ({ product, isOpen, onClose }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 950);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col border-2 border-[#E8A87C]/60 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#380B12] via-[#4A0E17] to-[#200408] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#E8A87C]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8A87C]/20 border border-[#E8A87C]/40 flex items-center justify-center text-[#E8A87C]">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-royal text-sm sm:text-base font-bold text-white tracking-wider">
                  DIRECT ORDER & INQUIRY
                </h3>
                <span className="hidden sm:inline bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Instant Confirmation
                </span>
              </div>
              <p className="text-[11px] text-amber-100/70">
                Fill your delivery details below to confirm order directly with our showroom team.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Product Pill if provided */}
        {product && (
          <div className="bg-[#FAF7F2] px-4 py-2.5 border-b border-[#E5DDD0] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-9 h-11 object-cover rounded border border-[#E5DDD0] shrink-0"
                />
              )}
              <div className="min-w-0">
                <span className="font-bold text-[#380B12] block truncate text-xs">
                  {product.title}
                </span>
                <span className="text-[10px] text-gray-500">
                  {product.fabric || 'Pure Handloom Silk'} • {product.category || 'Authentic Weave'}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0 pl-3">
              <span className="text-xs font-black text-[#4A0E17] block">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-emerald-700 font-bold">Free Insured Delivery</span>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 relative bg-[#FAF9F6]">
          
          {/* Saree Loader while opening/connecting */}
          {(showLoader || !iframeLoaded) && (
            <div className="my-2">
              <SareeLoader
                size="card"
                message="Loading Sri Vijay Laxmi Order Desk..."
                subtext="Connecting with Hyderabad Master Handloom Registry..."
              />
            </div>
          )}

          {/* Embedded FlowConnect Order Form */}
          <div className={`transition-opacity duration-500 ${!showLoader && iframeLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <iframe
              src="https://app.flowconnect.ai/form/sri-vijay-laxmi-sarees-textiles-order-query--mtud52ox"
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: 'none', minHeight: '600px', width: '100%' }}
              title="Sri Vijay Laxmi Sarees & Textiles Order Query Form"
              className="w-full rounded-2xl bg-white"
              onLoad={() => setIframeLoaded(true)}
            ></iframe>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="mt-4 pt-3 border-t border-[#EDE5D8] flex items-center justify-between text-xs text-gray-600 bg-white p-3 rounded-xl">
            <span className="text-[11px]">Need urgent delivery or video call on WhatsApp?</span>
            <a
              href="https://wa.me/919394512326?text=Hi%20Sri%20Vijay%20Laxmi%20Textiles%2C%20I%20want%20to%20order%20directly."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-xs"
            >
              <Phone size={12} />
              <span>WhatsApp Us</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default QuickOrderModal;
