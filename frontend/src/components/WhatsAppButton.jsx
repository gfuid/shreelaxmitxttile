import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton = ({
  phoneNumber = '919440183000',
  defaultMessage = 'Hello Sri Vijaylaxmi Textiles, I would like to inquire about your saree collection.',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* WhatsApp Trigger Button */}
      <button
        onClick={handleOpenWhatsApp}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-2xl hover:scale-105 transition-all flex items-center justify-center border-2 border-white/80 group cursor-pointer"
        aria-label="Chat with Sri Vijaylaxmi on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Official SVG WhatsApp Logo */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-current drop-shadow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.28 2 2 8.28 2 16C2 18.77 2.76 21.36 4.09 23.59L2.17 29.83L8.56 27.95C10.71 29.21 13.26 29.95 16 29.95C23.72 29.95 30 23.67 30 15.95C30 8.23 23.72 2 16 2ZM23.36 21.43C23.05 22.31 21.84 23.05 20.89 23.25C20.24 23.38 19.39 23.49 16.54 22.31C12.89 20.8 10.55 17.09 10.37 16.85C10.19 16.61 8.89 14.88 8.89 13.09C8.89 11.3 9.8 10.43 10.17 10.05C10.48 9.74 10.99 9.6 11.45 9.6C11.6 9.6 11.74 9.61 11.86 9.62C12.22 9.63 12.4 9.65 12.64 10.22C12.94 10.95 13.67 12.74 13.76 12.92C13.85 13.1 13.94 13.35 13.82 13.59C13.7 13.83 13.6 13.94 13.42 14.15C13.24 14.36 13.07 14.52 12.89 14.74C12.69 14.97 12.47 15.22 12.72 15.65C12.97 16.08 13.83 17.48 15.1 18.61C16.74 20.07 18.07 20.53 18.55 20.73C18.91 20.88 19.34 20.84 19.6 20.56C19.93 20.2 20.34 19.63 20.76 19.04C21.06 18.62 21.43 18.57 21.83 18.72C22.23 18.87 24.36 19.92 24.79 20.13C25.22 20.35 25.51 20.45 25.62 20.64C25.73 20.82 25.73 21.69 25.36 22.43L23.36 21.43Z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-300 rounded-full border-2 border-black animate-ping opacity-75"></span>
      </button>

      {/* Floating Tooltip / Greeting */}
      <div
        onClick={handleOpenWhatsApp}
        className="hidden sm:flex items-center gap-2 bg-[#1C1917]/95 text-emerald-400 text-xs font-bold px-3.5 py-2 rounded-full shadow-2xl border border-emerald-500/40 cursor-pointer hover:border-emerald-400 transition-all animate-in fade-in slide-in-from-bottom-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Need Help? Chat on WhatsApp</span>
      </div>
    </div>
  );
};

export default WhatsAppButton;
