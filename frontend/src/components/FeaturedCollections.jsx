import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Tag, Layers, ChevronRight } from 'lucide-react';
import { categoriesApi } from '../services/api';
import { initialCategories } from '../services/initialData';

const FeaturedCollections = ({ products = [], loading = false }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoriesApi.getAll();
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          setCategories(initialCategories);
        }
      } catch (e) {
        setCategories(initialCategories);
      }
    };
    fetchCats();
  }, []);

  // Category showcase list: Each item represents ONE category with its best hero product & details
  const showcaseList = React.useMemo(() => {
    const sourceCats = categories.length > 0 ? categories : initialCategories;

    // Price mapping dictionary for exact live categories
    const priceMap = {
      'Ghagara Full Size': { price: 'Starting ₹1,028', tag: 'Partywear Flared', count: '18+ Sets' },
      'Ghagara Baby Size': { price: 'Festive ₹699', tag: 'Kids Festive', count: '12+ Styles' },
      'Dharmavarm Pattu': { price: 'Silk Mark ₹1,500', tag: 'Pure Mulberry Silk', count: '16+ Weaves' },
      'Dharmavarm Kuttu Pattu': { price: 'Direct Loom ₹1,500', tag: 'Authentic Kuttu', count: '14+ Weaves' },
      'Mau Pattu Buta': { price: 'Special ₹705', tag: 'Bestseller Special', count: '12+ Styles' },
      'Mau Rich Pallu': { price: 'Starting ₹1,250', tag: 'Grand Rich Pallu', count: '8+ Styles' },
      'Surat Print Sarees': { price: 'Wholesale ₹260', tag: 'Daily Elegance', count: '15+ Designs' },
      'Surat Catalogue': { price: 'Starting ₹350', tag: 'Luxury Pouch Pack', count: '24+ Varieties' },
      'Banaras Fancy Sarees': { price: 'Starting ₹1,110', tag: 'Heritage Brocade', count: '11+ Weaves' },
      'Wedding Cream Sarees': { price: 'Starting ₹1,130', tag: 'Bridal Muhurtham', count: '14+ Weaves' },
      'Cotton Chek/Buta': { price: 'Wholesale ₹999', tag: 'Breathable Cotton', count: '12+ Styles' },
      'Narayanpet Sarees': { price: 'Direct Loom ₹890', tag: '100% Handloom', count: '10+ Weaves' },
    };

    return sourceCats.map((cat) => {
      // Find a matching product from products array if available
      const matchingProduct = products.find(
        (p) =>
          p.category &&
          (p.category.toLowerCase() === cat.name.toLowerCase() ||
            p.category.toLowerCase().includes(cat.name.toLowerCase()) ||
            cat.name.toLowerCase().includes(p.category.toLowerCase()))
      );

      const info = priceMap[cat.name] || {
        price: matchingProduct ? `₹${matchingProduct.price}` : 'Wholesale Rates',
        tag: 'Authentic Weave',
        count: cat.itemCount ? `${cat.itemCount}+ Styles` : 'Explore',
      };

      const heroImage = matchingProduct?.images?.[0] || cat.image;

      return {
        id: cat._id || cat.slug,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: heroImage,
        price: info.price,
        tag: info.tag,
        count: info.count,
        description: cat.description || `Browse authentic ${cat.name} handcrafted wholesale collection.`,
        link: `/shop?category=${encodeURIComponent(cat.name)}`,
      };
    });
  }, [categories, products]);

  // Tab Filtering matching live catalog collections
  const filteredList = React.useMemo(() => {
    if (activeTab === 'ghagara') {
      return showcaseList.filter((c) =>
        ['Ghagara Full Size', 'Ghagara Baby Size'].includes(c.name)
      );
    }
    if (activeTab === 'pattu') {
      return showcaseList.filter((c) =>
        ['Dharmavarm Pattu', 'Dharmavarm Kuttu Pattu', 'Mau Pattu Buta', 'Mau Rich Pallu', 'Banaras Fancy Sarees', 'Wedding Cream Sarees'].includes(c.name)
      );
    }
    if (activeTab === 'cotton') {
      return showcaseList.filter((c) =>
        ['Cotton Chek/Buta', 'Narayanpet Sarees', 'Surat Print Sarees', 'Surat Catalogue'].includes(c.name)
      );
    }
    return showcaseList;
  }, [showcaseList, activeTab]);

  return (
    <section className="py-8 sm:py-14 bg-[#F8F4EE] border-b border-[#E5DDD0]">
      <div className="container max-w-7xl px-3 sm:px-6">
        
        {/* Section Header Matching srivijaylaxmitextile.com */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 pb-4 border-b border-[#E5DDD0] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#700B1A] text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles size={14} className="text-[#D97706]" />
              <span>Sri Vijay Laxmi Textiles • Direct Loom Wholesale Since 1994</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-wide text-[#380B12] uppercase">
              OUR CATEGORIES
            </h2>
            <p className="text-xs sm:text-sm text-[#736B63] mt-1 font-medium">
              Manufacturer Rate – Latest Designs, Best Quality • Rikab Gunj, Hyderabad
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#4A0E17] text-[#F5E6D3] shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-[#F2ECE1] border border-[#E5DDD0]'
              }`}
            >
              All Categories ({showcaseList.length})
            </button>
            <button
              onClick={() => setActiveTab('pattu')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'pattu'
                  ? 'bg-[#4A0E17] text-[#F5E6D3] shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-[#F2ECE1] border border-[#E5DDD0]'
              }`}
            >
              👑 Pattu & Silk Sarees
            </button>
            <button
              onClick={() => setActiveTab('ghagara')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'ghagara'
                  ? 'bg-[#4A0E17] text-[#F5E6D3] shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-[#F2ECE1] border border-[#E5DDD0]'
              }`}
            >
              ✨ Ghagaras & Lehengas
            </button>
            <button
              onClick={() => setActiveTab('cotton')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'cotton'
                  ? 'bg-[#4A0E17] text-[#F5E6D3] shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-[#F2ECE1] border border-[#E5DDD0]'
              }`}
            >
              🌿 Cotton & Daily Prints
            </button>
          </div>
        </div>

        {/* Categories Showcase: Big Full-Width Cards on Mobile (< sm), 3-4 Columns on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {loading ? (
            [...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="w-full aspect-[3/4.2] rounded-2xl bg-white animate-pulse border border-[#E5DDD0] overflow-hidden p-4 flex flex-col justify-between"
              >
                <div className="w-full h-3/4 bg-gray-200 rounded-xl"></div>
                <div className="w-2/3 h-5 bg-gray-200 rounded mt-3"></div>
                <div className="w-1/3 h-4 bg-gray-200 rounded mt-1"></div>
              </div>
            ))
          ) : (
            filteredList.map((item, index) => (
              <div
                key={item.id}
                onClick={() => navigate(item.link)}
                style={{ animationDelay: `${index * 50}ms` }}
                className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-[#EDE5D8] hover:border-[#D4AF37] shadow-[0_4px_22px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(74,14,23,0.16)] hover:-translate-y-2 active:scale-[0.98] transition-all duration-400 overflow-hidden cursor-pointer select-none shine-effect animate-card-in"
              >
                {/* 1. Large High-Impact Image Frame (Matching Reference Images 1 & 2) */}
                <div className="relative w-full aspect-[3/4.2] sm:aspect-[3/4] bg-[#F7F4EF] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top filter brightness-[0.98] group-hover:scale-108 group-hover:brightness-102 transition-transform duration-700 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Odax93M6rmDkTLwpId_.jpg';
                    }}
                  />

                  {/* Gentle gradient vignette for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity"></div>

                  {/* Top Left Tag / Badge (Silk Mark / Wholesale Tag) */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    <span className="bg-[#4A0E17]/95 backdrop-blur-xs text-[#E8A87C] border border-[#E8A87C]/30 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 group-hover:bg-[#700B1A] transition-colors">
                      <ShieldCheck size={12} className="text-amber-300 animate-pulse" />
                      <span>{item.tag}</span>
                    </span>
                  </div>

                  {/* Top Right Available Count Pill */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs group-hover:border-amber-400/50 transition-colors">
                      {item.count}
                    </span>
                  </div>

                  {/* Floating Price Pill with interactive shimmer */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg group-hover:shadow-[0_4px_18px_rgba(217,119,6,0.6)] group-hover:scale-105 transition-all duration-300">
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* 2. Clean White Title Strip at Bottom (Matching Image 2 Reference "Mau Pattu Butta") */}
                <div className="p-4 sm:p-4.5 bg-white border-t border-[#F0ECE6] flex flex-col justify-between gap-2.5 flex-1">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1916] group-hover:text-[#700B1A] transition-colors leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Link: "Click to see all products in this category" */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#700B1A] group-hover:text-[#D97706] transition-colors">
                    <span className="flex items-center gap-1">
                      <span>View All Products</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      Explore ▾
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Banner linking to full Saree Catalog */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#4A0E17] to-[#700B1A] hover:from-[#35070E] hover:to-[#550813] text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>Browse Complete Handloom Saree Catalog (200+ Weaves)</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollections;
