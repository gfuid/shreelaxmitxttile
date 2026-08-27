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
    { name: 'BANARAS CREAM', path: '/shop?category=Banaras+Wed+Cream' },
    { name: 'FANCY GHAGARA', path: '/shop?category=Fancy+Ghagara' },
    { name: 'BABY GHAGARA', path: '/shop?category=Baby+Ghagara' },
    { name: 'WEDDING GHAGARA', path: '/shop?category=Wedding+Ghagara' },
    { name: 'SURAT POUCH', path: '/shop?category=Surat+Pouch' },
    { name: 'SURAT PRINTED', path: '/shop?category=Surat+Printed' },
    { name: 'SURAT PATTU', path: '/shop?category=Surat+Pattu' },
    { name: 'OFFERS & DEALS', path: '/shop?category=Single+Colour+Offer', isHighlight: true },
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
        className={`bg-[#3A0810] text-[#F5E6D3] text-[11px] px-4 tracking-wide border-b border-[#520C17] transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0 opacity-0 border-none' : 'max-h-12 py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Left: Brand Trust & Wholesale Heritage */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-[#E8A87C]">
              <ShieldCheck size={13} className="text-[#E8A87C]" />
              <span>SRI VIJAY LAXMI TEXTILES</span>
            </span>
            <span className="hidden sm:inline text-amber-200/50">•</span>
            <span className="hidden sm:inline text-amber-100/80 font-medium">Direct Wholesale Manufacturer & Retail Since 1980</span>
            <span className="hidden lg:inline bg-[#5C161D] text-[#E8A87C] px-2 py-0.2 text-[9px] font-bold rounded-full border border-[#E8A87C]/30">
              SILK MARK CERTIFIED
            </span>
          </div>

          {/* Right: Actions, WhatsApp & Support */}
          <div className="flex items-center gap-3 sm:gap-5 text-[11px]">
            <span className="hidden md:inline text-amber-100/70">
              ⚡ Free Insured Shipping Across India
            </span>

            <span className="hidden md:inline text-amber-200/40">|</span>

            <Link to="/track-order" className="hover:text-[#E8A87C] transition-colors flex items-center gap-1">
              <Package size={12} className="text-[#E8A87C]" />
              <span>Track Order</span>
            </Link>

            <span className="hidden sm:inline text-amber-200/40">|</span>

            <a
              href="https://wa.me/919394512326"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Phone size={10} />
              <span>WhatsApp: +91 93945 12326</span>
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

            {/* User Account Button & Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#4A0E17] text-xs font-bold text-[#4A0E17] transition-all shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4A0E17] to-[#D97706] text-white flex items-center justify-center text-[11px] font-black">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={13} className="text-[#736B63]" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4A0E17] hover:bg-[#32070D] text-white text-xs font-bold rounded-full transition-all shadow-xs hover:shadow-md"
                  title="Sign In to Your Account"
                >
                  <User size={14} />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Account Dropdown Menu */}
              {isAuthenticated && accountDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-[#E5DDD0] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-[#EDE5D8] bg-[#FAF7F2]">
                    <span className="text-[9px] text-[#736B63] uppercase tracking-widest font-black">Namaste 🙏</span>
                    <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/orders"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#4A0E17] transition-colors"
                    >
                      <Package size={15} className="text-[#D97706]" />
                      <span className="font-semibold">My Orders & Tracking</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#4A0E17] transition-colors"
                    >
                      <Heart size={15} className="text-[#BE185D]" />
                      <span className="font-semibold">My Wishlist Sarees</span>
                    </Link>

                    <Link
                      to="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-[#FAF7F2] hover:text-[#4A0E17] transition-colors"
                    >
                      <Settings size={15} className="text-gray-500" />
                      <span className="font-semibold">Saved Addresses & Account</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#EDE5D8] my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors font-bold text-left"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 xl:px-6 flex items-center justify-between">
          
          <div className="w-full flex items-center justify-between gap-0.5 xl:gap-1">
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
                    className={`inline-flex items-center gap-0.5 py-2.5 px-1.5 lg:px-1.5 xl:px-2.5 2xl:px-3 text-[10px] lg:text-[10.5px] xl:text-[11px] 2xl:text-[11.5px] font-bold tracking-[0.03em] uppercase transition-all whitespace-nowrap ${
                      item.isHighlight
                        ? 'text-[#FDE68A] hover:text-white font-black'
                        : isActive
                        ? 'text-[#E8A87C]'
                        : 'text-[#F5E6D3] hover:text-[#E8A87C]'
                    }`}
                  >
                    <span>{item.name}</span>
                    {hasMega && (
                      <ChevronDown 
                        size={10} 
                        className={`transition-transform duration-150 opacity-80 ${activeMegaMenu === item.hasMegaMenu ? 'rotate-180 text-[#E8A87C]' : ''}`} 
                      />
                    )}
                  </Link>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#E8A87C]"></div>
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
                  <span>Explore Complete 13-Catalog Store</span>
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
                    to="/shop?category=SINGAL+COLOUR+OFFER"
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
                      Official Sri Vijay Laxmi Saree Catalogues (13 Weaves)
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

              {/* Grid of 13 Catalogues with Visual Photos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                {initialCategories.slice(0, 13).map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setActiveMegaMenu(null)}
                    className="group bg-[#FAF7F2] hover:bg-white rounded-xl border border-[#E5DDD0] hover:border-[#4A0E17] p-2 transition-all flex flex-col items-center text-center shadow-2xs hover:shadow-md"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100 relative">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
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
