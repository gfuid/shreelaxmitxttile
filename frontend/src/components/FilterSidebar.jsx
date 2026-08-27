import React from 'react';
import { Filter, X, Star, Check } from 'lucide-react';

const FilterSidebar = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  totalResults,
  isMobile = false,
  onCloseMobile,
}) => {
  const handleCategoryToggle = (cat) => {
    const current = filters.category ? filters.category.split(',') : [];
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onFilterChange('category', updated.join(','));
  };

  const handleFabricToggle = (fab) => {
    const current = filters.fabric ? filters.fabric.split(',') : [];
    const updated = current.includes(fab)
      ? current.filter((f) => f !== fab)
      : [...current, fab];
    onFilterChange('fabric', updated.join(','));
  };

  const handleOccasionToggle = (occ) => {
    const current = filters.occasion ? filters.occasion.split(',') : [];
    const updated = current.includes(occ)
      ? current.filter((o) => o !== occ)
      : [...current, occ];
    onFilterChange('occasion', updated.join(','));
  };

  const selectedCategories = filters.category ? filters.category.split(',') : [];
  const selectedFabrics = filters.fabric ? filters.fabric.split(',') : [];
  const selectedOccasions = filters.occasion ? filters.occasion.split(',') : [];

  const priceBrackets = [
    { label: 'Under ₹2,000', min: 0, max: 2000 },
    { label: '₹2,000 - ₹4,000', min: 2000, max: 4000 },
    { label: '₹4,000 - ₹6,000', min: 4000, max: 6000 },
    { label: 'Above ₹6,000', min: 6000, max: 50000 },
  ];

  return (
    <div className={`bg-white rounded-xl border border-[#E8E2D9] p-5 ${isMobile ? 'h-full overflow-y-auto' : 'sticky top-28'}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
        <div className="flex items-center gap-2 font-serif text-base font-bold text-gray-900">
          <Filter size={18} className="text-[#700B1A]" />
          <span>Filters</span>
          <span className="text-xs font-normal text-gray-500 font-sans">({totalResults} items)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-[#881337] hover:underline"
          >
            Clear All
          </button>
          {isMobile && (
            <button onClick={onCloseMobile} className="p-1 text-gray-500 hover:text-black">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 text-xs">
        
        {/* Categories Section */}
        <div>
          <h4 className="font-bold text-gray-900 mb-2.5 uppercase tracking-wider text-[11px] text-[#700B1A]">
            Saree Collection
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filterOptions.categories.map((cat, i) => (
              <label
                key={i}
                className="flex items-center gap-2 py-1 text-gray-700 hover:text-[#700B1A] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                  className="rounded border-gray-300 text-[#700B1A] focus:ring-[#700B1A] w-3.5 h-3.5"
                />
                <span className={selectedCategories.includes(cat) ? 'font-bold text-[#700B1A]' : ''}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Fabrics Filter */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-2.5 uppercase tracking-wider text-[11px] text-[#700B1A]">
            Fabric & Weave
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filterOptions.fabrics.map((fab, i) => (
              <label
                key={i}
                className="flex items-center gap-2 py-1 text-gray-700 hover:text-[#700B1A] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFabrics.includes(fab)}
                  onChange={() => handleFabricToggle(fab)}
                  className="rounded border-gray-300 text-[#700B1A] focus:ring-[#700B1A] w-3.5 h-3.5"
                />
                <span className={selectedFabrics.includes(fab) ? 'font-bold text-[#700B1A]' : ''}>
                  {fab}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Selection */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-2.5 uppercase tracking-wider text-[11px] text-[#700B1A]">
            Price Range
          </h4>
          <div className="space-y-1.5">
            {priceBrackets.map((b, i) => {
              const isSelected =
                Number(filters.minPrice) === b.min && Number(filters.maxPrice) === b.max;
              return (
                <label
                  key={i}
                  className="flex items-center gap-2 py-1 text-gray-700 hover:text-[#700B1A] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="price_bracket"
                    checked={isSelected}
                    onChange={() => {
                      onFilterChange('minPrice', b.min);
                      onFilterChange('maxPrice', b.max);
                    }}
                    className="text-[#700B1A] focus:ring-[#700B1A] w-3.5 h-3.5"
                  />
                  <span className={isSelected ? 'font-bold text-[#700B1A]' : ''}>
                    {b.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Occasions Filter */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-2.5 uppercase tracking-wider text-[11px] text-[#700B1A]">
            Occasion
          </h4>
          <div className="space-y-1.5">
            {filterOptions.occasions.map((occ, i) => (
              <label
                key={i}
                className="flex items-center gap-2 py-1 text-gray-700 hover:text-[#700B1A] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(occ)}
                  onChange={() => handleOccasionToggle(occ)}
                  className="rounded border-gray-300 text-[#700B1A] focus:ring-[#700B1A] w-3.5 h-3.5"
                />
                <span className={selectedOccasions.includes(occ) ? 'font-bold text-[#700B1A]' : ''}>
                  {occ}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Rating Filter */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-2.5 uppercase tracking-wider text-[11px] text-[#700B1A]">
            Customer Rating
          </h4>
          <div className="space-y-1.5">
            {[4, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onFilterChange('rating', filters.rating === star ? '' : star)}
                className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg border text-left transition-colors ${
                  Number(filters.rating) === star
                    ? 'border-[#700B1A] bg-[#FDF2F4] text-[#700B1A] font-bold'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{star} Stars & Above</span>
                </div>
                {Number(filters.rating) === star && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterSidebar;
