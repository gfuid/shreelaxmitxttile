import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, CheckCircle2, Truck, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

const ReturnsPolicyPage = () => {
  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <RotateCcw size={13} className="text-amber-300" />
            <span>Hassle-Free Doorstep Policy</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            7-DAY RETURN & EXCHANGE
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            We want you to drape your Sri Vijaylaxmi saree with absolute delight. Enjoy transparent 7-day doorstep return and replacement assurances.
          </p>
        </div>
      </section>

      {/* Main Policy Content */}
      <section className="py-14">
        <div className="container max-w-4xl space-y-8">
          
          {/* 3 Step Return Process */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5DDD0] shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#380B12] mb-6 pb-3 border-b border-gray-100">
              Simple 3-Step Return Process
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#700B1A] text-white font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h3 className="font-serif text-sm font-bold text-[#380B12]">Request Return</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Log into your account or message our WhatsApp support with your Order Number within 7 days of delivery.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#700B1A] text-white font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h3 className="font-serif text-sm font-bold text-[#380B12]">Doorstep Pickup</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our courier partner will arrange pickup from your address in original packaging with Silk Mark tags attached.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD0] space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#700B1A] text-white font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h3 className="font-serif text-sm font-bold text-[#380B12]">Instant Refund</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Once verified, your 100% refund is initiated immediately to your original payment method or bank account.
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E5DDD0] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <CheckCircle2 size={16} />
                <span>Eligible for Return / Exchange</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
                <li>Unused, unworn sarees in original velvet pouch.</li>
                <li>Silk Mark hologram tag and brand labels intact.</li>
                <li>Any item received with weaving transit defects or incorrect color variant.</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E5DDD0] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                <HelpCircle size={16} />
                <span>Non-Returnable Items</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
                <li>Sarees with custom blouse stitching or customized falls cut to specific non-standard sizing.</li>
                <li>Items requested beyond 7 days of verified delivery.</li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/orders"
              className="btn-price-pill px-6 py-3 text-xs font-bold"
            >
              <span>Manage My Orders</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              to="/contact"
              className="px-5 py-3 rounded-full text-xs font-bold bg-white text-gray-700 hover:text-black border border-[#E5DDD0]"
            >
              Contact Support Team
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ReturnsPolicyPage;
