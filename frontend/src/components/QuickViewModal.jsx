import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Truck, ShieldCheck, Check, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(
    Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-box max-w-3xl overflow-hidden p-0 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow text-gray-600 hover:text-black flex items-center justify-center z-20"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Section */}
          <div className="p-4 bg-[#FAF8F5] flex flex-col justify-between">
            <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-white shadow-inner mb-3">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail switcher */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImage === img ? 'border-[#700B1A] scale-105 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider bg-[#FFF5EB] px-2 py-0.5 rounded">
                {product.category}
              </span>
              <h2 className="font-serif text-lg font-bold text-gray-900 mt-1 leading-snug">
                {product.title}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xl font-black text-[#700B1A]">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.numReviews || 12} reviews)</span>
              </div>

              {/* Fabric Specs */}
              <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fabric:</span>
                  <span className="font-bold text-gray-800">{product.fabric || 'Pure Silk'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Zari:</span>
                  <span className="font-bold text-gray-800">{product.zari || 'Gold Zari'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Authenticity:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck size={13} /> 100% Silk Mark Certified
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#700B1A] to-[#9F1239] hover:opacity-95 text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={16} /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Bag
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'border-[#BE185D] text-[#BE185D] bg-pink-50'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? 'fill-[#BE185D]' : ''} />
                </button>
              </div>

              {/* WhatsApp Support Button */}
              <a
                href={`https://wa.me/919440183000?text=${encodeURIComponent(`Hello Sri Vijaylaxmi, I am interested in ${product.title} (₹${product.price})`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-emerald-300 text-[#065F46] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare size={14} className="text-[#25D366]" />
                <span>Chat on WhatsApp about this Saree</span>
              </a>

              <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-[#D97706]" /> Express Delivery
                </span>
                <Link
                  to={`/product/${product.slug || product._id}`}
                  className="text-[#700B1A] font-bold hover:underline"
                  onClick={onClose}
                >
                  View Full Product Details →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
