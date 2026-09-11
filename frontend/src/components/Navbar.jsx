import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  Package, 
  Settings,
  Phone,
  Layers,
  ArrowRight,
  Sparkles,
  Flame,
  ShieldCheck,
  Tag,
  Eye,
  Clock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsApi } from '../services/api';
import { initialCategories } from '../services/initialData';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'all-sarees' | 'catalogues' | null
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const navContainerRef = useRef(null);
  const megaMenuTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  // Rotating announcements for the luxury top bar
  const topAnnouncements = [
    { text: 'FREE PACKING ON ORDERS ABOVE ₹15,000/- • WHOLESALE SET-TO-SET ONLY', highlight: '📦' },
    { text: 'SRI VIJAY LAXMI TEXTILES (INDIA) P LTD • RUNNING 28+ YEARS SINCE AUGUST 1994', highlight: '🏛️' },
    { text: 'SUPPLYING BIG MALLS, SHOWROOMS & LADIES RESELLERS • RIKABGUNJ, HYDERABAD', highlight: '✨' }
  ];
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % 3);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Close all menus & popups on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
    setActiveMegaMenu(null);
    setSearchFocused(false);
    setMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  // Dynamic scroll listener: collapses top banner into ultra-sleek compact mode & closes menus
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (activeMegaMenu) {
        setActiveMegaMenu(null);
      }
      if (accountDropdownOpen) {
        setAccountDropdownOpen(false);
      }
      if (searchFocused) {
        setSearchFocused(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMegaMenu, accountDropdownOpen, searchFocused]);

  // Click outside listener for search, account dropdown, and mega menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (navContainerRef.current && !navContainerRef.current.contains(e.target)) {
        setActiveMegaMenu(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        setAccountDropdownOpen(false);
        setSearchFocused(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Live Predictive Search Debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await productsApi.getAll({ search: searchQuery.trim() });
        if (res && res.data) {
          setSearchResults(res.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Navbar search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setMobileSearchOpen(false);
      setActiveMegaMenu(null);
    }
  };

  const handleTrendingClick = (term) => {
    setSearchQuery(term);
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    setSearchFocused(false);
    setMobileSearchOpen(false);
    setActiveMegaMenu(null);
  };

  const handleMenuMouseEnter = (menuName) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuName);
  };

  const handleMenuMouseLeave = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 100);
  };

  // Trending search suggestions
  const trendingSearches = [
    'Gadwal Pattu',
    'Dharmavaram Bridal',
    'Banarasi Wed Cream',
    'Cotton Narayanpet',
    'Wedding Ghagara',
    'Mau Rich Pallu',
    'Single Colour Offer'
  ];

  // Clean, perfectly proportioned nav links that fit seamlessly across all screens
  const primaryNavLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ALL SAREES', path: '/shop', hasMegaMenu: 'all-sarees' },
    { name: 'DHARMAVARAM', path: '/shop?category=Dharmavaram+Pattu' },
    { name: 'BANARAS SILK', path: '/shop?category=Banaras+Wed+Cream' },
    { name: 'GHAGARAS', path: '/shop?category=Wedding+Ghagara', hasMegaMenu: 'ghagaras' },
    { name: 'SURAT SILKS', path: '/shop?category=Surat+Pattu', hasMegaMenu: 'surat-silks' },
    { name: 'OFFERS & DEALS', path: '/shop?category=Single+Colour+Offer', isHighlight: true },
    { name: 'ORDER QUERY', path: '/order-query', isOrderQuery: true },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  // Exact Saree Weave Groups for the Mega Menu from Data
  const megaMenuWeaveGroups = [
    {
      groupTitle: 'ROYAL HERITAGE WEAVES',
      badge: 'Pure Silk & Zari',
      items: [
        { name: 'Dharmavaram Pattu', cat: 'Dharmavaram Pattu', desc: 'Grand temple border bridal wedding silk drapes', tag: 'Bridal Choice' },
        { name: 'Banaras Wed Cream', cat: 'Banaras Wed Cream', desc: 'Opulent Kadwa jaal cream & gold heritage sarees', tag: 'Heritage' },
        { name: 'Designer Pattu Gadwal', cat: 'Designer Pattu Gadwal', desc: 'Pure Gadwal silk with authentic kuttu zari borders', tag: 'Bestseller' },
        { name: 'COTTON NARAYANPET', cat: 'COTTON NARAYANPET', desc: 'Handloom buta, checks & contrasting temple weave', tag: 'Handloom' },
      ]
    },
    {
      groupTitle: 'GHAGARA & LEHENGA TROUSSEAU',
      badge: 'Festive & Kids',
      items: [
        { name: 'Fancy Ghagara', cat: 'Fancy Ghagara', desc: 'Big size partywear ghagaras with flared resham embroidery', tag: 'Popular' },
        { name: 'Baby Ghagara', cat: 'Baby Ghagara', desc: 'Festive kids and baby ghagara cholis in bright silk hues', tag: 'Kids Special' },
        { name: 'Wedding Ghagara', cat: 'Wedding Ghagara', desc: 'Heavy designer bridal wedding ghagaras with luxury flare', tag: 'Bridal' },
      ]
    },
    {
      groupTitle: 'SURAT SILKS & WHOLESALE DEALS',
      badge: 'Direct Factory Prices',
      items: [
        { name: 'Surat Pouch', cat: 'Surat Pouch', desc: 'Everyday gifting soft silk sarees in luxury pouch packing' },
        { name: 'Surat Printed', cat: 'Surat Printed', desc: 'Lightweight digital printed floral georgette & Kasturi crepe' },
        { name: 'Surat Pattu', cat: 'Surat Pattu', desc: 'Lustrous Surat Pattu silk with golden zari borders' },
        { name: 'Single Colour Offer', cat: 'Single Colour Offer', desc: 'Direct manufacturer wholesale single color specials', tag: 'Flat 40% Off' },
      ]
    }
  ];

  // Visual Product Highlight Cards in Mega Menu
  const megaMenuShowcaseCards = [
    {
      title: 'Bridal Gadwal Pattu',
      category: 'Designer Pattu Gadwal',
      subtitle: 'Pure Mulberry Silk with Kuttu Zari',
      price: '₹4,850',
      mrp: '₹8,500',
      badge: 'Silk Mark Certified',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg',
      link: '/shop?category=Designer+Pattu+Gadwal'
    },
    {
      title: 'Grand Dharmavaram',
      category: 'Dharmavaram Pattu',
      subtitle: 'Heritage Temple Border Bridal Drapes',
      price: '₹6,200',
      mrp: '₹10,500',
      badge: 'Top Rated Bridal',
      image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OQr5R5elEx3F9ZTcwJ0.jpg',
      link: '/shop?category=Dharmavaram+Pattu'
    }
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md font-sans bg-white">
      
      {/* =========================================================================
          TIER 1: ROYAL HERITAGE ANNOUNCEMENT & TRUST TOP BAR (Collapses on scroll)
          ========================================================================= */}
      <div
        className={`bg-[#3A0810] text-[#F5E6D3] text-[11px] px-3 sm:px-6 tracking-wide border-b border-[#520C17] transition-all duration-300 ${
          isScrolled ? 'max-h-0 py-0 opacity-0 border-none overflow-hidden' : 'py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          
          {/* Left: Brand Trust & Wholesale Heritage (Guaranteed Single Line, No Wrap) */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-bold text-[#E8A87C] whitespace-nowrap">
              <ShieldCheck size={13} className="text-[#E8A87C] shrink-0" />
              <span className="tracking-wide">SRI VIJAY LAXMI TEXTILES</span>
            </span>
            <span className="hidden 2xl:inline text-amber-200/50">•</span>
            <span className="hidden 2xl:inline text-amber-100/80 font-medium whitespace-nowrap">
              Wholesale Since August 1994
            </span>
            <span className="hidden sm:inline-flex items-center bg-[#5C161D] text-[#E8A87C] px-2 py-0.5 text-[9px] font-bold rounded-full border border-[#E8A87C]/30 whitespace-nowrap">
              MIN ORDER ₹15,000/-
            </span>
          </div>

          {/* Center: Luxury Rotating Value Proposition (Smooth, Single Line, Never Wraps) */}
          <div className="hidden lg:flex items-center justify-center shrink truncate px-2 overflow-hidden">
            <div className="flex items-center gap-1.5 text-amber-100/90 font-medium text-[11px] whitespace-nowrap truncate animate-in fade-in duration-300">
              <span className="text-[#E8A87C] shrink-0">{topAnnouncements[announcementIdx].highlight}</span>
              <span className="truncate">{topAnnouncements[announcementIdx].text}</span>
            </div>
          </div>

          {/* Right: Actions, WhatsApp & Support (Guaranteed Single Line, No Wrap) */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] shrink-0 whitespace-nowrap">
            
            <Link
              to="/order-query"
              className="hover:text-[#E8A87C] transition-colors flex items-center gap-1 text-amber-200/90 font-medium whitespace-nowrap shrink-0"
              title="Open Direct Order & Lead Form"
            >
              <Sparkles size={12} className="text-[#E8A87C] shrink-0" />
              <span>Order Query</span>
            </Link>

            <span className="text-amber-200/40 hidden md:inline">|</span>

            <Link
              to="/track-order"
              className="hover:text-[#E8A87C] transition-colors hidden md:flex items-center gap-1 whitespace-nowrap shrink-0"
              title="Track Order Status"
            >
              <Package size={12} className="text-[#E8A87C] shrink-0" />
              <span>Track Order</span>
            </Link>

            <span className="text-amber-200/40">|</span>

            <a
              href="https://wa.me/919394512326"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-all whitespace-nowrap shrink-0"
              title="Chat on WhatsApp: +91 93945 12326"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <Phone size={10} className="shrink-0" />
              <span className="hidden xl:inline">WhatsApp:</span>
              <span>+91 93945 12326</span>
            </a>
          </div>

        </div>
      </div>

      {/* =========================================================================
          TIER 2: MAIN BRAND HEADER (Clean Luxury Ivory/White Canvas)
          ========================================================================= */}
      <div
        className={`bg-[#FFFFFF] border-b border-[#E5DDD0] px-4 sm:px-6 relative shadow-xs transition-all duration-300 ${
          isScrolled ? 'py-1.5 sm:py-2' : 'py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Mobile Drawer Button & Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4A0E17] hover:bg-[#FAF4EE] rounded-xl transition-colors border border-[#E5DDD0]"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Brand Logo with Royal Crest */}
            <Link to="/" className="flex items-center gap-2 group py-0.5">
              <div className="relative">
                <img
                  src={logoImg}
                  alt="Sri Vijay Laxmi Textiles (India) P Ltd"
                  className={`w-auto object-contain drop-shadow-sm group-hover:scale-[1.02] transition-all duration-300 ${
                    isScrolled ? 'h-10 sm:h-12' : 'h-13 sm:h-15 md:h-16'
                  }`}
                />
              </div>
              <div className="hidden xl:flex flex-col text-left pl-1 border-l border-[#E5DDD0]">
                <span className="text-[13px] font-black tracking-wider text-[#4A0E17] leading-tight font-serif uppercase">
                  Sri Vijay Laxmi
                </span>
                <span className="text-[9px] font-bold text-[#736B63] tracking-widest uppercase">
                  Textiles (India) P Ltd
                </span>
                <span className="text-[8px] text-[#D97706] font-semibold tracking-wider">
                  Rikab Gunj, Hyderabad
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Smart Predictive Live Search Bar */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl hidden md:block relative z-40">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center w-full bg-[#FAF7F2] border-2 border-[#E5DDD0] focus-within:border-[#4A0E17] focus-within:bg-white rounded-full px-4 py-1.5 transition-all shadow-inner">
                <Search size={16} className="text-[#D97706] shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search pure Gadwal pattu, Dharmavaram bridal, Banarasi silk, Narayanpet..."
                  className="w-full bg-transparent text-xs text-[#1F1916] placeholder:text-[#9E948A] focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-gray-400 hover:text-gray-600 mr-1"
                  >
                    <X size={13} />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#4A0E17] hover:bg-[#32070D] text-white text-[11px] font-bold px-3.5 py-1 rounded-full transition-all shadow-xs shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Smart Search Predictive Popup Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                
                {/* When Query is Empty -> Show Trending & Quick Discover Tags */}
                {!searchQuery.trim() && (
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#736B63] uppercase tracking-wider mb-2.5">
                      <Flame size={14} className="text-[#BE185D]" />
                      <span>Popular Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingSearches.map((term, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleTrendingClick(term)}
                          className="text-xs bg-[#FAF7F2] hover:bg-[#4A0E17] hover:text-white text-[#4A0E17] font-semibold px-3 py-1.5 rounded-full border border-[#E5DDD0] transition-all flex items-center gap-1"
                        >
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EDE5D8] flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Need inspiration?</span>
                      <Link 
                        to="/shop" 
                        onClick={() => {
                          setSearchFocused(false);
                          setActiveMegaMenu(null);
                        }}
                        className="text-[#4A0E17] font-bold hover:underline flex items-center gap-0.5"
                      >
                        Explore All 13 Saree Catalogues <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* When Searching -> Show Live Matching Products */}
                {searchQuery.trim().length >= 2 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-[#EDE5D8] text-[11px] font-semibold text-gray-500">
                      <span>Matching Sarees & Weaves</span>
                      {isSearching && <span className="text-[#D97706] animate-pulse">Searching...</span>}
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-[#F5EFE6]">
                        {searchResults.map((prod) => (
                          <Link
                            key={prod._id}
                            to={`/product/${prod._id}`}
                            onClick={() => {
                              setSearchFocused(false);
                              setActiveMegaMenu(null);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors group"
                          >
                            <img
                              src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'}
                              alt={prod.title}
                              className="w-12 h-14 object-cover rounded-lg border border-[#E5DDD0] shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#4A0E17] transition-colors">
                                {prod.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] bg-[#FAF4EE] text-[#4A0E17] px-1.5 py-0.2 rounded font-semibold border border-[#E5DDD0]">
                                  {prod.fabric || prod.category}
                                </span>
                                {prod.discountPercent > 0 && (
                                  <span className="text-[10px] text-emerald-700 font-bold">
                                    {prod.discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-black text-[#4A0E17]">
                                  ₹{prod.price?.toLocaleString('en-IN')}
                                </span>
                                {prod.originalPrice > prod.price && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    ₹{prod.originalPrice?.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight size={15} className="text-gray-300 group-hover:text-[#4A0E17] group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}

                        <div className="pt-2.5 px-2">
                          <button
                            onClick={handleSearchSubmit}
                            className="w-full text-center py-2 bg-[#FAF4EE] hover:bg-[#4A0E17] text-[#4A0E17] hover:text-white font-bold text-xs rounded-xl transition-all border border-[#E5DDD0]"
                          >
                            View All Search Results for "{searchQuery}" →
                          </button>
                        </div>
                      </div>
                    ) : !isSearching ? (
                      <div className="py-6 text-center text-xs text-gray-500">
                        <p>No sarees found matching "{searchQuery}"</p>
                        <p className="text-[11px] text-gray-400 mt-1">Try searching by weave like 'Gadwal', 'Banarasi', or 'Dharmavaram'</p>
                      </div>
                    ) : null}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Right Action Icons: Mobile Search Toggle, Wishlist, Bag, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-[#4A0E17] hover:bg-[#FAF4EE] rounded-full transition-colors"
              title="Search Sarees"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#4A0E17] hover:text-[#BE185D] hover:bg-[#FAF4EE] rounded-full transition-all group"
              title="Saved Wishlist Sarees"
            >
              <Heart size={21} className="group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4.5 h-4.5 px-1 bg-[#BE185D] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <Link
              to="/cart"
              className="relative p-2 text-[#4A0E17] hover:text-[#D97706] hover:bg-[#FAF4EE] rounded-full transition-all group"
              title="Shopping Cart"
            >
              <ShoppingBag size={21} className="group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4.5 h-4.5 px-1 bg-[#D97706] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Wholesale Order / WhatsApp CTA */}
            <a
              href="https://wa.me/919394512326?text=Hi%20Sri%20Vijay%20Laxmi%20Textiles%2C%20I%20want%20to%20place%20a%20wholesale%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-full transition-all shadow-xs hover:shadow-md"
              title="Order via WhatsApp"
            >
              <Phone size={13} />
              <span className="hidden sm:inline">WhatsApp Order</span>
              <span className="sm:hidden">Order</span>
            </a>

          </div>

        </div>

        {/* Mobile Dropdown Search Input */}
        {mobileSearchOpen && (
          <div className="md:hidden pt-2 pb-1 border-t border-[#EDE5D8] mt-2 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-[#FAF7F2] border border-[#E5DDD0] rounded-full px-3 py-1.5">
                <Search size={15} className="text-[#D97706] mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sarees, weaves, fabrics..."
                  className="w-full bg-transparent text-xs text-gray-800 focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="bg-[#4A0E17] text-white text-xs font-bold px-3.5 py-2 rounded-full"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* =========================================================================
          TIER 3: CATEGORY & VISUAL MEGA-MENU BAR (Heritage Royal Maroon & Gold)
          ========================================================================= */}
      <nav 
        ref={navContainerRef}
        onMouseLeave={handleMenuMouseLeave}
        className="hidden lg:block bg-[#4A0E17] border-b border-[#32070D] select-none relative shadow-md z-30"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          
          <div className="w-full flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
            {primaryNavLinks.map((item, idx) => {
              const isActive = location.pathname + location.search === item.path;
              const hasMega = item.hasMegaMenu;

              return (
                <div
                  key={idx}
                  className="relative shrink-0"
                  onMouseEnter={() => hasMega && handleMenuMouseEnter(item.hasMegaMenu)}
                >
                  <Link
                    to={item.path}
                    onClick={() => setActiveMegaMenu(null)}
                    className={`inline-flex items-center gap-1 py-2.5 px-2 xl:px-3 text-[11px] xl:text-[11.5px] font-bold tracking-[0.03em] uppercase transition-all whitespace-nowrap ${
                      item.isHighlight
                        ? 'text-[#FDE68A] hover:text-white font-black'
                        : item.isOrderQuery
                        ? 'text-amber-200 hover:text-white flex items-center gap-1 bg-[#5C161D]/70 hover:bg-[#5C161D] px-2.5 py-1 rounded-full border border-amber-300/30'
                        : isActive
                        ? 'text-[#E8A87C]'
                        : 'text-[#F5E6D3] hover:text-[#E8A87C]'
                    }`}
                  >
                    {item.isOrderQuery && <Sparkles size={11} className="text-[#E8A87C]" />}
                    <span>{item.name}</span>
                    {hasMega && (
                      <ChevronDown 
                        size={11} 
                        className={`transition-transform duration-150 opacity-80 ${activeMegaMenu === item.hasMegaMenu ? 'rotate-180 text-[#E8A87C]' : ''}`} 
                      />
                    )}
                  </Link>

                  {/* Active Indicator Underline */}
                  {isActive && !item.isOrderQuery && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#E8A87C]"></div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* =========================================================================
            VISUAL MEGA-MENU: ALL SAREES & SILKS (High-Res Photos + Weave Columns)
            ========================================================================= */}
        {activeMegaMenu === 'all-sarees' && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b-2 border-[#4A0E17] shadow-2xl z-50 text-[#1F1916] animate-in fade-in slide-in-from-top-1 duration-100"
            onMouseEnter={() => handleMenuMouseEnter('all-sarees')}
            onMouseLeave={handleMenuMouseLeave}
          >
            <div className="max-w-7xl mx-auto p-6 sm:p-8">
              
              {/* Top Banner inside Mega Menu */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EDE5D8]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#4A0E17] font-bold">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4A0E17] font-serif uppercase tracking-wider">
                      Master Weaver Handloom Collections & Silk Sarees
                    </h4>
                    <p className="text-[11px] text-[#736B63]">
                      Direct factory rates from Rikab Gunj, Hyderabad • 100% Pure Mulberry Silk & Silk Mark Certified
                    </p>
                  </div>
                </div>

                <Link
                  to="/shop"
                  onClick={() => setActiveMegaMenu(null)}
                  className="text-xs font-bold text-[#4A0E17] hover:text-[#D97706] flex items-center gap-1 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#E5DDD0] transition-colors"
                >
                  <span>Explore Complete 11-Catalog Store</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* 4 Column Layout: 3 Weave Groups + 1 Visual Product Showcase Card Column */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* 3 Categories Columns (9 cols) */}
                <div className="col-span-8 grid grid-cols-3 gap-6">
                  {megaMenuWeaveGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DDD0]">
                        <span className="text-[11px] font-black tracking-wider text-[#4A0E17] uppercase">
                          {group.groupTitle}
                        </span>
                        <span className="text-[9px] bg-[#FAF4EE] text-[#D97706] font-bold px-1.5 py-0.2 rounded border border-[#E5DDD0]">
                          {group.badge}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.items.map((item, iIdx) => (
                          <Link
                            key={iIdx}
                            to={`/shop?category=${encodeURIComponent(item.cat)}`}
                            onClick={() => setActiveMegaMenu(null)}
                            className="block p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17] transition-colors">
                                {item.name}
                              </span>
                              {item.tag && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  item.tag === 'Bestseller' 
                                    ? 'bg-amber-100 text-amber-900' 
                                    : item.tag === 'Bridal Choice'
                                    ? 'bg-rose-100 text-rose-900'
                                    : 'bg-emerald-100 text-emerald-900'
                                }`}>
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 1 Visual Product Showcase Column (4 cols) */}
                <div className="col-span-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DDD0] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5DDD0]">
                    <span className="text-[11px] font-black text-[#4A0E17] tracking-wider uppercase flex items-center gap-1.5">
                      <Flame size={13} className="text-[#BE185D]" />
                      <span>Featured Weaver Spotlight</span>
                    </span>
                    <span className="text-[10px] text-[#D97706] font-bold">Wholesale Deals</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {megaMenuShowcaseCards.map((card, cIdx) => (
                      <Link
                        key={cIdx}
                        to={card.link}
                        onClick={() => setActiveMegaMenu(null)}
                        className="group bg-white rounded-xl border border-[#E5DDD0] overflow-hidden hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-1.5 left-1.5 bg-[#4A0E17]/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm">
                            {card.badge}
                          </span>
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17] line-clamp-1">
                              {card.title}
                            </p>
                            <p className="text-[9px] text-gray-500 line-clamp-1 mt-0.5">
                              {card.subtitle}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between pt-1 border-t border-gray-100">
                            <span className="text-xs font-black text-[#4A0E17]">{card.price}</span>
                            <span className="text-[9px] text-[#D97706] font-bold group-hover:translate-x-0.5 transition-transform">
                              Shop →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/shop?category=Single+Colour+Offer"
                    onClick={() => setActiveMegaMenu(null)}
                    className="block text-center py-2 bg-[#4A0E17] hover:bg-[#32070D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    View Factory Wholesale Offers (Flat 40% Off)
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            VISUAL MEGA-MENU: 13 OFFICIAL CATALOGUES (Image Thumbnail Grid)
            ========================================================================= */}
        {activeMegaMenu === 'catalogues' && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b-2 border-[#4A0E17] shadow-2xl z-50 text-[#1F1916] animate-in fade-in slide-in-from-top-1 duration-100"
            onMouseEnter={() => handleMenuMouseEnter('catalogues')}
            onMouseLeave={handleMenuMouseLeave}
          >
            <div className="max-w-7xl mx-auto p-6 sm:p-8">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EDE5D8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#4A0E17] font-bold">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4A0E17] font-serif uppercase tracking-wider">
                      Official Sri Vijay Laxmi Saree Catalogues (11 Weaves)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Explore our complete catalog range manufactured with pure silk, zari, and fine cottons
                    </p>
                  </div>
                </div>

                <Link
                  to="/collections"
                  onClick={() => setActiveMegaMenu(null)}
                  className="text-xs font-bold text-[#4A0E17] hover:underline flex items-center gap-1"
                >
                  View All Collections Page <ChevronRight size={13} />
                </Link>
              </div>

              {/* Grid of 11 Catalogues with Visual Photos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {initialCategories.slice(0, 11).map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setActiveMegaMenu(null)}
                    className="group bg-[#FAF7F2] hover:bg-white rounded-xl border border-[#E5DDD0] hover:border-[#4A0E17] p-2 transition-all flex flex-col items-center text-center shadow-2xs hover:shadow-md"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100 relative">
                      <img
                        src={cat.image || 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg'}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg';
                        }}
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.2 rounded">
                        {cat.itemCount || 15}+ Items
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-900 group-hover:text-[#4A0E17] line-clamp-1 leading-tight">
                      {cat.name}
                    </span>
                    <span className="text-[9px] text-gray-500 line-clamp-1 mt-0.5">
                      Explore Weave →
                    </span>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            DROPDOWN: GHAGARAS & LEHENGAS (Bridal, Partywear, Kids)
            ========================================================================= */}
        {activeMegaMenu === 'ghagaras' && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b-2 border-[#4A0E17] shadow-2xl z-50 text-[#1F1916] animate-in fade-in slide-in-from-top-1 duration-100"
            onMouseEnter={() => handleMenuMouseEnter('ghagaras')}
            onMouseLeave={handleMenuMouseLeave}
          >
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EDE5D8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#4A0E17] font-bold">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4A0E17] font-serif uppercase tracking-wider">
                      Ghagara & Lehenga Trousseau Collection
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Handcrafted bridal, festive, and kids ghagara cholis with grand flared resham & zari borders
                    </p>
                  </div>
                </div>
                <Link
                  to="/shop?category=Wedding+Ghagara"
                  onClick={() => setActiveMegaMenu(null)}
                  className="text-xs font-bold text-[#4A0E17] hover:underline flex items-center gap-1"
                >
                  View All Ghagaras <ChevronRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Link
                  to="/shop?category=Wedding+Ghagara"
                  onClick={() => setActiveMegaMenu(null)}
                  className="group p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#4A0E17] hover:bg-white transition-all flex gap-3.5 items-center shadow-2xs hover:shadow-md"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-[#EDE5D8]">
                    <img
                      src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80"
                      alt="Wedding Ghagara"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="inline-block bg-[#4A0E17] text-[#E8A87C] text-[9px] font-bold px-2 py-0.5 rounded mb-1">Bridal Special</span>
                    <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17]">Wedding Ghagara</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">Heavy designer bridal wedding ghagaras with opulent zari flare</p>
                    <span className="text-[10px] text-[#D97706] font-bold mt-1.5 inline-flex items-center gap-0.5">Explore Collection →</span>
                  </div>
                </Link>

                <Link
                  to="/shop?category=Fancy+Ghagara"
                  onClick={() => setActiveMegaMenu(null)}
                  className="group p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#4A0E17] hover:bg-white transition-all flex gap-3.5 items-center shadow-2xs hover:shadow-md"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-[#EDE5D8]">
                    <img
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80"
                      alt="Fancy Ghagara"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="inline-block bg-[#FAF4EE] text-[#4A0E17] border border-[#E5DDD0] text-[9px] font-bold px-2 py-0.5 rounded mb-1">Partywear</span>
                    <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17]">Fancy Ghagara</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">Big size partywear ghagaras with flared resham embroidery</p>
                    <span className="text-[10px] text-[#D97706] font-bold mt-1.5 inline-flex items-center gap-0.5">Explore Collection →</span>
                  </div>
                </Link>

                <Link
                  to="/shop?category=Baby+Ghagara"
                  onClick={() => setActiveMegaMenu(null)}
                  className="group p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#4A0E17] hover:bg-white transition-all flex gap-3.5 items-center shadow-2xs hover:shadow-md"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-[#EDE5D8]">
                    <img
                      src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80"
                      alt="Baby Ghagara"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="inline-block bg-pink-100 text-pink-700 text-[9px] font-bold px-2 py-0.5 rounded mb-1">Kids Festive</span>
                    <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17]">Baby & Kids Ghagara</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">Festive kids and baby ghagara cholis in radiant silk hues</p>
                    <span className="text-[10px] text-[#D97706] font-bold mt-1.5 inline-flex items-center gap-0.5">Explore Collection →</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            DROPDOWN: SURAT SILKS & FACTORY WHOLESALE DEALS
            ========================================================================= */}
        {activeMegaMenu === 'surat-silks' && (
          <div 
            className="absolute top-full left-0 right-0 bg-white border-b-2 border-[#4A0E17] shadow-2xl z-50 text-[#1F1916] animate-in fade-in slide-in-from-top-1 duration-100"
            onMouseEnter={() => handleMenuMouseEnter('surat-silks')}
            onMouseLeave={handleMenuMouseLeave}
          >
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EDE5D8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#4A0E17] font-bold">
                    <Tag size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4A0E17] font-serif uppercase tracking-wider">
                      Surat Silks & Factory Wholesale Deals
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Direct manufacturer pricing on soft silks, crepe digital prints, and bulk gifting specials
                    </p>
                  </div>
                </div>
                <Link
                  to="/shop?category=Surat+Pattu"
                  onClick={() => setActiveMegaMenu(null)}
                  className="text-xs font-bold text-[#4A0E17] hover:underline flex items-center gap-1"
                >
                  View All Surat Silks <ChevronRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Link
                  to="/shop?category=Surat+Pattu"
                  onClick={() => setActiveMegaMenu(null)}
                  className="group p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#4A0E17] hover:bg-white transition-all flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div>
                    <span className="inline-block bg-[#4A0E17] text-[#E8A87C] text-[8px] font-bold px-1.5 py-0.5 rounded mb-1">Pure Silk Look</span>
                    <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17]">Surat Pattu Silk</h5>
                    <p className="text-[11px] text-gray-500 mt-1">Lustrous silk with intricate golden temple zari borders</p>
                  </div>
                  <span className="text-[10px] text-[#D97706] font-bold mt-2.5 inline-flex items-center gap-0.5">View Sarees →</span>
                </Link>

                <Link
                  to="/shop?category=Surat+Printed"
                  onClick={() => setActiveMegaMenu(null)}
                  className="group p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#4A0E17] hover:bg-white transition-all flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div>
                    <span className="inline-block bg-[#FAF4EE] text-[#4A0E17] border border-[#E5DDD0] text-[8px] font-bold px-1.5 py-0.5 rounded mb-1">Floral & Digital</span>
                    <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17]">Surat Printed Crepe</h5>
                    <p className="text-[11px] text-gray-500 mt-1">Lightweight digital printed georgette & Kasturi crepe</p>
                  </div>
                  <span className="text-[10px] text-[#D97706] font-bold mt-2.5 inline-flex items-center gap-0.5">View Sarees →</span>
                </Link>

                <Link
                  to="/shop?category=Surat+Pouch"
                  onClick={() => setActiveMegaMenu(null)}
                  className="group p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#4A0E17] hover:bg-white transition-all flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div>
                    <span className="inline-block bg-[#FAF4EE] text-[#4A0E17] border border-[#E5DDD0] text-[8px] font-bold px-1.5 py-0.5 rounded mb-1">Gifting Special</span>
                    <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#4A0E17]">Surat Pouch Packing</h5>
                    <p className="text-[11px] text-gray-500 mt-1">Everyday gifting soft silk sarees in luxury pouch box</p>
                  </div>
                  <span className="text-[10px] text-[#D97706] font-bold mt-2.5 inline-flex items-center gap-0.5">View Sarees →</span>
                </Link>

                <Link
                  to="/shop?category=Single+Colour+Offer"
                  onClick={() => setActiveMegaMenu(null)}
                  className="group p-3.5 rounded-xl bg-gradient-to-br from-[#4A0E17] to-[#BE185D] text-white transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <span className="inline-block bg-amber-400 text-black text-[8px] font-black px-1.5 py-0.5 rounded mb-1">Wholesale Flat 40%</span>
                    <h5 className="text-xs font-bold text-white">Single Colour Offer</h5>
                    <p className="text-[11px] text-amber-100/90 mt-1">Direct manufacturer wholesale single color bundle deals</p>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold mt-2.5 inline-flex items-center gap-0.5">Grab Deals →</span>
                </Link>
              </div>
            </div>
          </div>
        )}

      </nav>

      {/* =========================================================================
          TIER 4: MOBILE SLIDING DRAWER MENU (Visual Saree Cards + Quick Navigation)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-5/6 max-w-sm bg-white text-[#1F1916] h-full shadow-2xl flex flex-col border-r border-[#E5DDD0]">
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#EDE5D8] bg-[#FAF7F2]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src={logoImg}
                  alt="Sri Vijay Laxmi Textiles"
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Body */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center bg-[#FAF7F2] border border-[#E5DDD0] rounded-full px-3 py-2">
                  <Search size={15} className="text-[#D97706] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Gadwal, Banarasi, Silk..."
                    className="w-full bg-transparent text-xs focus:outline-none"
                  />
                  <button type="submit" className="text-[10px] bg-[#4A0E17] text-white font-bold px-2 py-0.5 rounded-full">
                    Go
                  </button>
                </div>
              </form>

              {/* Special Wholesale Offer Banner */}
              <Link
                to="/shop?category=SINGAL+COLOUR+OFFER"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#4A0E17] to-[#8B1022] text-white font-bold shadow-md"
              >
                <Flame size={20} className="text-amber-300 shrink-0" />
                <div>
                  <span className="block text-xs text-amber-200">🔥 Wholesale Factory Offers</span>
                  <span className="text-[10px] text-white font-normal">Flat 40% Off on Single Colour Deals</span>
                </div>
              </Link>

              {/* Visual Category Cards Carousel */}
              <div>
                <span className="text-[10px] font-black text-[#736B63] uppercase tracking-wider block mb-2.5">
                  Popular Saree Collections
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {initialCategories.slice(0, 6).map((cat, idx) => (
                    <Link
                      key={idx}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] flex items-center gap-2 hover:bg-white transition-colors"
                    >
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'}
                        alt={cat.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E5DDD0] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-gray-900 truncate">{cat.name}</p>
                        <p className="text-[9px] text-[#D97706] font-semibold">{cat.itemCount || 15}+ items</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* All 13 Saree Catalogue Quick Links */}
              <div>
                <span className="text-[10px] font-black text-[#736B63] uppercase tracking-wider block mb-2">
                  All 13 Official Catalogues
                </span>
                <div className="space-y-1">
                  {initialCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-gray-700 font-semibold hover:text-[#4A0E17] hover:bg-[#FAF7F2] rounded-lg text-xs"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight size={13} className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#EDE5D8] my-2"></div>

              {/* General Pages */}
              <div className="space-y-1">
                <Link
                  to="/order-query"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-800 font-bold bg-[#FAF4EE] text-[#4A0E17] rounded-lg border border-[#E5DDD0]"
                >
                  <Sparkles size={15} className="text-[#D97706]" />
                  <span>Order & Saree Query Form</span>
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-700 font-semibold hover:bg-[#FAF7F2] rounded-lg"
                >
                  <Package size={15} className="text-[#D97706]" />
                  <span>Track My Order</span>
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-700 font-semibold hover:bg-[#FAF7F2] rounded-lg"
                >
                  <ShieldCheck size={15} className="text-gray-500" />
                  <span>About Sri Vijay Laxmi Textiles</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-700 font-semibold hover:bg-[#FAF7F2] rounded-lg"
                >
                  <Compass size={15} className="text-gray-500" />
                  <span>Showroom & Contact</span>
                </Link>
              </div>

            </div>

            {/* Mobile Footer */}
            <div className="border-t border-[#EDE5D8] p-4 bg-[#FAF7F2] text-[11px] text-gray-600">
              <a
                href="https://wa.me/919394512326"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors mb-2"
              >
                <Phone size={14} />
                <span>Direct WhatsApp: +91 93945 12326</span>
              </a>
              <p className="text-center text-[10px] text-gray-500">
                21-1-667/5/B, God Gift Market, Rikab Gunj, Hyderabad
              </p>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
