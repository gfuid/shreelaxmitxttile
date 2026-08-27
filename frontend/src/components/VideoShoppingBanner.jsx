import React, { useState } from 'react';
import { Video, Calendar, Clock, Sparkles, CheckCircle2, X, Phone, MessageSquare } from 'lucide-react';

const VideoShoppingBanner = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: '11:00 AM - 12:00 PM',
    weaveInterest: 'Banarasi Bridal Silk',
    language: 'Hindi / English',
  });

  const handleBooking = (e) => {
    e.preventDefault();
    if (bookingForm.name && bookingForm.phone) {
      setBooked(true);
    }
  };

  return (
    <>
      <section className="py-12 bg-[#380B12] text-white border-b border-[#2C050B] relative overflow-hidden">
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8A87C_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="container relative z-10">
          <div className="bg-gradient-to-r from-[#4A0E17] via-[#380B12] to-[#200408] rounded-3xl p-6 sm:p-10 border-2 border-[#E8A87C]/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Content */}
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <Video size={12} className="text-amber-300" />
                <span>Complimentary Virtual Boutique</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                Live Video Shopping from Varanasi Looms
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Connect 1-on-1 with our master silk stylists via HD Video Call. Inspect pure zari weaves, drape textures, and colors in real-time before placing your order.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-amber-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#E8A87C]" />
                  <span>Zero Consultation Fee</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#E8A87C]" />
                  <span>Real-time Drape & Texture Preview</span>
                </span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => setModalOpen(true)}
                className="btn-price-pill px-6 py-3.5 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
              >
                <Calendar size={15} />
                <span>Schedule Video Call</span>
              </button>

              <a
                href="https://wa.me/919876543210?text=Hi%20Sri%20Vijaylaxmi%2C%20I%20would%20like%20to%20request%20a%20live%20video%20shopping%20session%20for%20sarees."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-colors inline-flex items-center gap-2 border border-emerald-500/40 shadow-sm"
              >
                <MessageSquare size={15} />
                <span>WhatsApp Instant Assist</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Video Shopping Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#E8A87C]/50 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setModalOpen(false);
                setBooked(false);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs"
            >
              <X size={18} />
            </button>

            {booked ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#380B12]">
                  Consultation Scheduled!
                </h3>
                <p className="text-xs text-[#736B63] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{bookingForm.name}</strong>. Our senior saree stylist will reach out on WhatsApp at <strong>{bookingForm.phone}</strong> for your session on <strong>{bookingForm.date || 'the requested slot'}</strong> ({bookingForm.timeSlot}).
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setBooked(false);
                    }}
                    className="btn-price-pill px-6 py-2.5 text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="text-center mb-2">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest block">
                    1-on-1 Virtual Experience
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#380B12]">
                    Book Live Saree Consultation
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Select your convenient time and preferred weave category.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#380B12] block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#380B12] block mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#380B12] block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#380B12] block mb-1">Preferred Time Slot</label>
                    <select
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                    >
                      <option>11:00 AM - 12:00 PM</option>
                      <option>01:00 PM - 02:00 PM</option>
                      <option>04:00 PM - 05:00 PM</option>
                      <option>06:00 PM - 07:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#380B12] block mb-1">Weave Interest</label>
                    <select
                      value={bookingForm.weaveInterest}
                      onChange={(e) => setBookingForm({ ...bookingForm, weaveInterest: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                    >
                      <option>Banarasi Bridal Silk</option>
                      <option>Kanjivaram Temple Silk</option>
                      <option>Pastel Floral Organza</option>
                      <option>Georgette & Shimmer</option>
                      <option>Trousseau Curation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#380B12] block mb-1">Language</label>
                    <select
                      value={bookingForm.language}
                      onChange={(e) => setBookingForm({ ...bookingForm, language: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                    >
                      <option>Hindi / English</option>
                      <option>Tamil / English</option>
                      <option>Telugu / English</option>
                      <option>Bengali / Hindi</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-price-pill w-full py-3 text-xs font-black uppercase tracking-wider text-center"
                  >
                    CONFIRM LIVE CONSULTATION
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default VideoShoppingBanner;
