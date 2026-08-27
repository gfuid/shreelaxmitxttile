import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import QuickViewModal from '../components/QuickViewModal';
import { SkeletonSareeCard } from '../components/common/Skeleton';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles, ShoppingBag } from 'lucide-react';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    categories: [
      'Designer Pattu Gadwal',
      'Dharmavaram Pattu',
      'Banaras Wed Cream',
      'COTTON NARAYANPET',
      'Wedding Ghagara',
      'Mau Rich pallu',
      'Mau Venkatgiri buta',
      'MAU PATTU BUTI',
      'Surat Prints',
      'SINGAL COLOUR OFFER',
      'Tranding Sarees',
      'Mau MD 3535',
      'Mau Buti 3636',
    ],
    fabrics: ['Gadwal Silk', 'Pure Dharmavaram Silk', 'Katan Silk', 'Pure Handloom Cotton', 'Velvet & Silk Georgette', 'Mau Art Silk', 'Mau Silk Blend', 'Mau Pattu Silk', 'Pure Georgette', 'Silk Blend', 'Chiffon & Mirror Sequins', 'Mau MD Silk'],
    occasions: ['Bridal & Wedding', 'Festive & Party', 'Cocktail & Day Wedding', 'Haldi & Puja', 'Casual'],
    colors: ['Crimson Red', 'Peacock Blue', 'Cream & Gold', 'Maroon & Green', 'Scarlet Red', 'Emerald Green', 'Sunset Orange', 'Royal Magenta', 'Pastel Pink', 'Sunshine Yellow', 'Lavender', 'Midnight Blue'],
    maxPrice: 20000,
  });

  // Read filter params from URL
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    fabric: searchParams.get('fabric') || '',
    occasion: searchParams.get('occasion') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'newest',
  };

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const [prodRes, optRes] = await Promise.all([
          productsApi.getAll(filters),
          productsApi.getFilterOptions(),
        ]);
        if (prodRes.data) setProducts(prodRes.data);
        if (optRes.data) {
          setFilterOptions((prev) => ({
            categories: optRes.data.categories && optRes.data.categories.length > 0 ? optRes.data.categories : prev.categories,
            fabrics: optRes.data.fabrics && optRes.data.fabrics.length > 0 ? optRes.data.fabrics : prev.fabrics,
            occasions: optRes.data.occasions && optRes.data.occasions.length > 0 ? optRes.data.occasions : prev.occasions,
            colors: optRes.data.colors && optRes.data.colors.length > 0 ? optRes.data.colors : prev.colors,
            maxPrice: optRes.data.maxPrice || prev.maxPrice,
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const removeSpecificFilter = (key, valToRemove = null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!valToRemove) {
      newParams.delete(key);
    } else {
      const current = (newParams.get(key) || '').split(',');
      const remaining = current.filter((item) => item !== valToRemove);
      if (remaining.length > 0) {
        newParams.set(key, remaining.join(','));
      } else {
        newParams.delete(key);
      }
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8">
      <div className="container">
        
        {/* Breadcrumb & Top Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-[#700B1A] font-semibold">Saree Catalog</span>
              {filters.category && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-bold">{filters.category}</span>
                </>
              )}
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {filters.search ? `Search results for "${filters.search}"` : filters.category || 'All Saree & Ethnic Collections'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Showing {products.length} authentic handcrafted weaves</p>
          </div>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex-1 btn btn-secondary text-xs flex items-center justify-center gap-2"
            >
              <SlidersHorizontal size={14} />
              <span>Filters ({products.length})</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-gray-500 font-medium">Sort By:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="bg-white border border-[#DCD6CD] rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#700B1A]"
              >
                <option value="newest">✨ Newest Arrivals</option>
                <option value="popular">🔥 Most Popular</option>
                <option value="price-asc">💰 Price: Low to High</option>
                <option value="price-desc">💎 Price: High to Low</option>
                <option value="discount">🏷️ Highest Discount</option>
                <option value="rating">⭐ Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(filters.category || filters.fabric || filters.occasion || filters.minPrice || filters.rating || filters.search) && (
          <div className="mb-6 flex flex-wrap items-center gap-2 bg-[#FDF2F4] p-3 rounded-xl border border-[#F43F5E]/20">
            <span className="text-xs font-bold text-[#700B1A]">Active Filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                <span>Keyword: {filters.search}</span>
                <X size={13} className="cursor-pointer hover:text-red-500" onClick={() => removeSpecificFilter('search')} />
              </span>
            )}

            {filters.category && filters.category.split(',').map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                <span>Category: {cat}</span>
                <X size={13} className="cursor-pointer hover:text-red-500" onClick={() => removeSpecificFilter('category', cat)} />
              </span>
            ))}

            {filters.fabric && filters.fabric.split(',').map((fab) => (
              <span key={fab} className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                <span>Fabric: {fab}</span>
                <X size={13} className="cursor-pointer hover:text-red-500" onClick={() => removeSpecificFilter('fabric', fab)} />
              </span>
            ))}

            {filters.occasion && filters.occasion.split(',').map((occ) => (
              <span key={occ} className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                <span>Occasion: {occ}</span>
                <X size={13} className="cursor-pointer hover:text-red-500" onClick={() => removeSpecificFilter('occasion', occ)} />
              </span>
            ))}

            {filters.rating && (
              <span className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                <span>Rating: {filters.rating}★ & above</span>
                <X size={13} className="cursor-pointer hover:text-red-500" onClick={() => removeSpecificFilter('rating')} />
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-600 hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block md:col-span-3">
            <FilterSidebar
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              totalResults={products.length}
            />
          </div>

          {/* Right Product Grid */}
          <div className="md:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonSareeCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FDF2F4] text-[#700B1A] mx-auto flex items-center justify-center mb-4">
                  <ShoppingBag size={28} className="text-[#700B1A]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                  No Sarees Found Matching Your Filters
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                  Try clearing some filters or search for another fabric like Banarasi, Kanjivaram, or Organza.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn btn-primary text-xs font-bold px-6 py-2.5 rounded-full"
                >
                  Clear All Filters & View All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Bottom Sheet Drawer */}
      {mobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-4 flex flex-col">
            <FilterSidebar
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              totalResults={products.length}
              isMobile={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;
