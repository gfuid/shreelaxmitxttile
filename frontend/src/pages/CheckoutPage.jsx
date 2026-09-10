import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Phone, 
  Award, 
  CheckCircle2, 
  MessageSquare,
  ArrowLeft,
  Lock
} from 'lucide-react';
import SareeLoader from '../components/common/SareeLoader';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    discountAmount,
    totalPrice,
  } = useCart();

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // If cart is empty, redirect or show message
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]">
        <div className="w-16 h-16 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#4A0E17] mb-4 shadow-sm border border-[#E5DDD0]">
          <Sparkles size={28} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Your Saree Bag is Empty
        </h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          Explore our royal bridal drapes, pure Dharmavaram silk, and festive collections to place an order.
        </p>
        <Link
          to="/shop"
          className="btn btn-primary text-xs font-bold py-3 px-6 rounded-full shadow-lg"
        >
          Explore Handloom Sarees →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="container max-w-6xl px-3 sm:px-6">
        
        {/* Checkout Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF4EE] border border-[#E8A87C]/50 text-[#700B1A] text-[11px] font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
            <ShieldCheck size={13} className="text-[#D97706]" />
            <span>Official Sri Vijay Laxmi Order Desk • Zero Login Required</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
            Complete Your Handloom Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl mx-auto">
            Fill your delivery details in the official showroom form below. Your order will be confirmed directly by our Hyderabad master weavers.
          </p>
        </div>

        {/* 2-Column Layout: FlowConnect Form on Left, Order Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left: Official Order Form Embed */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white p-4 sm:p-6 rounded-3xl border-2 border-[#E8A87C]/50 shadow-xl relative overflow-hidden">
            
            {/* Top Form Header Banner */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EDE5D8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF4EE] border border-[#E8A87C]/40 flex items-center justify-center text-[#4A0E17] shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    Direct Showroom Order
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Fast & secure checkout • Our team will confirm your order on WhatsApp
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 size={11} />
                <span>Showroom Verified</span>
              </span>
            </div>

            {/* Saree Loader while form initializes */}
            {(showLoader || !iframeLoaded) && (
              <div className="my-8">
                <SareeLoader
                  size="card"
                  message="Connecting to Sri Vijay Laxmi Showroom..."
                  subtext="Loading secure handloom order form..."
                />
              </div>
            )}

            {/* Embedded FlowConnect Form */}
            <div className={`transition-opacity duration-500 ${!showLoader && iframeLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              <iframe
                src="https://app.flowconnect.ai/form/sri-vijay-laxmi-sarees-textiles-order-query--mtud52ox"
                width="100%"
                height="700"
                frameBorder="0"
                style={{ border: 'none', minHeight: '650px', width: '100%' }}
                title="Sri Vijay Laxmi Sarees & Textiles Order Form"
                className="w-full rounded-2xl bg-white"
                onLoad={() => setIframeLoaded(true)}
              ></iframe>
            </div>

            {/* Bottom Assurance */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Lock size={12} className="text-emerald-600" />
                <span>256-Bit SSL Encrypted & Direct Showroom Booking</span>
              </span>
              <span className="text-[#D97706] font-semibold">
                Rikab Gunj, Hyderabad
              </span>
            </div>

          </div>

          {/* Right: Cart Order Summary & Support */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            
            {/* Order Summary Card */}
            <div className="bg-white p-5 rounded-3xl border border-[#EDE5D8] shadow-md text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-serif text-base font-bold text-gray-900">
                  Order Summary ({cartItems.length} {cartItems.length === 1 ? 'saree' : 'sarees'})
                </h3>
                <Link to="/cart" className="text-[11px] font-bold text-[#700B1A] hover:underline flex items-center gap-0.5">
                  <ArrowLeft size={11} /> Edit Bag
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-100">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-12 h-15 rounded-xl object-cover object-top border border-[#EDE5D8] bg-gray-100 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9.5px] uppercase font-bold text-[#BE185D] block truncate">
                        {item.fabric || 'Pure Silk'}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-gray-900 truncate leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Qty: {item.quantity} • {item.color || 'Royal'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-gray-900 text-xs block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Sarees Subtotal:</span>
                  <span>₹{(Number(itemsPrice) || 0).toLocaleString('en-IN')}</span>
                </div>

                {(Number(discountAmount) || 0) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Direct Wholesale Savings:</span>
                    <span>- ₹{(Number(discountAmount) || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Pan-India Insured Shipping:</span>
                  <span className="text-emerald-700 font-bold uppercase">
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Total Payable:</span>
                  <span className="text-2xl font-black text-[#700B1A]">
                    ₹{(Number(totalPrice) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8A87C]/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A0E17]">
                  <Sparkles size={14} className="text-[#D97706]" />
                  <span>How your order is processed:</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  1. Fill your Name, WhatsApp & Address in the form on the left.
                  <br />
                  2. Our showroom team will message you on WhatsApp to confirm your parcel dispatch & payment preference (COD / UPI).
                </p>
              </div>

            </div>

            {/* Direct WhatsApp Consultation Card */}
            <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] p-4 rounded-3xl border border-emerald-500/40 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageSquare size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-[#065F46] block truncate">
                    Need instant confirmation?
                  </span>
                  <span className="text-[10px] text-gray-600 block truncate">
                    Chat directly with showroom team
                  </span>
                </div>
              </div>

              <a
                href={`https://wa.me/919394512326?text=${encodeURIComponent(`Namaste Sri Vijay Laxmi, I am placing an order for ${cartItems.length} sarees (Total: ₹${totalPrice}). Please assist me.`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1 whitespace-nowrap"
              >
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="p-4 bg-white rounded-3xl border border-[#EDE5D8] space-y-2.5 text-[11px] text-gray-600">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#D97706] shrink-0" />
                <span>100% Silk Mark Certified Pure Mulberry Silk</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#BE185D] shrink-0" />
                <span>Free Insured Doorstep Delivery Across India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-600 shrink-0" />
                <span>Wholesale Desk: +91 93945 12326</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
