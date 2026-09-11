import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, ShieldCheck, HeartHandshake, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { leadAPI } from '../services/api';
import founderImg from '../assets/mohan_kumar_founder.png';

const HeritageSection = () => {
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.contact) {
      setLoading(true);
      try {
        const isEmail = formData.contact.includes('@');
        await leadAPI.submitInquiry({
          name: formData.name,
          email: isEmail ? formData.contact : '',
          phone: !isEmail ? formData.contact : '',
          topic: 'Festive VIP Voucher Claim',
          message: 'Claimed ₹500 Festive VIP Voucher (Code: FESTIVE500)',
          leadType: 'Festive Voucher',
        });
      } catch (err) {
        console.error('Lead submit error:', err);
      } finally {
        setLoading(false);
        setSubmitted(true);
      }
    }
  };

  return (
    <section id="about-heritage" className="py-14 bg-[#F8F4EE] border-b border-[#E5DDD0]">
      <div className="container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 1. Left Column: ABOUT US Founder Portrait */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-start">
            <h3 className="font-serif text-lg font-bold tracking-[0.1em] text-[#380B12] uppercase mb-3">
              ABOUT US
            </h3>
            
            <div className="w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-[#FAF8F5] relative group">
              <img
                src={founderImg}
                alt="Mohan Kumar - Founder of Sri Vijay Laxmi Textiles (India) Private Limited"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 text-center">
                <p className="text-white text-xs font-bold font-serif">Mohan Kumar</p>
                <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Founder (Since Aug 1994)</p>
              </div>
            </div>
          </div>

          {/* 2. Middle Column: Founder Story & Wholesale Assurances */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border-b border-[#E5DDD0] pb-2">
              <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider block">
                Mohan Kumar • Founder of Sri Vijay Laxmi Textiles
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.05em] text-[#380B12] uppercase">
                SRI VIJAY LAXMI TEXTILES (INDIA) PRIVATE LIMITED
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
              <strong>SRI VIJAY LAXMI TEXTILES (INDIA) PRIVATE LIMITED</strong> has been running for <strong>28+ years since August 1994</strong>. We deal exclusively in <strong>total wholesale and set-to-set wholesale</strong> supplying to big shopping malls, premier bridal showrooms, and household women resellers across India.
            </p>

            <div className="bg-[#FAF5ED] p-4 rounded-2xl border border-[#E8A87C]/50 text-xs text-[#520C17] space-y-1.5 shadow-2xs">
              <span className="font-bold text-sm block text-[#700B1A]">📦 About Our Wholesale Store & Ordering Policy:</span>
              <p className="text-[11.5px] leading-relaxed text-[#736B63]">
                <strong>Please order minimum ₹15,000/-.</strong> Packing charges free. Shipping charge applicable under ₹15,000/- purchase. Packing bundles and freight charges applicable. Please check our authentic reviews and rating in Google!
              </p>
            </div>

            {/* 3 Value Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#E5DDD0] shadow-xs">
                <ShieldCheck size={18} className="text-[#D97706] mx-auto mb-1" />
                <strong className="text-[11px] text-[#380B12] font-bold block">Since 1994</strong>
                <span className="text-[9px] text-gray-400">28+ Yrs Running</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#E5DDD0] shadow-xs">
                <Award size={18} className="text-[#D97706] mx-auto mb-1" />
                <strong className="text-[11px] text-[#380B12] font-bold block">Set-to-Set</strong>
                <span className="text-[9px] text-gray-400">Pure Wholesale</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#E5DDD0] shadow-xs">
                <Sparkles size={18} className="text-[#D97706] mx-auto mb-1" />
                <strong className="text-[11px] text-[#380B12] font-bold block">Direct Rates</strong>
                <span className="text-[9px] text-gray-400">Rikab Gunj, Hyd</span>
              </div>
            </div>
          </div>

          {/* 3. Right Column: VIP Festive Voucher / Newsletter Form matching image.png */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E5DDD0] shadow-md">
            
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1 bg-[#FDF2F4] text-[#4A0E17] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles size={11} className="text-[#D97706]" />
                <span>Festive VIP Circle</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#380B12] leading-tight">
                Unlock Private Festive Offers & Weave Previews
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Enter your details to receive an instant ₹500 welcome voucher.
              </p>
            </div>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                <CheckCircle2 size={28} className="text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-emerald-800">Welcome to Sri Vijaylaxmi Circle!</p>
                <p className="text-[11px] text-emerald-700">Use coupon code <strong className="font-mono text-sm font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">FESTIVE500</strong> for ₹500 off at checkout.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Mobile Number / Email"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-price-pill w-full py-3 text-xs font-black uppercase tracking-wider text-center"
                >
                  CLAIM ₹500 VOUCHER
                </button>
              </form>
            )}

            <p className="text-[10px] text-gray-400 text-center mt-3">
              We respect your privacy. No spam, only authentic saree updates.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeritageSection;
