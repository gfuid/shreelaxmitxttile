import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Printer, 
  ArrowRight, 
  Calendar, 
  CreditCard,
  Sparkles
} from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await ordersApi.getById(id);
          if (res.data) setOrder(res.data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-screen container py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#700B1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-gray-500">Generating Order Confirmation & Invoice...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="container max-w-3xl">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-10 shadow-lg text-center mb-8">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <CheckCircle2 size={44} />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Order Confirmed & Placed!</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dhanyawad! Your Saree Order is on its way.
          </h1>

          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
            We have received your order. Our Varanasi artisans are packing your sarees with royal protective wrap.
          </p>

          {/* Key Order Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9] text-xs text-left mb-6">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Order ID</span>
              <strong className="text-gray-900 font-bold block mt-0.5">{order?.orderNumber || `SVL-2026-${id?.slice(-6) || '894120'}`}</strong>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Estimated Delivery</span>
              <strong className="text-emerald-700 font-bold block mt-0.5">
                {deliveryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </strong>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Payment</span>
              <strong className="text-gray-900 font-bold block mt-0.5">{order?.paymentMethod || 'Cash on Delivery'}</strong>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Total Amount</span>
              <strong className="text-[#700B1A] font-black text-sm block mt-0.5">
                ₹{Number(order?.totalPrice || 3510).toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/orders"
              className="btn btn-primary text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2"
            >
              <Truck size={16} />
              <span>Track Order Live Timeline</span>
            </Link>

            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs font-bold px-5 py-3 rounded-full flex items-center gap-2"
            >
              <Printer size={16} />
              <span>Print Invoice Receipt</span>
            </button>
          </div>

        </div>

        {/* Ordered Items Preview */}
        {order?.orderItems && order.orderItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-sm mb-6">
            <h3 className="font-serif text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Ordered Items Summary
            </h3>

            <div className="space-y-4">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-14 h-16 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
                      <p className="text-gray-500 text-[11px]">Color: {item.color} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <strong className="text-gray-900 block mb-1">Delivering to:</strong>
                <p>{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderSuccessPage;
