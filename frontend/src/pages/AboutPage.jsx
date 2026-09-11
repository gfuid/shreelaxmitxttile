import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ShieldCheck, Heart, Users, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import founderImg from '../assets/mohan_kumar_founder.png';

const AboutPage = () => {
  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* 1. Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8A87C_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-300" />
            <span>Sri Vijay Laxmi Textiles • Since August 1994</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            OUR HERITAGE STORY
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            28+ Years of wholesale handloom excellence, supplying premier shopping malls, bridal showrooms, and household resellers across India.
          </p>
        </div>
      </section>

      {/* 2. Brand Legacy Story Grid */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Left: Founder Portrait with Mughal Arched Border */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-t-[140px] rounded-b-3xl overflow-hidden border-4 border-white shadow-2xl bg-[#FAF8F5] relative">
                <img
                  src={founderImg}
                  alt="Mohan Kumar - Founder of Sri Vijay Laxmi Textiles (India) Private Limited"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 text-center">
                  <p className="text-white text-lg font-bold font-serif">Mohan Kumar</p>
                  <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Founder • August 1994</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-2xl shadow-xl border border-[#E5DDD0] text-center max-w-[170px]">
                <span className="font-royal text-2xl font-black text-[#700B1A] block">EST. 1994</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rikabgunj, Hyderabad</span>
              </div>
            </div>

            {/* Right: Narrative */}
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] block">
                  Mohan Kumar • Founder of Sri Vijay Laxmi Textiles
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#380B12] mt-1">
                  SRI VIJAY LAXMI TEXTILES (INDIA) PRIVATE LIMITED
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
                <strong>SRI VIJAY LAXMI TEXTILES (INDIA) PRIVATE LIMITED</strong> has been running for <strong>28+ years since August 1994</strong>. Founded by <strong>Mohan Kumar</strong> in Rikabgunj, Hyderabad, we deal exclusively in <strong>total wholesale and set-to-set wholesale</strong>.
              </p>

              <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
                We supply big shopping malls, big bridal showrooms, and household women resellers who sell in house across India with direct manufacturer wholesale pricing.
              </p>

              <div className="bg-[#FAF5ED] p-4 rounded-2xl border border-[#E8A87C]/50 text-xs text-[#520C17] space-y-1.5 shadow-2xs">
                <span className="font-bold text-sm block text-[#700B1A]">📦 About Our Wholesale Ordering & Packing Policy:</span>
                <p className="text-[11.5px] leading-relaxed text-[#736B63]">
                  <strong>Please order minimum ₹15,000/-.</strong> Packing charges free. Shipping charge applicable under ₹15,000/- purchase. Packing bundles and freight charges applicable. Please check our verified reviews in Google!
                </p>
              </div>

              {/* Core Guarantees List */}
              <div className="space-y-2.5 pt-2 text-xs text-[#380B12]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>Direct Manufacturer Rates:</strong> Zero middlemen, lowest loom-to-showroom pricing.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>Total Set-to-Set Wholesale:</strong> Verified stock for malls, boutiques & resellers.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>30+ Years Trust:</strong> Serving pan-India clients continuously since August 1994.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 4 Pillars of Sri Vijaylaxmi */}
      <section className="py-14 bg-white border-y border-[#E5DDD0]">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-royal text-2xl font-bold text-[#380B12] tracking-wider uppercase">
              The Four Pillars of Our Craft
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              What sets Sri Vijaylaxmi heirlooms apart from mass-produced commercial fabrics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E5DDD0] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center mx-auto shadow-xs">
                <Award size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-[#380B12]">Purity of Thread</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Only Grade-A mulberry silk threads and real metallic electroplated gold zari.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E5DDD0] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#700B1A] flex items-center justify-center mx-auto shadow-xs">
                <Users size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-[#380B12]">Master Artisans</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Hand-woven on traditional pit looms taking up to 30 days of manual choreography.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E5DDD0] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-[#380B12]">Silk Mark Guarantee</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Government hologram tag with registered certification on every dispatch.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E5DDD0] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
                <Heart size={24} />
              </div>
              <h4 className="font-serif text-base font-bold text-[#380B12]">Heirloom Packaging</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Packaged inside breathable muslin velvet cases with custom fall & pico finishing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Varanasi Boutique Invitation */}
      <section className="py-16">
        <div className="container max-w-4xl bg-gradient-to-r from-[#4A0E17] to-[#200408] rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl border-2 border-[#E8A87C]/30 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8A87C] block">
              Experience the Craft Live
            </span>
            <h3 className="font-royal text-2xl sm:text-4xl font-bold leading-tight">
              Visit Our Varanasi Silk Flagship Showroom
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
              Step into the heart of Banaras silk weaving. Touch raw silk skeins, meet master weavers, and browse our private bridal sanctuary.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="btn-price-pill px-6 py-3 text-xs font-bold"
              >
                <span>Explore Saree Collections</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="px-5 py-3 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-colors"
              >
                Contact & Showroom Location
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
