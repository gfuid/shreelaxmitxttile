import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersApi, productsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Printer,
  Sparkles,
  Star,
  Camera,
  UploadCloud,
  X,
  MessageSquare,
  Search,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  Phone,
  Calendar,
  CreditCard,
  ShieldCheck,
  Award,
  HelpCircle,
  Share2,
  RefreshCw,
  Info
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind');
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
  const [silkCareModalItem, setSilkCareModalItem] = useState(null);

  // Review Modal State
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [reviewTags, setReviewTags] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const trackingSteps = [
    { key: 'Placed', label: 'Order Placed', desc: 'Received & payment verified' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Silk inspection complete' },
    { key: 'Packed', label: 'Royal Packed', desc: 'Wrapped in butter paper & royal box' },
    { key: 'Shipped', label: 'Dispatched', desc: 'In transit via Express Courier' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Arriving at your doorstep today' },
    { key: 'Delivered', label: 'Delivered', desc: 'Handed over to customer' },
  ];

  const quickReviewTags = [
    '✨ Rich Zari Luster',
    '🧵 Authentic Pure Silk',
    '🎨 True to Picture Color',
    '🎁 Royal Box Packaging',
    '⚡ Super Fast Delivery',
    '👗 Drapes Flawlessly'
  ];

  const fetchOrders = async () => {
    try {
      const res = await ordersApi.getMyOrders();
      if (res.data) {
        setOrders(res.data);
        try {
          localStorage.setItem('svl_v7_orders_db', JSON.stringify(res.data));
        } catch (e) {}
        // Automatically expand the latest order for immediate rich view
        if (res.data.length > 0 && !expandedOrderId) {
          setExpandedOrderId(res.data[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleSync = () => {
      fetchOrders();
    };

    window.addEventListener('svl_orders_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('svl_orders_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Filtered orders based on Tab & Search Query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === 'in-transit') {
        if (!['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery'].includes(order.orderStatus)) return false;
      } else if (activeTab === 'delivered') {
        if (order.orderStatus !== 'Delivered') return false;
      } else if (activeTab === 'cancelled') {
        if (order.orderStatus !== 'Cancelled') return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = order.orderNumber?.toLowerCase().includes(q);
        const matchesItems = order.orderItems?.some((it) => it.title?.toLowerCase().includes(q) || it.color?.toLowerCase().includes(q));
        const matchesCity = order.shippingAddress?.city?.toLowerCase().includes(q);
        return matchesNumber || matchesItems || matchesCity;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      inTransit: orders.filter((o) => ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)).length,
      delivered: orders.filter((o) => o.orderStatus === 'Delivered').length,
      cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length,
    };
  }, [orders]);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelModalOrderId) return;
    try {
      await ordersApi.cancel(cancelModalOrderId, cancelReason || 'Customer requested cancellation');
      setCancelModalOrderId(null);
      setCancelReason('Changed my mind');
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const handleReorder = (item) => {
    const productForCart = {
      _id: item.product?._id || item.product,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      images: [item.image],
      color: item.color,
      fabric: 'Pure Silk',
      sku: 'SVL-REORDER',
    };
    addToCart(productForCart, item.quantity || 1, item.color);
    navigate('/checkout');
  };

  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const elem = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = elem.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
    });
  };

  const handleReviewPhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (reviewPhotos.length + files.length > 3) {
      alert('You can upload a maximum of 3 saree drape photos.');
      return;
    }

    for (const file of files) {
      const compressed = await compressImageFile(file);
      if (compressed) {
        setReviewPhotos((prev) => [...prev, compressed]);
      }
    }
  };

  const handleRemovePhoto = (index) => {
    setReviewPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleReviewTag = (tag) => {
    setReviewTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalItem || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const prodId = reviewModalItem.product?._id || reviewModalItem.product;
      const combinedComment = reviewTags.length > 0 
        ? `${reviewComment.trim()}\n\nHighlights: ${reviewTags.join(' • ')}`
        : reviewComment.trim();

      await productsApi.addReview(prodId, {
        name: user?.name || 'Verified Buyer',
        rating: reviewRating,
        comment: combinedComment,
        images: reviewPhotos,
        productTitle: reviewModalItem.title,
        color: reviewModalItem.color,
      });

      setReviewSuccessMsg('Your verified review and drape photos were published!');
      setTimeout(() => {
        setReviewModalItem(null);
        setReviewComment('');
        setReviewPhotos([]);
        setReviewTags([]);
        setReviewSuccessMsg('');
      }, 1800);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Demo status advancement trigger
  const handleSimulateNextStep = async (order) => {
    const stepKeys = trackingSteps.map(s => s.key);
    const currIdx = stepKeys.indexOf(order.orderStatus);
    if (currIdx < stepKeys.length - 1) {
      const nextStatus = stepKeys[currIdx + 1];
      try {
        await ordersApi.updateStatus(order._id, {
          status: nextStatus,
          note: `Shipment advanced to ${nextStatus}`,
          location: nextStatus === 'Delivered' ? 'Customer Address, Hyderabad' : 'Express Courier Hub',
        });
        fetchOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-300 text-sky-800 text-[11px] font-bold px-3 py-1 rounded-full animate-pulse shadow-2xs">
            <Truck size={13} className="text-sky-600" />
            <span>{status === 'Out for Delivery' ? 'Out for Delivery 🚀' : 'In Transit 🚚'}</span>
          </span>
        );
      case 'Packed':
      case 'Confirmed':
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
            <Clock size={13} className="text-amber-600" />
            <span>{status} (Processing)</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-300 text-red-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
            <XCircle size={13} className="text-red-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-[11px] font-bold px-3 py-1 rounded-full">
            <Clock size={13} />
            <span>{status || 'Processing'}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-12">
        <div className="container max-w-4xl space-y-4">
          <div className="h-24 bg-white rounded-3xl animate-pulse border border-[#E8E2D9]"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-56 bg-white rounded-3xl animate-pulse border border-[#E8E2D9]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="container max-w-4xl space-y-6">
        
        {/* Hero Banner Header */}
        <div className="relative bg-gradient-to-r from-[#700B1A] via-[#851325] to-[#4A0510] text-white p-7 sm:p-8 rounded-3xl shadow-xl overflow-hidden border border-red-900/50">
          {/* Decorative Ambient Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                <Award size={12} />
                <span>Handloom Silk Tracker & Receipts</span>
              </div>
              <h1 className="font-royal text-2xl sm:text-3xl font-bold tracking-wide">
                My Orders & Deliveries
              </h1>
              <p className="text-xs text-amber-100/80 mt-1 max-w-xl leading-relaxed">
                Track live courier dispatches, print official tax invoices, write verified reviews with photos, and get 24/7 weaver support.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                to="/shop"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ShoppingBag size={14} />
                <span>Shop More Sarees</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive Search & Filter Controls */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#700B1A] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>All Orders</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {tabCounts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('in-transit')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'in-transit'
                  ? 'bg-[#700B1A] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>🚚 Live In-Transit</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'in-transit' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {tabCounts.inTransit}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'delivered'
                  ? 'bg-[#700B1A] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>✅ Delivered</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'delivered' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {tabCounts.delivered}
              </span>
            </button>

            {tabCounts.cancelled > 0 && (
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'cancelled'
                    ? 'bg-[#700B1A] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>❌ Cancelled</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'cancelled' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {tabCounts.cancelled}
                </span>
              </button>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order # or saree..."
              className="w-full pl-9 pr-7 py-1.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E8E2D9] p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto text-2xl">
              🛍️
            </div>
            <h3 className="font-royal text-xl font-bold text-gray-900">
              {searchQuery ? 'No Orders Matched Your Search' : 'No Orders Found'}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {searchQuery ? 'Try searching with a different order number or clear your search term.' : 'You haven’t placed any orders in this tab yet. Explore our handcrafted Dharmavaram & Gadwal silks.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
                >
                  Clear Search Filter
                </button>
              )}
              <Link to="/shop" className="bg-[#700B1A] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-[#580816] transition-all">
                Browse Silk Sarees
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const currentStepIdx = trackingSteps.findIndex((s) => s.key === order.orderStatus);
              const isExpanded = expandedOrderId === order._id;
              const isDelivered = order.orderStatus === 'Delivered';
              const isCancelled = order.orderStatus === 'Cancelled';

              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? 'border-[#700B1A]/50 shadow-lg ring-1 ring-[#700B1A]/20' 
                      : 'border-[#E8E2D9] shadow-xs hover:border-gray-400'
                  }`}
                >
                  {/* Order Summary Header Bar */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 text-xs">
                    
                    {/* Order ID & Date */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#700B1A]/10 text-[#700B1A] flex items-center justify-center shrink-0">
                        <Package size={20} />
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">Order Number</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900 font-mono text-sm font-bold">{order.orderNumber}</strong>
                          <span className="text-[10px] text-gray-400">•</span>
                          <span className="text-gray-600 font-medium text-[11px]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Status */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block text-right">Total Bill</span>
                        <strong className="text-[#700B1A] font-extrabold text-sm block">
                          ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.orderStatus)}
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                          className="p-1.5 bg-white border border-gray-200 hover:border-gray-400 rounded-xl text-gray-600 transition-all cursor-pointer shadow-2xs"
                          title={isExpanded ? 'Collapse Tracking Details' : 'Expand Live Tracking'}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Sarees List */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <Link to={`/product/${item.product?._id || item.product}`} className="group shrink-0 relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-20 rounded-2xl object-cover bg-gray-100 border border-gray-200 group-hover:scale-105 transition-transform duration-300 shadow-2xs"
                            />
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-bold">
                              ×{item.quantity}
                            </span>
                          </Link>
                          <div className="space-y-1">
                            <Link
                              to={`/product/${item.product?._id || item.product}`}
                              className="font-bold text-gray-900 text-sm hover:text-[#700B1A] transition-colors line-clamp-1 block"
                            >
                              {item.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                              <span className="bg-[#FAF8F5] border border-gray-200 px-2 py-0.5 rounded-md font-medium text-gray-700">
                                Color: {item.color || 'Peacock Blue'}
                              </span>
                              <span>•</span>
                              <span>Qty: <strong>{item.quantity}</strong></span>
                              <span>•</span>
                              <span className="font-bold text-[#700B1A] text-xs">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Quick Silk Care Trigger */}
                            <button
                              type="button"
                              onClick={() => setSilkCareModalItem(item)}
                              className="text-[11px] text-[#D97706] hover:underline font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              <Sparkles size={11} />
                              <span>Pure Silk Washing & Storage Guide</span>
                            </button>
                          </div>
                        </div>

                        {/* Item Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto pt-2 sm:pt-0">
                          {/* Buy Again / Reorder */}
                          <button
                            type="button"
                            onClick={() => handleReorder(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E5DDD0] rounded-xl text-gray-700 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <RotateCcw size={12} className="text-[#700B1A]" />
                            <span>Buy Again</span>
                          </button>

                          {/* Rate & Review Button */}
                          {isDelivered ? (
                            <button
                              onClick={() => {
                                setReviewModalItem(item);
                                setReviewRating(5);
                                setReviewHoverRating(0);
                                setReviewComment('');
                                setReviewPhotos([]);
                                setReviewTags([]);
                                setReviewSuccessMsg('');
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                            >
                              <Star size={13} className="fill-white text-white" />
                              <span>Rate & Add Drape Photos</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-xl">
                              <ShieldCheck size={12} />
                              <span>Review unlocks after delivery</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Live Tracking Timeline Section */}
                  {!isCancelled && (
                    <div className="p-5 sm:p-6 bg-gradient-to-b from-white via-[#FAF8F5] to-white border-t border-[#E8E2D9]">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
                            <Truck size={14} />
                          </div>
                          <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                            Interactive Delivery Progress
                          </h4>
                        </div>

                        {/* Dev / Interactive Simulation Trigger */}
                        {currentStepIdx < trackingSteps.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleSimulateNextStep(order)}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#700B1A] bg-[#700B1A]/5 hover:bg-[#700B1A]/10 border border-[#700B1A]/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                            title="Simulate next delivery checkpoint in real-time"
                          >
                            <RefreshCw size={11} className="animate-spin" />
                            <span>Simulate Next Step (Live Demo)</span>
                          </button>
                        )}
                      </div>

                      {/* Step Progress Bar with Active Pulse */}
                      <div className="relative flex items-center justify-between max-w-2xl mx-auto my-6 px-3">
                        {/* Connecting track line */}
                        <div className="absolute left-6 right-6 top-4 h-1.5 bg-gray-200 rounded-full -z-0">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-xs"
                            style={{
                              width: `${Math.max(0, (currentStepIdx / (trackingSteps.length - 1)) * 100)}%`,
                            }}
                          ></div>
                        </div>

                        {trackingSteps.map((step, idx) => {
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={idx} className="relative z-10 flex flex-col items-center group cursor-pointer">
                              <div
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                } ${isCurrent ? 'ring-4 ring-emerald-200 scale-110 animate-bounce' : ''}`}
                              >
                                {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] sm:text-xs mt-2 font-bold text-center whitespace-nowrap transition-colors ${
                                  isCurrent
                                    ? 'text-emerald-800 font-extrabold underline decoration-emerald-500'
                                    : isDone
                                    ? 'text-gray-800'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="hidden sm:block text-[9px] text-gray-400 text-center max-w-[90px] mt-0.5 leading-tight">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Checkpoint Log (Expanded View) */}
                      {isExpanded && (
                        <div className="mt-6 pt-5 border-t border-gray-200/80 bg-white/70 rounded-2xl p-4 space-y-3">
                          <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#700B1A]" />
                            <span>Courier Checkpoints & Live Location Logs</span>
                          </h5>
                          
                          <div className="space-y-2.5">
                            {(order.trackingUpdates && order.trackingUpdates.length > 0) ? (
                              order.trackingUpdates.map((log, lIdx) => (
                                <div key={lIdx} className="flex items-start gap-2.5 text-xs text-gray-600 bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-200/70">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <strong className="text-gray-900 font-semibold">{log.status}</strong>
                                      <span className="text-[10px] text-gray-400 font-mono">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-600 mt-0.5">{log.note || 'Checkpoint registered'}</p>
                                    {log.location && (
                                      <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                        📍 {log.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500 p-2 bg-[#FAF8F5] rounded-xl">
                                📦 Order received at Hyderabad central packing hub. Courier tracking AWB will be updated shortly.
                              </div>
                            )}
                          </div>

                          {/* Shipping Address Summary */}
                          <div className="mt-3 p-3 bg-amber-50/50 border border-amber-200/70 rounded-xl text-xs text-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-amber-900 uppercase block">Delivery Destination</span>
                              <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone}) — {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </div>
                            <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-1 rounded-lg shrink-0">
                              🚚 Fast Handloom Courier
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order Footer Actions */}
                  <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-[11px]">
                        Payment: <strong>{order.paymentMethod || 'UPI / Online'}</strong> {order.isPaid ? '(Paid ✅)' : '(COD)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View & Print Tax Invoice */}
                      <button
                        type="button"
                        onClick={() => setInvoiceModalOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-500 rounded-xl text-gray-800 font-semibold text-xs transition-all shadow-2xs cursor-pointer"
                      >
                        <Printer size={13} className="text-gray-600" />
                        <span>Print Tax Invoice</span>
                      </button>

                      {/* WhatsApp Support Direct Order Inquiry */}
                      <a
                        href={`https://wa.me/919394512326?text=${encodeURIComponent(
                          `Namaste Sri Vijaylaxmi Textiles, I need assistance regarding my saree order #${order.orderNumber} (Amount: ₹${order.totalPrice}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs rounded-xl transition-all shadow-2xs"
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp Help</span>
                      </a>

                      {/* Cancel Order (Only if not shipped yet) */}
                      {['Placed', 'Confirmed'].includes(order.orderStatus) && (
                        <button
                          onClick={() => setCancelModalOrderId(order._id)}
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 🧾 ROYAL PRINTABLE TAX INVOICE MODAL */}
      {/* ------------------------------------------------------------- */}
      {invoiceModalOrder && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setInvoiceModalOrder(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Invoice Top Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 print:hidden">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-[#700B1A]" />
                <h3 className="font-royal text-lg font-bold text-gray-900">Official Tax Invoice & Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#700B1A] text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-[#580816] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Printer size={13} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setInvoiceModalOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-black rounded-xl hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Invoice Printable Document */}
            <div className="p-4 sm:p-6 border border-gray-200 rounded-2xl bg-white space-y-6 text-xs text-gray-800">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <img src={logoImg} alt="Sri Vijaylaxmi" className="h-12 w-auto object-contain mb-2" />
                  <h4 className="font-royal font-bold text-base text-gray-900">Sri Vijay Laxmi Textiles (India) Pvt Ltd</h4>
                  <p className="text-[11px] text-gray-500">
                    21-1-667/5/B, God Gift Market, First Floor, Rikab Gunj, Hyderabad - 500002<br />
                    GSTIN: <strong>36AAACS1234F1Z8</strong> | Care: +91 93945 12326
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block mb-1">
                    Tax Invoice
                  </span>
                  <p className="font-mono font-bold text-sm text-gray-900">{invoiceModalOrder.orderNumber}</p>
                  <p className="text-[11px] text-gray-500">
                    Date: {new Date(invoiceModalOrder.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] p-3 rounded-xl">
                <div>
                  <strong className="text-gray-900 block mb-0.5">Billed & Shipped To:</strong>
                  <p className="text-gray-700 font-semibold">{invoiceModalOrder.shippingAddress?.fullName}</p>
                  <p className="text-gray-500 text-[11px]">{invoiceModalOrder.shippingAddress?.phone}</p>
                  <p className="text-gray-500 text-[11px]">
                    {invoiceModalOrder.shippingAddress?.street}, {invoiceModalOrder.shippingAddress?.city}, {invoiceModalOrder.shippingAddress?.state} - {invoiceModalOrder.shippingAddress?.pincode}
                  </p>
                </div>

                <div className="text-right">
                  <strong className="text-gray-900 block mb-0.5">Payment Details:</strong>
                  <p className="text-gray-700 font-semibold">Method: {invoiceModalOrder.paymentMethod || 'UPI / Online'}</p>
                  <p className="text-emerald-700 font-bold text-[11px]">
                    Status: {invoiceModalOrder.isPaid ? 'Payment Received (PAID)' : 'Cash on Delivery (Pending)'}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-500 text-[11px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price (₹)</th>
                    <th className="py-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoiceModalOrder.orderItems?.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-semibold text-gray-800">
                        {it.title} <span className="text-[10px] text-gray-500 font-normal">({it.color || 'Standard'})</span>
                      </td>
                      <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                      <td className="py-2.5 text-right font-mono">₹{Number(it.price).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right font-mono font-bold">
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Breakdown */}
              <div className="border-t border-gray-200 pt-3 space-y-1.5 max-w-xs ml-auto text-right">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">₹{Number(invoiceModalOrder.itemsPrice || invoiceModalOrder.totalPrice).toLocaleString('en-IN')}</span>
                </div>
                {invoiceModalOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Coupon ({invoiceModalOrder.couponCode}):</span>
                    <span className="font-mono font-semibold">-₹{Number(invoiceModalOrder.discountAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Insured Express Shipping:</span>
                  <span className="font-mono text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (Included 5%):</span>
                  <span className="font-mono font-semibold">₹{Math.round((invoiceModalOrder.totalPrice || 0) * 0.05).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#700B1A] border-t border-gray-300 pt-2">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono font-black">₹{Number(invoiceModalOrder.totalPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Signature Stamp Footer */}
              <div className="border-t border-dashed border-gray-300 pt-4 flex items-center justify-between text-[10px] text-gray-400">
                <p>This is a computer generated tax invoice. Handloom certified by Sri Vijay Laxmi Textiles.</p>
                <div className="text-right">
                  <span className="font-royal text-xs font-bold text-[#700B1A] block">Sri Vijay Laxmi Textiles</span>
                  <span>Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 🥻 PURE SILK CARE GUIDE POPUP */}
      {/* ------------------------------------------------------------- */}
      {silkCareModalItem && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSilkCareModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E8E2D9] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#D97706]" />
                <h3 className="font-royal font-bold text-gray-900 text-sm">Heritage Silk Care & Longevity Guide</h3>
              </div>
              <button onClick={() => setSilkCareModalItem(null)} className="p-1 text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70">
                <strong className="text-amber-900 font-bold block mb-1">🧼 1. Washing & Cleansing:</strong>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Always dry clean your pure zari silk saree for the first 2-3 washes to preserve metallic zari sheen.
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                <strong className="text-gray-800 font-bold block mb-1">📦 2. Storage in Muslin Cloth:</strong>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Wrap in pure cotton or muslin fabric. Avoid plastic covers to let the silk breathe and prevent moisture damage.
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                <strong className="text-gray-800 font-bold block mb-1">🔄 3. Periodic Refolding:</strong>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Unfold and change the fold creases every 3-4 months to prevent permanent zari creasing along the border.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSilkCareModalItem(null)}
              className="w-full bg-[#700B1A] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#580816] transition-all cursor-pointer"
            >
              Got it, Close Guide
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ⭐ RATE & ADD DRAPE PHOTOS MODAL */}
      {/* ------------------------------------------------------------- */}
      {reviewModalItem && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setReviewModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#E8E2D9] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={reviewModalItem.image}
                  alt=""
                  className="w-11 h-14 rounded-xl object-cover border border-gray-200 shadow-2xs"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                    Verified Buyer Review
                  </span>
                  <h3 className="font-royal font-bold text-gray-900 text-sm line-clamp-1 mt-0.5">
                    {reviewModalItem.title}
                  </h3>
                </div>
              </div>
              <button onClick={() => setReviewModalItem(null)} className="p-1 text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">{reviewSuccessMsg}</h4>
                <p className="text-xs text-emerald-700">Thank you for sharing your drape experience with our weaver family!</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                
                {/* Interactive Star Rating */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Your Rating & Saree Feel</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={
                            star <= (reviewHoverRating || reviewRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-xs text-gray-700">
                      {reviewRating === 5 ? '⭐⭐⭐⭐⭐ Royal Masterpiece' :
                       reviewRating === 4 ? '⭐⭐⭐⭐ Great Silk Quality' :
                       reviewRating === 3 ? '⭐⭐⭐ Average' : '⭐ Fair'}
                    </span>
                  </div>
                </div>

                {/* Quick Highlight Tags */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Quick Highlights (Tap to add)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickReviewTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleReviewTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          reviewTags.includes(tag)
                            ? 'bg-[#700B1A] text-white border-[#700B1A]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saree Drape Photo Upload */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Upload Saree Drape Photos (Optional, Max 3)
                  </label>

                  <label className="border-2 border-dashed border-amber-400 bg-amber-50/40 hover:bg-amber-50 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center">
                    <Camera size={18} className="text-amber-700" />
                    <span className="text-xs font-bold text-amber-900">Add saree drape photos</span>
                    <span className="text-[10px] text-gray-400">JPG, PNG from camera or gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleReviewPhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Previews */}
                  {reviewPhotos.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {reviewPhotos.map((photo, idx) => (
                        <div key={idx} className="relative w-14 h-16 rounded-xl overflow-hidden border border-gray-300 shadow-xs">
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Your Detailed Experience</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe fabric softness, border zari shine, color in natural light, delivery packing..."
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#700B1A]"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setReviewModalItem(null)}
                    className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="bg-[#700B1A] hover:bg-[#580816] text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>{reviewSubmitting ? 'Publishing...' : 'Publish Verified Review'}</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ❌ CANCEL ORDER MODAL */}
      {/* ------------------------------------------------------------- */}
      {cancelModalOrderId && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setCancelModalOrderId(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E8E2D9] space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-red-600">
              <XCircle size={22} />
              <h3 className="font-royal text-lg font-bold text-gray-900">Cancel Saree Order</h3>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to cancel this order? If paid online via UPI/Card, the full refund will be automatically processed back to your original source in 2-3 business days.
            </p>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#700B1A] bg-[#FAF8F5]"
              >
                <option value="Changed my mind">Changed my mind / Want different color</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time too long">Delivery time too long</option>
                <option value="Found alternative in store">Found alternative in store</option>
                <option value="Incorrect shipping address">Incorrect shipping address</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setCancelModalOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
              >
                Keep My Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrdersPage;
