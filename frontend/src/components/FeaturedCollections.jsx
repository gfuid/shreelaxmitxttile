import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Check, Plus, Eye } from 'lucide-react';
import { SkeletonSareeCard } from './common/Skeleton';

const FeaturedCollections = ({ products, onQuickView, loading }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedMap, setAddedMap] = useState({});

  const featuredItems = (products || []).slice(0, 5);

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedMap((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <section className="py-12 bg-[#F8F4EE] border-b border-[#E5DDD0]">
      <div className="container">
        
        {/* Section Header Row matching image.png */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-3 border-b border-[#E5DDD0]">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.08em] text-[#380B12] uppercase">
              FEATURED COLLECTIONS
            </h2>
          </div>

          <div className="text-[11px] font-semibold tracking-[0.15em] text-[#736B63] uppercase flex items-center gap-4 mt-2 sm:mt-0">
            <Link to="/" className="hover:text-[#4A0E17]">HOME</Link>
            <span>,</span>
            <Link to="/shop" className="hover:text-[#4A0E17]">COLLECTIONS ▾</Link>
            <Link to="/#about-heritage" className="hover:text-[#4A0E17]">ABOUT US</Link>
            <span>,</span>
            <Link to="/shop?category=Bridal+%26+Wedding" className="hover:text-[#4A0E17]">BRIDAL</Link>
            <span>,</span>
            <Link to="/#contact-us" className="hover:text-[#4A0E17]">CONTACT US</Link>
          </div>
        </div>

        {/* 5-Column Grid matching reference design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {loading || featuredItems.length === 0 ? (
            [...Array(5)].map((_, i) => (
              <SkeletonSareeCard key={i} />
            ))
          ) : (
            featuredItems.map((product) => {
              const isWishlisted = isInWishlist(product._id);
              const isAdded = !!addedMap[product._id];

              return (
                <div
                  key={product._id}
                  className="group flex flex-col justify-between items-center text-center bg-white p-3.5 rounded-2xl border border-[#EDE5D8] hover:border-[#D4AF37]/50 shadow-[0_4px_18px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_36px_rgba(74,14,23,0.11)] hover:-translate-y-1 transition-all duration-500"
                >
                {/* Image Frame with Arch Curve */}
                <div className="w-full relative aspect-[3/4.2] rounded-xl overflow-hidden bg-[#FAF8F5] mb-3">
                  <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out filter brightness-[0.98] group-hover:brightness-100"
                      loading="lazy"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product._id);
                    }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow ${
                      isWishlisted
                        ? 'bg-[#BE185D] text-white'
                        : 'bg-white/90 text-gray-700 hover:text-[#BE185D]'
                    }`}
                  >
                    <Heart size={14} className={isWishlisted ? 'fill-white' : ''} />
                  </button>

                  {/* Quick View */}
                  {onQuickView && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onQuickView(product);
                      }}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 text-gray-800 hover:text-[#4A0E17] text-[10px] font-bold px-2.5 py-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Quick View
                    </button>
                  )}
                </div>

                {/* Saree Title */}
                <Link to={`/product/${product.slug || product._id}`} className="w-full px-1 mb-2">
                  <h3 className="font-serif text-xs font-bold text-[#1F1916] line-clamp-1 hover:text-[#4A0E17] transition-colors leading-tight">
                    {product.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 block mt-0.5 uppercase tracking-wider">
                    {product.fabric}
                  </span>
                </Link>

                {/* Price Pill Button matching image.png (+ ₹1,999) */}
                <button
                  onClick={(e) => handleAdd(e, product)}
                  className="btn-price-pill w-full max-w-[140px] text-xs font-bold"
                  title="Click to Add to Bag"
                >
                  {isAdded ? (
                    <>
                      <Check size={13} />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <span>+</span>
                      <span>₹{Number(product.price).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollections;
