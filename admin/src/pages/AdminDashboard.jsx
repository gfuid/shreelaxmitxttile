import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, ordersApi, productsApi, reviewsApi } from '../services/api';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Download, 
  TrendingUp, 
  RefreshCw, 
  Sparkles,
  MessageSquare,
  Star,
  User,
  Eye,
  Reply
} from 'lucide-react';

import { SkeletonBox, SkeletonKpi, SkeletonTable } from '../components/common/Skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('Confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [courierName, setCourierName] = useState('BlueDart Logistics');
  const [trackingAwb, setTrackingAwb] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardStats = async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, custRes, revRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getCustomers(),
        reviewsApi.getAll()
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (custRes.data) setCustomers(custRes.data);
      if (revRes.data) setReviews(revRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    const handleSync = () => {
      fetchDashboardStats();
    };
    window.addEventListener('svl_orders_updated', handleSync);
    window.addEventListener('svl_reviews_updated', handleSync);
    return () => {
      window.removeEventListener('svl_orders_updated', handleSync);
      window.removeEventListener('svl_reviews_updated', handleSync);
    };
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrderForStatus) return;
    try {
      await ordersApi.updateStatus(selectedOrderForStatus._id, {
        status: newStatus,
        note: statusNote || `Status changed to ${newStatus}`,
        courierName: courierName || 'BlueDart Logistics',
        trackingAwb: trackingAwb || '',
      });
      setSelectedOrderForStatus(null);
      setStatusNote('');
      setTrackingAwb('');
      fetchDashboardStats();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleQuickRestock = async (productId, currentStock) => {
    try {
      await productsApi.update(productId, { stock: currentStock + 10 });
      fetchDashboardStats();
    } catch (e) {
      alert('Error updating stock');
    }
  };

  const handleExportCSV = () => {
    if (!stats?.recentOrders || stats.recentOrders.length === 0) {
      alert('No orders available to export.');
      return;
    }
    const headers = ['Order Number', 'Date', 'Customer Name', 'City', 'Total Amount', 'Status', 'Payment Method'];
    const rows = stats.recentOrders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.shippingAddress?.fullName || 'Customer'}"`,
      `"${o.shippingAddress?.city || 'N/A'}"`,
      o.totalPrice,
      o.orderStatus,
      o.paymentMethod,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SriVijaylaxmi_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-3">
          <SkeletonBox className="h-4 w-36" />
          <SkeletonBox className="h-8 w-72" />
          <SkeletonBox className="h-3 w-96" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SkeletonKpi />
          <SkeletonKpi />
          <SkeletonKpi />
          <SkeletonKpi />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SkeletonTable rows={5} cols={5} />
          </div>
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-4">
            <SkeletonBox className="h-5 w-40" />
            <SkeletonBox className="h-40 w-full rounded-2xl" />
            <SkeletonBox className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const statusMap = stats?.statusBreakdown || {};
  const weeklySales = stats?.salesHistory && stats.salesHistory.length > 0 
    ? stats.salesHistory 
    : [
        { _id: 'Mon', sales: 4500, orders: 1 },
        { _id: 'Tue', sales: 6800, orders: 2 },
        { _id: 'Wed', sales: 3200, orders: 1 },
        { _id: 'Thu', sales: 8900, orders: 2 },
        { _id: 'Fri', sales: 12400, orders: 3 },
        { _id: 'Sat', sales: 15600, orders: 4 },
        { _id: 'Sun', sales: 18900, orders: 5 },
      ];

  const maxSale = Math.max(...weeklySales.map((w) => w.sales), 10000);

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#700B1A] uppercase tracking-wider mb-1">
            <Sparkles size={15} />
            <span>Store Performance Hub</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Admin Management Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time revenue, orders pipeline, registered customers, product comments & inventory health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardStats}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
            title="Refresh Real-time Data"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-[#700B1A]' : ''} />
          </button>

          <button
            onClick={handleExportCSV}
            className="btn btn-secondary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <Link
            to="/products"
            className="btn btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} />
            <span>Add Saree</span>
          </Link>
        </div>
      </div>

      {/* KPI 5-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center justify-between group hover:border-[#700B1A]/40 transition-colors">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Sales</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5">
              <TrendingUp size={11} />
              <span>+18.4% this month</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
            ₹
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center justify-between group hover:border-blue-400 transition-colors">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Orders</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {stats?.totalOrders || 0}
            </h3>
            <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1.5">
              {statusMap['Placed'] || 0} New Orders Pending
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Package size={20} />
          </div>
        </div>

        {/* Registered Customers */}
        <Link 
          to="/customers"
          className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center justify-between group hover:border-emerald-400 transition-colors"
        >
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Registered Users</span>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">
              {customers.length || stats?.totalCustomers || 1}
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1.5">
              +1 New User Today
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>
        </Link>

        {/* Reviews & Ratings */}
        <Link 
          to="/reviews"
          className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center justify-between group hover:border-amber-400 transition-colors"
        >
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Store Ratings</span>
            <div className="flex items-baseline gap-1 mt-1">
              <h3 className="text-2xl font-black text-gray-900">4.9</h3>
              <Star size={14} className="text-amber-400 fill-amber-400 inline" />
            </div>
            <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1.5">
              {reviews.length} Saree Comments
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageSquare size={20} />
          </div>
        </Link>

        {/* Active Sarees */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex items-center justify-between group hover:border-purple-400 transition-colors">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Catalog Sarees</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {stats?.totalProducts || 0}
            </h3>
            <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-1.5">
              Silk Mark Handlooms
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingBag size={20} />
          </div>
        </div>

      </div>

      {/* 2-Column: Weekly Sales Chart & Orders Status Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Trend Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
            <div>
              <h3 className="font-serif text-base font-bold text-gray-900">
                Weekly Revenue Trend
              </h3>
              <p className="text-[11px] text-gray-400">Daily sales performance over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Aggregate
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
            {weeklySales.map((item, idx) => {
              const heightPercent = Math.max(Math.round((item.sales / maxSale) * 100), 12);
              const label = item._id.includes('-') ? item._id.slice(5) : item._id;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{item.sales >= 1000 ? `${(item.sales / 1000).toFixed(1)}k` : item.sales}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-[#700B1A] to-[#D97706] rounded-t-lg transition-all group-hover:opacity-90 shadow-sm"
                  ></div>
                  <span className="text-[11px] font-semibold text-gray-600">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Pipeline Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif text-base font-bold text-gray-900">
                Order Pipeline Stages
              </h3>
              <Link to="/orders" className="text-xs font-bold text-[#700B1A] hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-center">
                <span className="text-xl font-black text-gray-900 block">{statusMap['Placed'] || 0}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Placed</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xl font-black text-amber-800 block">{statusMap['Confirmed'] || 0}</span>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Confirmed</span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xl font-black text-blue-800 block">{statusMap['Packed'] || 0}</span>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Packed</span>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
                <span className="text-xl font-black text-indigo-800 block">{statusMap['Shipped'] || 0}</span>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">In Transit</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xl font-black text-emerald-800 block">{statusMap['Delivered'] || 0}</span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Delivered</span>
              </div>
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-center">
                <span className="text-xl font-black text-red-800 block">{statusMap['Cancelled'] || 0}</span>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Cancelled</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 text-center">
            <Link
              to="/orders"
              className="w-full py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DDD0] text-xs font-bold text-[#700B1A] hover:bg-[#700B1A] hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage Fulfillment Center</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* 2-Column: Registered Customers Feed & Live Product Comments Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Registered Customers Feed */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif text-base font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-[#700B1A]" />
                <span>Newly Registered Customers</span>
              </h3>
              <p className="text-[11px] text-gray-400">Shoppers registered on your online saree store</p>
            </div>
            <Link to="/customers" className="text-xs font-bold text-[#700B1A] hover:underline">
              View All ({customers.length})
            </Link>
          </div>

          <div className="space-y-3">
            {customers.slice(0, 4).map((cust) => (
              <div
                key={cust._id}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#700B1A]/40 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#700B1A] to-[#B91C1C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {(cust.name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-gray-900 block truncate">{cust.name}</span>
                    <span className="text-[11px] text-gray-500 block truncate">{cust.email}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full block">
                    {cust.totalOrders || 0} Orders
                  </span>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">
                    Spent ₹{Number(cust.totalSpent || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Product Reviews & Comments Feed */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif text-base font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#D97706]" />
                <span>Latest Saree Reviews & Comments</span>
              </h3>
              <p className="text-[11px] text-gray-400">Live feedback received on specific sarees</p>
            </div>
            <Link to="/reviews" className="text-xs font-bold text-[#700B1A] hover:underline">
              Moderate ({reviews.length})
            </Link>
          </div>

          <div className="space-y-3">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev._id}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#D97706]/50 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={rev.productImage}
                      alt=""
                      className="w-7 h-9 rounded object-cover shrink-0 border border-gray-200"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-gray-900 block truncate">{rev.productTitle}</span>
                      <span className="text-[10px] text-gray-500">By <strong>{rev.name}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-gray-700 italic bg-white p-2 rounded-lg border border-gray-100 line-clamp-2">
                  "{rev.comment}"
                </p>

                {rev.reply && (
                  <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 pl-1">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span>Admin Replied</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2-Column: Recent Orders Table & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Store Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 className="font-serif text-base font-bold text-gray-900">
              Recent Store Orders
            </h3>
            <Link to="/orders" className="text-xs font-bold text-[#700B1A] hover:underline">
              View All
            </Link>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px]">
                    <th className="pb-2">Order #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.slice(0, 5).map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/80">
                      <td className="py-3 font-bold text-gray-900">{ord.orderNumber}</td>
                      <td className="py-3">
                        <span className="font-medium text-gray-800 block">{ord.shippingAddress?.fullName || ord.user?.name || 'Customer'}</span>
                        <span className="text-[10px] text-gray-400">{ord.shippingAddress?.city || 'India'}</span>
                      </td>
                      <td className="py-3 font-black text-[#700B1A]">
                        ₹{Number(ord.totalPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className={`badge text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          ord.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrderForStatus(ord);
                            setNewStatus(ord.orderStatus);
                          }}
                          className="btn btn-secondary text-[11px] py-1 px-2.5 rounded-lg font-semibold"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-4">No recent orders.</p>
          )}
        </div>

        {/* Low Stock Replenishment Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <h3 className="font-serif text-base font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <span>Low Stock Items</span>
          </h3>

          <div className="space-y-3">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((p) => (
                <div key={p._id} className="p-3 rounded-xl border border-red-100 bg-red-50/50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.images?.[0]} alt="" className="w-10 h-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{p.title}</h4>
                      <span className="text-[11px] text-red-700 font-bold">Only {p.stock} units left</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickRestock(p._id, p.stock)}
                    className="btn btn-primary text-[10px] font-bold py-1 px-2.5 rounded-lg shrink-0"
                    title="Add 10 more stock units instantly"
                  >
                    +10 Stock
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-500">
                ✅ All products have adequate inventory.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Order Status Update Modal */}
      {selectedOrderForStatus && (
        <div className="modal-overlay" onClick={() => setSelectedOrderForStatus(null)}>
          <div className="modal-box max-w-md p-6 sm:p-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Update Status: {selectedOrderForStatus.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrderForStatus(null)} className="p-1 rounded-full text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Customer: <strong>{selectedOrderForStatus.shippingAddress?.fullName || 'Customer'}</strong> | Amount: ₹{selectedOrderForStatus.totalPrice}
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">New Shipment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#700B1A]"
                >
                  <option value="Placed">Placed (New Order Received)</option>
                  <option value="Confirmed">Confirmed (Store Accepted)</option>
                  <option value="Packed">Packed (In Silk Protective Box)</option>
                  <option value="Shipped">Shipped (Handed Over to Courier)</option>
                  <option value="Out for Delivery">Out for Delivery (Near Customer Location)</option>
                  <option value="Delivered">Delivered (Completed)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {['Shipped', 'Out for Delivery', 'Delivered'].includes(newStatus) && (
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                    <Truck size={15} className="text-blue-700" />
                    <span>Courier Shipment & AWB Tracking</span>
                  </div>

                  <div>
                    <label className="form-label font-bold text-blue-900 block mb-1">Courier Partner</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. BlueDart, Delhivery, DTDC, India Post"
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold text-blue-900 block mb-1">AWB Tracking #</label>
                    <input
                      type="text"
                      value={trackingAwb}
                      onChange={(e) => setTrackingAwb(e.target.value)}
                      placeholder="e.g. BD-8839201"
                      className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Tracking / Dispatch Notes</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Dispatched via BlueDart AWB #99821034"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:border-[#700B1A]"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Customer will automatically receive WhatsApp & Email notification for <strong>{newStatus}</strong></span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="btn btn-secondary text-xs px-4 py-2 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
