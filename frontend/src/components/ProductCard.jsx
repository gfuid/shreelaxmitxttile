import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye, Check, Sparkles, Award } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = isInWishlist(product._id);
  const mainImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '';
  const secondaryImage = Array.isArray(product.images) && product.images.length > 1 ? product.images[1] : mainImage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <div 
      className="group relative flex flex-col h-full bg-white rounded-2xl border border-[#EDE5D8] hover:border-[#D4AF37]/50 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_38px_rgba(74,14,23,0.11)] hover:-translate-y-1 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F4EF]">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={isHovered ? secondaryImage : mainImage}
            alt={product.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.98] group-hover:brightness-100"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg';
            }}
          />
        </Link>

        {/* Soft bottom vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

        {/* Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent > 0 && (
            <span className="bg-[#BE185D] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wide">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-400 text-black text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles size={10} className="fill-current" /> Best Seller
            </span>
          )}
          <span className="bg-white/95 backdrop-blur-xs text-[#700B1A] border border-[#E8A87C]/60 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <Award size={10} className="text-[#D97706]" /> Silk Mark
          </span>
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            isWishlisted
              ? 'bg-[#BE185D] text-white scale-110'
              : 'bg-white/90 backdrop-blur-xs text-gray-700 hover:bg-white hover:text-[#BE185D]'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart size={15} className={isWishlisted ? 'fill-white' : ''} />
        </button>

        {/* Floating Quick Action Buttons on Hover */}
        <div className="absolute bottom-3 inset-x-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 bg-white/95 hover:bg-white text-gray-900 hover:text-[#4A0E17] py-2 px-3 rounded-xl text-[11px] font-bold shadow-lg backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>
          )}
          <Link
            to={`/product/${product.slug || product._id}`}
            className="bg-[#4A0E17] hover:bg-[#32070D] text-white py-2 px-3 rounded-xl text-[11px] font-bold shadow-lg transition-all flex items-center justify-center gap-1 shrink-0"
          >
            <span>Details</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2 bg-white">
        <div>
          {/* Fabric & Rating Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-bold text-[#881337] tracking-wider uppercase text-[10px]">
              {product.fabric || product.category}
            </span>
            <div className="flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded text-[10.5px] font-bold">
              <Star size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
              <span>{product.ratings || 4.8}</span>
              <span className="text-gray-400 font-normal text-[9.5px]">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h3 className="font-serif text-[13px] sm:text-[14.5px] font-bold text-gray-950 line-clamp-1 hover:text-[#700B1A] transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Color swatch & Weave highlight hint */}
          <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block shadow-2xs"
                style={{ backgroundColor: product.colorHex || '#991B1B' }}
              ></span>
              <span className="text-gray-600 text-[10.5px]">{product.color || 'Royal'}</span>
            </div>
            <span className="text-[10px] text-[#D97706] font-semibold">
              {product.workType || 'Pure Zari Weave'}
            </span>
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="pt-2 border-t border-[#F0ECE6]">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="price-tag text-base sm:text-lg font-black text-[#700B1A]">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="price-original text-xs text-gray-400 line-through">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[9.5px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-sm">
              Free Delivery
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`mt-2.5 w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gradient-to-r from-[#4A0E17] to-[#801424] hover:from-[#32070D] hover:to-[#610E1B] text-white shadow-xs hover:shadow-md active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
