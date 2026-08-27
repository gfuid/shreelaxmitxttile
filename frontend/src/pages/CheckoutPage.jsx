import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';
import { 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  ArrowRight,
  QrCode,
  Building
} from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useAuth();
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    discountAmount,
    appliedCoupon,
    totalPrice,
    clearCart,
  } = useCart();

  // Selected Address
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Selected Payment Method
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const addresses = user?.addresses && user.addresses.length > 0 ? user.addresses : [
    {
      fullName: user?.name || 'Customer Name',
      phone: user?.phone || '+91 98112 34567',
      street: 'Flat 402, Lotus Grandeur, Sector 62',
      landmark: 'Near Metro Station',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309',
    },
  ];

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.pincode) {
      alert('Please fill all required address fields');
      return;
    }
    await addAddress(newAddress);
    setShowNewAddressForm(false);
    setSelectedAddressIndex(addresses.length); // select newly added
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setOrderError('');

    const shippingAddress = addresses[selectedAddressIndex] || addresses[0];

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.product,
        title: item.title,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        color: item.color,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discountAmount,
      couponCode: appliedCoupon?.code || '',
      totalPrice,
    };

    try {
      const res = await ordersApi.create(orderData);
      if (res.success && res.data) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#700B1A', '#D97706', '#10B981', '#F59E0B'],
          });
        } catch (e) {}

        const createdOrder = res.data;
        clearCart();
        navigate(`/order-success/${createdOrder._id || createdOrder.orderNumber}`, {
          state: { order: createdOrder },
        });
      } else {
        throw new Error(res.message || 'Could not place order');
      }
    } catch (err) {
      setOrderError(err.message || 'Error processing order');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8">
      <div className="container max-w-5xl">
        
        {/* Checkout Header */}
        <div className="mb-8 text-center">
          <span className="text-xs uppercase font-bold text-[#881337] tracking-widest block mb-1">
            Sri Vijaylaxmi Sarees
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Complete Your Order
          </h1>
          <p className="text-xs text-gray-500 mt-1">100% Encrypted & Safe Checkout</p>
        </div>

        {orderError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
            {orderError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Address Selection + Payment Method */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#700B1A] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h2 className="font-serif text-base font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-bold text-[#700B1A] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Saved Addresses List */}
              <div className="space-y-3">
                {addresses.map((addr, idx) => (
                  <label
                    key={idx}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressIndex === idx
                        ? 'border-[#700B1A] bg-[#FDF2F4]/60 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address_select"
                        checked={selectedAddressIndex === idx}
                        onChange={() => setSelectedAddressIndex(idx)}
                        className="mt-1 text-[#700B1A] focus:ring-[#700B1A]"
                      />
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900 font-bold text-sm">{addr.fullName}</strong>
                          <span className="text-gray-500 font-medium">{addr.phone}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {addr.street} {addr.landmark && `(Near ${addr.landmark})`}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Add New Address Form Modal/Inline */}
              {showNewAddressForm && (
                <form onSubmit={handleSaveNewAddress} className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      placeholder="Receiver's Name"
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="form-input text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Flat / House No. / Building / Street *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      placeholder="Street address"
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label">Landmark</label>
                    <input
                      type="text"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      placeholder="Nearby landmark"
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="City"
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      placeholder="State"
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="6-digit PIN code"
                      className="form-input text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="btn btn-secondary text-xs py-2 px-4"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary text-xs py-2 px-4">
                      Save & Deliver Here
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#700B1A] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="font-serif text-base font-bold text-gray-900">
                  Select Payment Option
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Cash on Delivery (COD) */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#700B1A] bg-[#FDF2F4]/60' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-[#700B1A] focus:ring-[#700B1A]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900 font-bold">Cash on Delivery (COD)</strong>
                      <span className="badge bg-emerald-100 text-emerald-800 text-[10px] font-bold">Recommended</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">Pay in cash or UPI scan at your doorstep upon parcel arrival.</p>
                  </div>
                </label>

                {/* UPI / QR Code */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-[#700B1A] bg-[#FDF2F4]/60' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-[#700B1A] focus:ring-[#700B1A]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900 font-bold flex items-center gap-1.5">
                        <QrCode size={16} className="text-[#D97706]" />
                        <span>Instant UPI (Google Pay, PhonePe, Paytm)</span>
                      </strong>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">Direct instant payment via your favorite UPI app.</p>
                  </div>
                </label>

                {/* Credit / Debit Card */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-[#700B1A] bg-[#FDF2F4]/60' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="mt-1 text-[#700B1A] focus:ring-[#700B1A]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900 font-bold flex items-center gap-1.5">
                        <CreditCard size={16} className="text-[#D97706]" />
                        <span>Credit / Debit Cards (Visa, MasterCard, RuPay)</span>
                      </strong>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">Safe 256-bit SSL encrypted card transaction.</p>
                  </div>
                </label>

                {/* NetBanking */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'NETBANKING' ? 'border-[#700B1A] bg-[#FDF2F4]/60' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="NETBANKING"
                    checked={paymentMethod === 'NETBANKING'}
                    onChange={() => setPaymentMethod('NETBANKING')}
                    className="mt-1 text-[#700B1A] focus:ring-[#700B1A]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900 font-bold flex items-center gap-1.5">
                        <Building size={16} className="text-[#D97706]" />
                        <span>Net Banking (All Major Indian Banks)</span>
                      </strong>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">SBI, HDFC, ICICI, Axis, PNB and 40+ banks.</p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right: Order Items Review & Place Order Button */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm text-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
                Order Summary ({cartItems.length} items)
              </h3>

              {/* Items preview list */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.color}`} className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-12 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-gray-500">Qty: {item.quantity} | {item.color}</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Items Price:</span>
                  <span>₹{(Number(itemsPrice) || 0).toLocaleString('en-IN')}</span>
                </div>

                {(Number(discountAmount) || 0) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount:</span>
                    <span>- ₹{(Number(discountAmount) || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="text-emerald-700 font-bold uppercase">
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Total Payable:</span>
                  <span className="text-xl font-black text-[#700B1A]">
                    ₹{(Number(totalPrice) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Final Place Order Button */}
              <button
                type="button"
                disabled={submitting}
                onClick={handlePlaceOrder}
                className="w-full btn btn-gold text-black font-black text-sm py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                {submitting ? (
                  <span>Securing Your Saree Order...</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Place Order (₹{totalPrice.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-gray-400">
                By placing this order, you agree to Sri Vijaylaxmi Sarees Terms and 7-day easy return policy.
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
