import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  Trash2, 
  Heart, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Check, 
  X, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    itemCount,
    itemsPrice,
    totalMrp,
    totalSavings,
    shippingPrice,
    amountToFreeShipping,
    discountAmount,
    totalPrice,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const availableCoupons = [
    { code: 'WELCOME10', desc: '10% Off on All Orders', min: 999 },
    { code: 'FESTIVE500', desc: 'Flat ₹500 Off', min: 2999 },
    { code: 'ROYAL20', desc: '20% Off on Bridal Silk', min: 4999 },
    { code: 'VIJAYLAXMI', desc: '₹300 Off Launch Offer', min: 1499 },
  ];

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      await applyCouponCode(code);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16">
        <div className="container max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-[#E8E2D9] shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#FDF2F4] text-[#700B1A] flex items-center justify-center text-4xl mx-auto mb-4">
            🛍️
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-gray-500 mb-6">
            Explore our handcrafted Banarasi, Kanjivaram and festive saree collections to add your favorites.
          </p>
          <Link to="/shop" className="btn btn-primary text-xs font-bold px-8 py-3 rounded-full">
            Explore Sarees Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8">
      <div className="container">
        
        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              My Shopping Bag
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{itemCount} items in your bag</p>
          </div>

          <Link to="/shop" className="text-xs font-bold text-[#700B1A] hover:underline flex items-center gap-1">
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-bold text-gray-800">
              <Truck size={16} className="text-[#D97706]" />
              {amountToFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
              ) : (
                <span>Add <strong className="text-[#700B1A]">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more to get <strong>FREE Delivery</strong>!</span>
              )}
            </div>
            <span className="text-[11px] font-bold text-gray-400">Target: ₹999</span>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D97706] to-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (itemsPrice / 999) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.product}-${item.color}`}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                {/* Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-gray-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#881337] tracking-wider">
                      {item.fabric || item.category}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>Color: <strong>{item.color}</strong></span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-base font-black text-gray-900">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{Number(item.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50 text-xs">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Total item subtotal */}
                  <span className="text-xs font-bold text-gray-800 hidden sm:inline">
                    Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  {/* Actions: Remove & Wishlist */}
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => {
                        toggleWishlist(item.product);
                        removeFromCart(item.product);
                      }}
                      className="text-gray-500 hover:text-[#BE185D] flex items-center gap-1"
                    >
                      <Heart size={14} className={isInWishlist(item.product) ? 'fill-[#BE185D] text-[#BE185D]' : ''} />
                      <span className="hidden sm:inline">Save</span>
                    </button>

                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary & Coupon Engine */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo Code Box */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm">
              <h3 className="font-serif text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <Tag size={16} className="text-[#700B1A]" />
                <span>Apply Promo Coupon</span>
              </h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div>
                    <span className="font-bold text-emerald-800 block text-xs">
                      Coupon Applied: {appliedCoupon.code}
                    </span>
                    <span className="text-emerald-700 text-[11px]">
                      Saved ₹{discountAmount.toLocaleString('en-IN')} on this order!
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove coupon"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApplyCoupon();
                  }}
                  className="space-y-2"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon Code (e.g. WELCOME10)"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg uppercase focus:outline-none focus:border-[#700B1A]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="btn btn-primary text-xs font-bold px-4 py-2 rounded-lg"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                </form>
              )}

              {/* 1-Click Available Coupon Chips */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Popular Coupons Available
                </p>
                <div className="space-y-1.5">
                  {availableCoupons.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className="p-2 rounded-lg border border-dashed border-amber-400 bg-[#FEF3C7]/40 hover:bg-[#FEF3C7] cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#700B1A] uppercase tracking-wide">{c.code}</span>
                        <p className="text-[11px] text-gray-600">{c.desc} (Min ₹{c.min})</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                        Tap to Apply
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Details Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-3 text-xs">
              <h3 className="font-serif text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                Price Breakdown
              </h3>

              <div className="flex justify-between text-gray-600">
                <span>Total Product MRP:</span>
                <span>₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-700">
                <span>Special Discount:</span>
                <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span>- ₹{(Number(discountAmount) || 0).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee:</span>
                {shippingPrice === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">Free</span>
                ) : (
                  <span>₹{shippingPrice}</span>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Amount Payable:</span>
                <span className="text-xl font-black text-[#700B1A]">
                  ₹{(Number(totalPrice) || 0).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Savings callout */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800 font-semibold">
                ✨ You are saving ₹{((Number(totalSavings) || 0) + (Number(discountAmount) || 0)).toLocaleString('en-IN')} on this order!
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn btn-primary text-sm font-bold py-3.5 rounded-xl shadow-lg mt-3 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-[#D97706]" /> Direct Showroom Booking
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-[#D97706]" /> Free Insured Delivery
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
