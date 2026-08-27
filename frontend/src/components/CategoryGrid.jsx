import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        if (res.data) setCategories(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 mb-2"></div>
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-10 bg-white border-b border-[#E8E2D9]">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-3 border-b border-[#F0ECE6]">
          <div>
            <div className="flex items-center gap-1.5 text-[#881337] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles size={13} className="text-[#D97706]" />
              <span>Signature Weaves</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-[#700B1A] hover:text-[#D97706] flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Weaves</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Circular / Card Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-300 hover:bg-[#FAF8F5] hover:shadow-md border border-transparent hover:border-[#E8E2D9]"
            >
              {/* Image Circle with Golden Ring on hover */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-[#D97706]/40 p-0.5 group-hover:border-[#700B1A] group-hover:scale-105 transition-all duration-300 shadow-sm">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Title & Count */}
              <h3 className="text-xs font-bold text-gray-800 group-hover:text-[#700B1A] transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-gray-400 mt-0.5">
                {cat.itemCount ? `${cat.itemCount}+ Styles` : 'Explore'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
