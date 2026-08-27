import React, { useState } from 'react';
import { Shield, FileText, HelpCircle, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const TermsPrivacyPage = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Are all sarees 100% genuine pure silk with Silk Mark certification?',
      a: 'Yes, every pure silk saree sold by Sri Vijaylaxmi comes with an official Silk Mark Government Hologram Tag and registration card certifying 100% pure silk content.',
    },
    {
      q: 'How long does domestic and international delivery take?',
      a: 'Domestic metro orders across India are delivered within 2–4 business days via insured express couriers (BlueDart / Delhivery). International orders are delivered in 5–8 business days with DHL / FedEx.',
    },
    {
      q: 'Is custom Fall & Pico service really complimentary?',
      a: 'Yes, we provide complimentary ready-to-wear fall, pico, and tassel finishing on all sarees so they are ready to drape straight out of the box at zero additional cost.',
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'We offer a transparent 7-day doorstep return and replacement policy for all unworn sarees in original packaging with tags intact.',
    },
    {
      q: 'How do I book a Live Video Shopping consultation?',
      a: 'You can book a 1-on-1 virtual consultation directly through our website or WhatsApp (+91 98765 43210). Our Varanasi boutique stylists will show you live weaves over HD video call.',
    },
  ];

  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Shield size={13} className="text-amber-300" />
            <span>Transparency & Trust Assurances</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            POLICIES & FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our handloom warranties, data security, and ordering policies.
          </p>
        </div>
      </section>

      {/* Tab Controls */}
      <section className="py-10">
        <div className="container max-w-4xl">
          
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'terms'
                  ? 'bg-[#700B1A] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E5DDD0]'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-[#700B1A] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E5DDD0]'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'faq'
                  ? 'bg-[#700B1A] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E5DDD0]'
              }`}
            >
              Frequently Asked Questions (FAQ)
            </button>
          </div>

          {/* Terms Content */}
          {activeTab === 'terms' && (
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-6 text-xs text-gray-600 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-[#380B12] pb-3 border-b border-gray-100">
                Terms & Handloom Authenticity Warranty
              </h2>

              <div className="space-y-3">
                <h3 className="font-serif text-sm font-bold text-gray-900">1. Handloom Craftsmanship & Slight Color Nuances</h3>
                <p>
                  All our sarees are handwoven by master artisans on traditional pit and shuttle looms. Minor irregularities in weaving, motifs, and zari cuts are hallmarks of genuine handcrafting and should not be considered defects. Product photography colors may vary slightly depending on monitor color calibration.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-sm font-bold text-gray-900">2. Pricing & Currency</h3>
                <p>
                  All listed prices are in Indian Rupees (INR ₹) and are inclusive of applicable GST taxes. We reserve the right to revise prices or discontinue products at any time without prior notice.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-sm font-bold text-gray-900">3. Silk Mark Guarantee</h3>
                <p>
                  We guarantee that sarees labeled as Pure Silk adhere strictly to the Ministry of Textiles Silk Mark Organization of India standards.
                </p>
              </div>
            </div>
          )}

          {/* Privacy Content */}
          {activeTab === 'privacy' && (
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-6 text-xs text-gray-600 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-[#380B12] pb-3 border-b border-gray-100">
                Privacy & Data Security Policy
              </h2>

              <div className="space-y-3">
                <h3 className="font-serif text-sm font-bold text-gray-900">1. Personal Information Collection</h3>
                <p>
                  We only collect necessary details such as your name, shipping address, contact phone, and email address solely for order processing, logistics fulfillment, and customer support.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-sm font-bold text-gray-900">2. Zero Third-Party Data Selling</h3>
                <p>
                  Sri Vijaylaxmi will never sell, rent, or lease your personal data to any external marketing agencies. All communication is strictly confined to your orders and requested updates.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-sm font-bold text-gray-900">3. Secure Payment Gateway</h3>
                <p>
                  All online payments (Cards, UPI, Netbanking) are processed through 256-bit SSL encrypted PCI-DSS compliant payment gateways. We never store credit/debit card numbers or CVVs on our servers.
                </p>
              </div>
            </div>
          )}

          {/* FAQ Content */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#E5DDD0] shadow-xs overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 sm:p-5 text-left font-serif text-sm sm:text-base font-bold text-[#380B12] flex items-center justify-between gap-4"
                  >
                    <span>{f.q}</span>
                    {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default TermsPrivacyPage;
