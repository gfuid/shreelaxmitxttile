import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles, Store, Loader2 } from 'lucide-react';
import { leadAPI } from '../services/api';
import SareeLoader from '../components/common/SareeLoader';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Bridal & Trousseau Curation',
    message: '',
  });
  const [activeTab, setActiveTab] = useState('flowconnect');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && (formData.email || formData.phone)) {
      setLoading(true);
      try {
        await leadAPI.submitInquiry({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          topic: formData.topic,
          message: formData.message,
          leadType: 'Inquiry',
        });
      } catch (err) {
        console.error('Submit lead error:', err);
      } finally {
        setLoading(false);
        setSubmitted(true);
      }
    }
  };

  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-300" />
            <span>Patron Support & Consultations</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            GET IN TOUCH
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Our saree specialists and Varanasi boutique stylists are here to assist with custom orders, bridal trousseau curation, and order tracking.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-14">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Contact Cards & Showrooms */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Varanasi Main Boutique */}
              <div className="bg-white p-6 rounded-3xl border border-[#E5DDD0] shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF2F4] text-[#700B1A] flex items-center justify-center font-bold">
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#380B12]">
                      Hyderabad Head Showroom & Office
                    </h3>
                    <span className="text-[11px] text-gray-500">Rikab Gunj, Hyderabad, Telangana</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#700B1A] shrink-0 mt-0.5" />
                    <span>21-1-667/5/B, God Gift Market, First floor, Rikab Gunj, Hyderabad - 500002, Telangana, India</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-[#700B1A] shrink-0" />
                    <span>+91 93945 12326 (Call / WhatsApp)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-[#700B1A] shrink-0" />
                    <span>srivijaylaxmitextiles@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#700B1A] shrink-0" />
                    <span>Mon - Sat: 10:00 AM - 8:30 PM (IST)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/919394512326?text=Hi%20Sri%20Vijay%20Laxmi%20Textiles%2C%20I%20have%20an%20inquiry%20regarding%20saree%20catalogues."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageSquare size={15} />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>
              </div>

              {/* Silk Mark Quality Guarantee Note */}
              <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#E5DDD0] shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-widest block">
                  Authenticity Verification
                </span>
                <h4 className="font-serif text-sm font-bold text-[#380B12]">
                  100% Silk Mark Government Certified
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Every parcel from Sri Vijaylaxmi comes with a tamper-evident holographic Silk Mark Certificate card and velvet heirloom preservation sleeve.
                </p>
              </div>

            </div>

            {/* Right Column: FlowConnect & Direct Inquiry Forms */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DDD0] shadow-md">
              
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD0] mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('flowconnect')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'flowconnect'
                      ? 'bg-[#4A0E17] text-white shadow-sm'
                      : 'text-[#736B63] hover:text-[#4A0E17]'
                  }`}
                >
                  <Sparkles size={13} className={activeTab === 'flowconnect' ? 'text-amber-300' : ''} />
                  <span>Order & Saree Query Form</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('direct')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'direct'
                      ? 'bg-[#4A0E17] text-white shadow-sm'
                      : 'text-[#736B63] hover:text-[#4A0E17]'
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>General Message</span>
                </button>
              </div>

              {activeTab === 'flowconnect' ? (
                <div>
                  <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#380B12]">
                        Instant Order & Saree Query
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Directly synced with our Hyderabad showroom desk.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#FAF4EE] text-[#BE185D] border border-[#E5DDD0] px-2.5 py-1 rounded-full">
                      ⚡ Instant Sync
                    </span>
                  </div>

                  {!iframeLoaded && (
                    <div className="my-4">
                      <SareeLoader
                        size="card"
                        message="Weaving Live Saree Query Desk..."
                        subtext="Connecting with Hyderabad Master Handloom Registry..."
                      />
                    </div>
                  )}

                  <div className={iframeLoaded ? 'block' : 'hidden'}>
                    <iframe
                      src="https://app.flowconnect.ai/form/sri-vijay-laxmi-sarees-textiles-order-query--mtud52ox"
                      width="100%"
                      height="600"
                      frameBorder="0"
                      style={{ border: 'none', minHeight: '600px', width: '100%' }}
                      title="Sri Vijay Laxmi Sarees & Textiles Order Query Form"
                      className="w-full rounded-2xl"
                      onLoad={() => setIframeLoaded(true)}
                    ></iframe>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6 pb-4 border-b border-gray-100">
                    <h3 className="font-serif text-2xl font-bold text-[#380B12]">
                      Send an Inquiry or Consultation Request
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Our silk curators usually reply within 2 to 4 business hours.
                    </p>
                  </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-emerald-900">
                    Inquiry Received!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. A dedicated Sri Vijaylaxmi saree stylist has been assigned to your request and will reach out to <strong>{formData.email}</strong> / <strong>{formData.phone}</strong> shortly.
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', topic: 'Bridal & Trousseau Curation', message: '' });
                      }}
                      className="btn-price-pill px-6 py-2.5 text-xs font-bold"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Radhika Sharma"
                        className="form-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="radhika@gmail.com"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="form-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="form-label">Inquiry Purpose</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="form-select text-xs"
                      >
                        <option>Bridal & Trousseau Curation</option>
                        <option>Custom Handloom Saree Weaving</option>
                        <option>Order Tracking & Delivery Inquiry</option>
                        <option>Bulk Gifting & Wedding Orders</option>
                        <option>Virtual Video Shopping Request</option>
                        <option>General Feedback / Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Your Message or Requirements *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the colors, fabrics, occasion date, or specific weave motifs you are looking for..."
                      className="form-textarea text-xs"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-price-pill w-full py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>SENDING INQUIRY...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>SUBMIT INQUIRY</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
