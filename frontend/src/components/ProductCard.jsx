import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
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
      className="card group relative flex flex-col h-full bg-white rounded-xl border border-[#E8E2D9] hover:border-[#700B1A]/40 transition-all duration-300 hover:shadow-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F4EF]">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={isHovered ? secondaryImage : mainImage}
            alt={product.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges on Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.discountPercent > 0 && (
            <span className="badge badge-discount text-[11px] shadow-sm font-bold">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="badge badge-bestseller text-[10px] shadow-sm">
              <Sparkles size={10} /> Best Seller
            </span>
          )}
          {product.isTrending && !product.isBestSeller && (
            <span className="badge badge-trending text-[10px] shadow-sm">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            isWishlisted
              ? 'bg-[#BE185D] text-white scale-110'
              : 'bg-white/90 text-gray-700 hover:bg-white hover:text-[#BE185D]'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart size={16} className={isWishlisted ? 'fill-white' : ''} />
        </button>

        {/* Floating Quick View on Hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur text-gray-800 hover:text-[#700B1A] hover:bg-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap z-10"
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Fabric & Rating Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-[#881337] tracking-wider uppercase text-[10px]">
              {product.fabric || product.category}
            </span>
            <div className="flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded text-[11px] font-bold">
              <Star size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
              <span>{product.ratings || 4.8}</span>
              <span className="text-gray-400 font-normal">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 hover:text-[#700B1A] transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Color swatch hint */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
            <span
              className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
              style={{ backgroundColor: product.colorHex || '#991B1B' }}
            ></span>
            <span>{product.color}</span>
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="pt-2 border-t border-[#F0ECE6]">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="price-tag text-base sm:text-lg font-black text-gray-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="price-original text-xs text-gray-400">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">
              Free Delivery
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`mt-2.5 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              added
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#700B1A] hover:bg-[#580816] text-white shadow-sm hover:shadow'
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
