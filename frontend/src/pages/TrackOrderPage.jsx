import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, AlertCircle, Sparkles } from 'lucide-react';

const TrackOrderPage = () => {
  const [orderQuery, setOrderQuery] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const res = await ordersApi.getById(orderQuery.trim());
      if (res.data) {
        setOrderData(res.data);
      } else {
        setError('No order found with the provided Order ID. Please check and try again.');
      }
    } catch (err) {
      setError(err.message || 'Order not found. Please verify your Order Number (e.g. SVL-2026-894120).');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIndex = (status) => {
    const idx = steps.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="bg-[#F8F4EE] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#380B12] to-[#24040A] text-white py-16 px-4 text-center relative overflow-hidden border-b border-[#E8A87C]/30">
        <div className="container max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#E8A87C]/20 border border-[#E8A87C]/40 text-[#E8A87C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Truck size={13} className="text-amber-300" />
            <span>Real-Time Shipment Tracking</span>
          </div>
          <h1 className="font-royal text-3xl sm:text-5xl font-black tracking-wider text-white">
            TRACK YOUR ORDER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Enter your Sri Vijaylaxmi order number to view real-time dispatch checkpoints and estimated delivery.
          </p>
        </div>
      </section>

      {/* Lookup Card */}
      <section className="py-14">
        <div className="container max-w-2xl">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DDD0] shadow-sm mb-8">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="form-label text-xs font-bold text-[#380B12] block mb-1.5">
                  Enter Order Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="e.g. SVL-2026-894120"
                      className="form-input text-xs font-mono pl-9"
                    />
                    <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-price-pill px-6 py-2.5 text-xs font-black uppercase tracking-wider"
                  >
                    {loading ? 'Searching...' : 'TRACK SHIPMENT'}
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">
                  Sample Order ID for testing: <strong className="font-mono text-gray-700 cursor-pointer" onClick={() => setOrderQuery('SVL-2026-894120')}>SVL-2026-894120</strong>
                </span>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Live Order Result */}
          {orderData && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DDD0] shadow-md space-y-6">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider block">
                    Verified Order Found
                  </span>
                  <h3 className="font-serif text-xl font-bold text-gray-900">
                    {orderData.orderNumber}
                  </h3>
                  <span className="text-xs text-gray-400">
                    Ordered on {new Date(orderData.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="badge bg-[#FDF2F4] text-[#700B1A] border border-pink-200 text-xs font-bold px-3 py-1">
                    Status: {orderData.orderStatus}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900 mb-4">Shipment Lifecycle</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  {steps.map((st, idx) => {
                    const currentIdx = getStepIndex(orderData.orderStatus);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={st} className="space-y-1.5 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                            isDone
                              ? 'bg-[#700B1A] text-white'
                              : 'bg-gray-100 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-amber-300/60 scale-110' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checkpoint Timeline */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-serif text-sm font-bold text-gray-900 mb-3">Live Checkpoints</h4>
                <div className="space-y-3 pl-2 border-l-2 border-[#700B1A]">
                  {orderData.trackingUpdates?.map((up, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#700B1A]"></div>
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-gray-900 font-bold">{up.status}</strong>
                        <span className="text-[10px] text-gray-400">
                          {new Date(up.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{up.note}</p>
                      {up.location && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          <span>{up.location}</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Summary */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-serif text-sm font-bold text-gray-900 mb-2">Package Items</h4>
                <div className="space-y-2">
                  {orderData.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5DDD0] text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-12 h-14 rounded-xl object-cover" />
                        <div>
                          <h5 className="font-bold text-gray-900">{item.title}</h5>
                          <span className="text-[11px] text-gray-500">Color: {item.color} | Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#700B1A]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default TrackOrderPage;
