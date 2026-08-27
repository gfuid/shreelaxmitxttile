import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, ShieldCheck, HeartHandshake, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { leadAPI } from '../services/api';

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
          
          {/* 1. Left Column: ABOUT US Image with Arch Frame matching image.png */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-start">
            <h3 className="font-serif text-lg font-bold tracking-[0.1em] text-[#380B12] uppercase mb-3">
              ABOUT US
            </h3>
            
            <div className="w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-[#E5DDD0] bg-[#FAF8F5]">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                alt="Sri Vijaylaxmi Heritage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 2. Middle Column: COLLECTION HIGHLIGHTS Story & Badges matching image.png */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border-b border-[#E5DDD0] pb-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.08em] text-[#380B12] uppercase">
                HERITAGE WEAVE HIGHLIGHTS
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
              Rooted in the ancient weaving lanes of Varanasi and Kanchipuram, <strong>Sri Vijaylaxmi Sarees</strong> celebrates pure handspun silk, Kadwa zari jaals, and temple Korvai motifs passed down through five generations of master artisans.
            </p>

            <p className="text-xs text-[#736B63] leading-relaxed hidden sm:block">
              Each saree takes between 20 to 40 days of intricate handloom choreography, blending pure metallic threads with mulberry and katan silks for unmatched drape, luster, and longevity.
            </p>

            {/* 3 Star Highlights matching image.png */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E5DDD0] shadow-xs">
                <Star size={18} className="text-[#D97706] fill-[#D97706] mx-auto mb-1" />
                <strong className="text-[11px] text-[#380B12] font-bold block">100% Pure Silk</strong>
                <span className="text-[9px] text-gray-400">Silk Mark Certified</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E5DDD0] shadow-xs">
                <Star size={18} className="text-[#D97706] fill-[#D97706] mx-auto mb-1" />
                <strong className="text-[11px] text-[#380B12] font-bold block">Master Weavers</strong>
                <span className="text-[9px] text-gray-400">Authentic Looms</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E5DDD0] shadow-xs">
                <Star size={18} className="text-[#D97706] fill-[#D97706] mx-auto mb-1" />
                <strong className="text-[11px] text-[#380B12] font-bold block">Direct Pricing</strong>
                <span className="text-[9px] text-gray-400">Zero Middlemen</span>
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
