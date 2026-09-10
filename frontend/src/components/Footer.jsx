import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, ShieldCheck, Award } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer id="contact-us" className="bg-[#380B12] text-gray-300 pt-12 pb-6 border-t border-[#4A0E17]">
      <div className="container">
        
        {/* 5 Columns Layout matching image.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#4A0E17]">
          
          {/* Column 1: Brand & Heritage */}
          <div className="space-y-3">
            <Link to="/" className="inline-block">
              <img
                src={logoImg}
                alt="Sri Vijay Laxmi Textiles (India) P Ltd"
                className="h-12 w-auto object-contain drop-shadow"
              />
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Sri Vijay Laxmi Textiles (India) P Ltd</strong> — Direct manufacturer, wholesaler & retailer of authentic handloom silk sarees, Gadwal pattu, Dharmavaram, and wedding ghagaras.
            </p>
            <div className="flex items-center gap-2.5 pt-2 text-[#E8A87C]">
              {/* WhatsApp */}
              <a href="https://wa.me/919394512326" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-[#4A0E17] flex items-center justify-center hover:bg-[#E8A87C] hover:text-black transition-colors" aria-label="WhatsApp">
                <Phone size={13} />
              </a>
              {/* Email */}
              <a href="mailto:srivijaylaxmitextiles@gmail.com" className="w-7 h-7 rounded-full bg-[#4A0E17] flex items-center justify-center hover:bg-[#E8A87C] hover:text-black transition-colors" aria-label="Email">
                <Mail size={13} />
              </a>
            </div>
          </div>

          {/* Column 2: Saree Catalogues */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-3 text-[#E8A87C]">
              OFFICIAL CATALOGUES
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=Designer+Pattu+Gadwal" className="hover:text-[#E8A87C]">Designer Pattu Gadwal</Link></li>
              <li><Link to="/shop?category=Dharmavaram+Pattu" className="hover:text-[#E8A87C]">Dharmavaram Pattu</Link></li>
              <li><Link to="/shop?category=Banaras+Wed+Cream" className="hover:text-[#E8A87C]">Banaras Wed Cream</Link></li>
              <li><Link to="/shop?category=COTTON+NARAYANPET" className="hover:text-[#E8A87C]">Cotton Narayanpet</Link></li>
              <li><Link to="/shop?category=Wedding+Ghagara" className="hover:text-[#E8A87C]">Wedding Ghagara</Link></li>
              <li><Link to="/shop?category=Mau+Rich+pallu" className="hover:text-[#E8A87C]">Mau Rich Pallu</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Guides */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-3 text-[#E8A87C]">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/order-query" className="hover:text-[#E8A87C] text-amber-200/90 font-medium flex items-center gap-1"><span>Order & Saree Query</span> <span className="text-[9px] bg-[#5C161D] text-[#E8A87C] px-1.5 py-0.5 rounded-full">New</span></Link></li>
              <li><Link to="/track-order" className="hover:text-[#E8A87C]">Track Order Live</Link></li>
              <li><Link to="/returns" className="hover:text-[#E8A87C]">7-Day Return Policy</Link></li>
              <li><Link to="/silk-care" className="hover:text-[#E8A87C]">Silk Care & Burn Test</Link></li>
              <li><Link to="/about" className="hover:text-[#E8A87C]">Our Heritage Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#E8A87C]">Contact Us</Link></li>
              <li><Link to="/shop?category=SINGAL+COLOUR+OFFER" className="hover:text-[#E8A87C]">Single Colour Offers</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Showroom */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-3 text-[#E8A87C]">
              HEAD SHOWROOM
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#E8A87C] shrink-0 mt-0.5" />
                <span>21-1-667/5/B, God Gift Market, First floor, Rikab Gunj, Hyderabad - 500002, Telangana, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#E8A87C] shrink-0" />
                <span>+91 93945 12326</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#E8A87C] shrink-0" />
                <span>srivijaylaxmitextiles@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Column 5: Trust Assurance */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-3 text-[#E8A87C]">
              CERTIFIED QUALITY
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Wholesale manufacturer direct pricing with genuine Silk Mark quality assurances and fast pan-India delivery.
            </p>
            <div className="p-3 bg-[#4A0E17] rounded-xl border border-[#5C161D] text-center">
              <span className="text-[11px] font-bold text-white block">100% Genuine Handlooms</span>
              <span className="text-[10px] text-[#E8A87C]">Mohan Kumar Agrawal (Director)</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} SRI VIJAY LAXMI TEXTILES (INDIA) P LTD. All Rights Reserved. Hyderabad, Telangana 🇮🇳.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
