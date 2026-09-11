import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, ShieldCheck, Award } from 'lucide-react';
import logoImg from '../assets/logo.png';
import founderImg from '../assets/mohan_kumar_founder.png';

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
              OUR CATEGORIES
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/shop?category=Ghagara+Full+Size" className="hover:text-[#E8A87C]">Ghagara Full Size</Link></li>
              <li><Link to="/shop?category=Ghagara+Baby+Size" className="hover:text-[#E8A87C]">Ghagara Baby Size</Link></li>
              <li><Link to="/shop?category=Dharmavarm+Pattu" className="hover:text-[#E8A87C]">Dharmavarm Pattu</Link></li>
              <li><Link to="/shop?category=Dharmavarm+Kuttu+Pattu" className="hover:text-[#E8A87C]">Dharmavarm Kuttu Pattu</Link></li>
              <li><Link to="/shop?category=Mau+Pattu+Buta" className="hover:text-[#E8A87C]">Mau Pattu Buta</Link></li>
              <li><Link to="/shop?category=Mau+Rich+Pallu" className="hover:text-[#E8A87C]">Mau Rich Pallu</Link></li>
              <li><Link to="/shop?category=Surat+Print+Sarees" className="hover:text-[#E8A87C]">Surat Print Sarees</Link></li>
              <li><Link to="/shop?category=Surat+Catalogue" className="hover:text-[#E8A87C]">Surat Catalogue</Link></li>
              <li><Link to="/shop?category=Banaras+Fancy+Sarees" className="hover:text-[#E8A87C]">Banaras Fancy Sarees</Link></li>
              <li><Link to="/shop?category=Wedding+Cream+Sarees" className="hover:text-[#E8A87C]">Wedding Cream Sarees</Link></li>
              <li><Link to="/shop?category=Cotton+Chek%2FButa" className="hover:text-[#E8A87C]">Cotton Chek/Buta</Link></li>
              <li><Link to="/shop?category=Narayanpet+Sarees" className="hover:text-[#E8A87C]">Narayanpet Sarees</Link></li>
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
              <li><Link to="/about" className="hover:text-[#E8A87C]">Our Heritage Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#E8A87C]">Contact Us</Link></li>
              <li><a href="https://wa.me/919394512326" target="_blank" rel="noreferrer" className="hover:text-[#E8A87C] text-emerald-400 font-semibold">Direct WhatsApp (+91 9394512326)</a></li>
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
                <span>#21-1-667/B/5, FIRST FLOOR, GOD GIFT MARKET RIKABGUNJ HYDERABAD 500002</span>
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
              Total wholesale and set-to-set wholesale supplier since August 1994. Please order minimum ₹15,000/- for free packing.
            </p>
            <div className="p-3 bg-[#4A0E17] rounded-xl border border-[#5C161D] flex items-center gap-3">
              <img
                src={founderImg}
                alt="Mohan Kumar - Founder"
                className="w-10 h-10 rounded-full object-cover border border-[#E8A87C]/50 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">Mohan Kumar</span>
                <span className="text-[10px] text-[#E8A87C] block truncate">Founder (Since Aug 1994)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} SRI VIJAY LAXMI TEXTILES (INDIA) PRIVATE LIMITED. All Rights Reserved. Rikabgunj, Hyderabad 🇮🇳.
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
