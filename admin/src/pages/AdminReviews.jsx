import React, { useState, useEffect } from 'react';
import { reviewsApi, productsApi } from '../services/api';
import { 
  Star, 
  MessageSquare, 
  Search, 
  Trash2, 
  Reply, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Filter,
  User,
  ShoppingBag,
  Clock,
  Send,
  X
} from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [productsList, setProductsList] = useState([]);
  
  // Reply modal / inline state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetchReviewsData = async () => {
    try {
      const [revRes, prodRes] = await Promise.all([
        reviewsApi.getAll(),
        productsApi.getAll()
      ]);
      if (revRes.data) setReviews(revRes.data);
      if (prodRes.data) setProductsList(prodRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();

    // Auto-poll every 8s for live review updates
    const pollInterval = setInterval(() => {
      fetchReviewsData();
    }, 8000);

    const handleSync = () => {
      fetchReviewsData();
    };
    window.addEventListener('svl_reviews_updated', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('svl_reviews_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const handleSendReply = async (productId, reviewId) => {
    if (!replyText.trim()) return;
    try {
      await reviewsApi.reply(productId, reviewId, replyText.trim());
      setActionMsg('Reply published to customer review!');
      setReplyingTo(null);
      setReplyText('');
      fetchReviewsData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to post reply');
    }
  };

  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    try {
      await reviewsApi.delete(productId, reviewId);
      setActionMsg('Review deleted successfully.');
      fetchReviewsData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (r.name || '').toLowerCase().includes(q) ||
      (r.comment || '').toLowerCase().includes(q) ||
      (r.productTitle || '').toLowerCase().includes(q) ||
      (r.productSku || '').toLowerCase().includes(q);

    const matchRating = ratingFilter === 'all' || r.rating === Number(ratingFilter);
    const matchProduct = selectedProduct === 'all' || r.productId === selectedProduct;

    return matchSearch && matchRating && matchProduct;
  });

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const repliedCount = reviews.filter(r => r.reply).length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#700B1A] uppercase tracking-wider mb-1">
            <MessageSquare size={15} />
            <span>Customer Voice & Feedback</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Product Reviews & Customer Comments
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track what saree shoppers are saying across your catalog, reply to feedback & manage ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>{totalReviews} Verified Comments</span>
          </span>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="p-1 hover:text-emerald-950">
            <X size={14} />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Average Rating</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-black text-gray-900">{avgRating}</h3>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Based on {totalReviews} reviews</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Feedback</span>
          <h3 className="text-2xl font-black text-[#700B1A] mt-1">{totalReviews}</h3>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
            100% Genuine Buyers
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">5-Star Love</span>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{fiveStarCount}</h3>
          <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
            {totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 100}% Top Rated
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Admin Replies</span>
          <h3 className="text-2xl font-black text-blue-700 mt-1">{repliedCount}</h3>
          <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
            Active Store Engagement
          </span>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex flex-col md:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, saree name, SKU or comment keyword..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
          />
        </div>

        {/* Product Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full py-2 px-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#700B1A]"
          >
            <option value="all">All Saree Catalog ({productsList.length})</option>
            {productsList.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title.length > 30 ? p.title.slice(0, 30) + '...' : p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="w-full md:w-44">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full py-2 px-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#700B1A]"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        </div>

      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E2D9]">
          <div className="w-8 h-8 border-4 border-[#700B1A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-gray-500 font-medium">Loading customer reviews and comments...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E2D9]">
          <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-gray-800">No Reviews Found</h3>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search keyword or star filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-xs hover:border-[#700B1A]/40 transition-all space-y-4"
            >
              {/* Product Header & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-3">
                
                {/* Product details */}
                <div className="flex items-center gap-3">
                  <img
                    src={rev.productImage}
                    alt={rev.productTitle}
                    className="w-12 h-14 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-amber-50 px-2 py-0.5 rounded">
                        {rev.productCategory || 'Saree'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        SKU: {rev.productSku || 'SVL-001'}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base mt-0.5 line-clamp-1">
                      {rev.productTitle}
                    </h4>
                  </div>
                </div>

                {/* Rating Stars & Timestamp */}
                <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200 fill-gray-100'
                        }
                      />
                    ))}
                    <span className="font-bold text-xs text-gray-700 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={11} />
                    <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </span>
                </div>

              </div>

              {/* Review Content & Customer Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#700B1A] to-[#B91C1C] text-white flex items-center justify-center font-bold text-xs">
                    {(rev.name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-gray-900 block leading-tight">
                      {rev.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={10} /> Verified Saree Purchaser
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#F0EAE1] leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {/* Customer Uploaded Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                      📸 Customer Drape Photos ({rev.images.length})
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {rev.images.map((imgUrl, i) => (
                        <a
                          key={i}
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-14 h-16 rounded-xl overflow-hidden border-2 border-amber-300 shadow-xs block hover:scale-105 transition-transform"
                          title="Click to view high-res drape photo"
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Existing Admin Reply */}
              {rev.reply && (
                <div className="ml-4 sm:ml-8 pl-4 border-l-2 border-[#D97706] bg-[#FFFBEB] p-3.5 rounded-r-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#92400E] flex items-center gap-1.5 text-[11px]">
                      <Reply size={12} className="rotate-180" />
                      <span>Sri Vijaylaxmi Official Response</span>
                    </span>
                    <span className="text-[10px] text-amber-800/70 font-semibold">Store Manager</span>
                  </div>
                  <p className="text-gray-800 text-xs leading-relaxed">
                    {rev.reply}
                  </p>
                </div>
              )}

              {/* Inline Reply Input or Action Bar */}
              {replyingTo === rev._id ? (
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 animate-fadeIn">
                  <label className="text-xs font-bold text-gray-700 block">
                    Write Official Store Reply to {rev.name}:
                  </label>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="e.g. Thank you for your feedback! We are delighted that you loved the handloom zari finish."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#700B1A]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(rev.productId, rev._id)}
                      className="btn btn-primary text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                      <Send size={13} />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => {
                      setReplyingTo(rev._id);
                      setReplyText(rev.reply || '');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#700B1A] hover:text-[#4A0E17] hover:underline"
                  >
                    <Reply size={13} />
                    <span>{rev.reply ? 'Edit Official Reply' : 'Reply as Admin'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteReview(rev.productId, rev._id)}
                    className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Delete Review"
                  >
                    <Trash2 size={13} />
                    <span>Moderate</span>
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminReviews;
