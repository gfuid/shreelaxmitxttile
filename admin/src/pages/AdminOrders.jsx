import React, { useState, useEffect, useMemo } from 'react';
import { ordersApi } from '../services/api';
import { 
  Package, 
  Search, 
  Filter, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Printer, 
  Eye, 
  Edit3,
  MapPin,
  Calendar,
  X,
  Download,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CalendarRange,
  Clock,
  TrendingUp,
  CreditCard,
  Layers,
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react';
import { SkeletonTable, SkeletonKpi, SkeletonBox } from '../components/common/Skeleton';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Time & Date Range Filters
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // all, today, yesterday, this_week, this_month, this_year, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Grouping Mode
  const [groupingMode, setGroupingMode] = useState('date'); // 'date' (by day), 'month', 'year', 'flat'
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // Modals
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [printableInvoiceOrder, setPrintableInvoiceOrder] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('Confirmed');
  const [trackingNote, setTrackingNote] = useState('');
  const [courierName, setCourierName] = useState('BlueDart Logistics');
  const [trackingAwb, setTrackingAwb] = useState('');
  const [checkpointLocation, setCheckpointLocation] = useState('Hyderabad Fulfillment Hub');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getAllAdmin({
        search: searchTerm,
        status: statusFilter,
      });
      if (res?.data) setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-poll every 12 seconds so newly placed customer orders appear automatically
    const pollInterval = setInterval(() => {
      fetchOrders();
    }, 12000);

    const handleSync = () => {
      fetchOrders();
    };
    window.addEventListener('svl_orders_updated', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('svl_orders_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusModalOrder) return;
    try {
      await ordersApi.updateStatus(statusModalOrder._id, {
        status: updatedStatus,
        note: trackingNote || `Status updated to ${updatedStatus}`,
        location: checkpointLocation,
        courierName: courierName || 'BlueDart Logistics',
        trackingAwb: trackingAwb || '',
      });
      setStatusModalOrder(null);
      setTrackingNote('');
      setTrackingAwb('');
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const toggleGroupCollapse = (groupKey) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  // Filter Orders based on Date Range Filter
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (dateRangeFilter === 'today') {
        return orderDate >= startOfToday;
      } else if (dateRangeFilter === 'yesterday') {
        return orderDate >= startOfYesterday && orderDate < startOfToday;
      } else if (dateRangeFilter === 'this_week') {
        return orderDate >= startOfWeek;
      } else if (dateRangeFilter === 'this_month') {
        return orderDate >= startOfMonth;
      } else if (dateRangeFilter === 'this_year') {
        return orderDate >= startOfYear;
      } else if (dateRangeFilter === 'custom') {
        if (customStartDate && new Date(customStartDate) > orderDate) return false;
        if (customEndDate && new Date(customEndDate + 'T23:59:59') < orderDate) return false;
        return true;
      }
      return true; // 'all'
    });
  }, [orders, dateRangeFilter, customStartDate, customEndDate]);

  // Group Filtered Orders by Date / Month / Year
  const groupedOrders = useMemo(() => {
    if (groupingMode === 'flat') {
      return [{ key: 'all', title: 'All Filtered Orders', orders: filteredOrders, totalAmount: filteredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) }];
    }

    const groups = {};

    filteredOrders.forEach((order) => {
      const d = new Date(order.createdAt);
      let key = '';
      let title = '';

      if (groupingMode === 'date') {
        // Group by Day e.g. "2026-08-27"
        key = d.toISOString().slice(0, 10);
        const isToday = new Date().toDateString() === d.toDateString();
        const isYesterday = new Date(Date.now() - 86400000).toDateString() === d.toDateString();
        title = isToday
          ? `Today — ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
          : isYesterday
          ? `Yesterday — ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
          : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      } else if (groupingMode === 'month') {
        // Group by Month e.g. "2026-08"
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        title = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      } else if (groupingMode === 'year') {
        // Group by Year e.g. "2026"
        key = `${d.getFullYear()}`;
        title = `Year ${d.getFullYear()}`;
      }

      if (!groups[key]) {
        groups[key] = {
          key,
          title,
          orders: [],
          totalAmount: 0,
        };
      }

      groups[key].orders.push(order);
      groups[key].totalAmount += order.totalPrice || 0;
    });

    // Sort groups descending by date key
    return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
  }, [filteredOrders, groupingMode]);

  // Statistics for selected period
  const periodStats = useMemo(() => {
    const totalCount = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const aov = totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;
    const deliveredCount = filteredOrders.filter((o) => o.orderStatus === 'Delivered').length;
    const inTransitCount = filteredOrders.filter((o) => ['Shipped', 'Out for Delivery'].includes(o.orderStatus)).length;

    return { totalCount, totalRevenue, aov, deliveredCount, inTransitCount };
  }, [filteredOrders]);

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders available to export for selected filter.');
      return;
    }
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'State', 'Pincode', 'Items Count', 'Total Amount', 'Payment Method', 'Status'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.shippingAddress?.fullName || 'Customer'}"`,
      `"${o.shippingAddress?.phone || 'N/A'}"`,
      `"${o.shippingAddress?.city || 'N/A'}"`,
      `"${o.shippingAddress?.state || 'N/A'}"`,
      `"${o.shippingAddress?.pincode || 'N/A'}"`,
      o.orderItems?.length || 1,
      o.totalPrice,
      o.paymentMethod,
      o.orderStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SriVijaylaxmi_Orders_${dateRangeFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statuses = ['all', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#881337] tracking-widest block">
            Fulfillment Center & Archives
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Customer Orders & Shipments
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize orders by Date, Month & Year, update live courier checkpoints, and generate GST invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary text-xs font-bold py-2.5 px-3.5 flex items-center gap-1.5 shadow-2xs"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchOrders}
            className="btn btn-primary text-xs font-bold py-2.5 px-4 shadow-xs"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Period Analytics KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Filtered Orders</span>
            <Package size={16} className="text-[#700B1A]" />
          </div>
          <span className="text-xl font-black text-gray-900 block">{periodStats.totalCount} Orders</span>
          <span className="text-[11px] text-gray-500">In selected date range</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Period Revenue</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <span className="text-xl font-black text-emerald-800 block">₹{periodStats.totalRevenue.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Average: ₹{periodStats.aov.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Delivered</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <span className="text-xl font-black text-gray-900 block">{periodStats.deliveredCount} Orders</span>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5 font-bold">
            Completed
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">In Transit</span>
            <Truck size={16} className="text-blue-600" />
          </div>
          <span className="text-xl font-black text-gray-900 block">{periodStats.inTransitCount} Orders</span>
          <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5 font-bold">
            Live Courier Dispatch
          </span>
        </div>
      </div>

      {/* Date Horizon Filters & Grouping Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-3">
        
        {/* Time Period Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-gray-400 font-bold uppercase text-[10px] mr-1 flex items-center gap-1">
              <Calendar size={13} className="text-[#700B1A]" />
              <span>Time Period:</span>
            </span>

            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'this_week', label: 'This Week' },
              { id: 'this_month', label: 'This Month' },
              { id: 'this_year', label: 'This Year' },
              { id: 'custom', label: 'Custom Range' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setDateRangeFilter(p.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  dateRangeFilter === p.id
                    ? 'bg-[#700B1A] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Grouping View Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <Layers size={13} className="text-[#D97706]" />
              <span>Group By:</span>
            </span>

            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-gray-200 text-xs font-bold">
              <button
                onClick={() => setGroupingMode('date')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  groupingMode === 'date' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                Date / Day
              </button>
              <button
                onClick={() => setGroupingMode('month')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  groupingMode === 'month' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setGroupingMode('year')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  groupingMode === 'year' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                Year
              </button>
              <button
                onClick={() => setGroupingMode('flat')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  groupingMode === 'flat' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-black'
                }`}
              >
                Flat View
              </button>
            </div>
          </div>

        </div>

        {/* Custom Date Pickers (if Custom Range selected) */}
        {dateRangeFilter === 'custom' && (
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] flex items-center gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
              />
            </div>
          </div>
        )}

        {/* Status Filter & Search Row */}
        <div className="pt-2 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-[#000839] text-white shadow-2xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {st === 'all' ? 'All Status' : st}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Order # or Customer..."
              className="w-full pl-8 pr-12 py-2 text-xs bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl focus:outline-none focus:border-[#700B1A]"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            <button type="submit" className="absolute right-2 top-1.5 btn btn-primary text-[10px] py-1 px-2.5 rounded-lg">
              Find
            </button>
          </form>

        </div>

      </div>

      {/* Orders List / Grouped Sections */}
      {loading ? (
        <SkeletonTable rows={6} cols={6} />
      ) : groupedOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-[#E8E2D9] shadow-xs text-xs text-gray-500 space-y-2">
          <Package size={32} className="mx-auto text-gray-300" />
          <p className="font-bold text-gray-700">No orders found matching the filter criteria.</p>
          <p className="text-[11px] text-gray-400">Try changing the date filter or clearing the search keyword.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {groupedOrders.map((group) => {
            const isCollapsed = collapsedGroups[group.key];

            return (
              <div
                key={group.key}
                className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs overflow-hidden transition-all"
              >
                {/* Group Header Banner */}
                <div
                  onClick={() => toggleGroupCollapse(group.key)}
                  className="p-4 bg-[#FAF8F5] border-b border-[#E8E2D9] flex items-center justify-between cursor-pointer hover:bg-[#F4EFEA] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#700B1A] text-white flex items-center justify-center text-xs font-black shadow-xs">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-sm">{group.title}</h3>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {group.orders.length} Orders • Total: ₹{group.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ₹{group.totalAmount.toLocaleString('en-IN')}
                    </span>
                    {isCollapsed ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronUp size={18} className="text-gray-400" />}
                  </div>
                </div>

                {/* Group Orders Table */}
                {!isCollapsed && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Order # & Time</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Saree Items</th>
                          <th className="p-4">Total Bill</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Shipment Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.orders.map((order) => (
                          <tr key={order._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            
                            <td className="p-4">
                              <strong className="font-bold text-gray-900 block text-xs">{order.orderNumber}</strong>
                              <span className="text-[11px] text-gray-400">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="font-semibold text-gray-900 block">
                                {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                              </span>
                              <span className="text-gray-500 text-[11px] block font-mono">
                                {order.shippingAddress?.phone}
                              </span>
                              <span className="text-gray-400 text-[10px]">
                                {order.shippingAddress?.city}, {order.shippingAddress?.state}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="font-semibold text-gray-800 block">
                                {order.orderItems?.length || 1} Sarees Ordered
                              </span>
                              <span className="text-gray-400 text-[11px] line-clamp-1">
                                {order.orderItems?.[0]?.title}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="font-bold text-gray-900 text-xs block">
                                ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                              </span>
                              {order.discountAmount > 0 && (
                                <span className="text-[10px] text-emerald-600 font-bold block">
                                  Saved ₹{order.discountAmount}
                                </span>
                              )}
                            </td>

                            <td className="p-4">
                              <span className="font-semibold text-gray-700 block text-[11px]">{order.paymentMethod}</span>
                              <span className={`text-[10px] font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {order.isPaid ? 'Paid' : 'Pending COD'}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                                order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="p-1.5 rounded-lg border border-gray-200 hover:border-[#700B1A] text-gray-600 hover:text-[#700B1A] transition-colors"
                                  title="View Order Details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => setPrintableInvoiceOrder(order)}
                                  className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-900 text-gray-600 hover:text-gray-900 transition-colors"
                                  title="Print Official GST Tax Invoice"
                                >
                                  <Printer size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setStatusModalOrder(order);
                                    setUpdatedStatus(order.orderStatus);
                                    setCourierName(order.trackingUpdates?.[order.trackingUpdates.length - 1]?.courierName || 'BlueDart Logistics');
                                    setTrackingAwb(order.trackingUpdates?.[order.trackingUpdates.length - 1]?.trackingAwb || '');
                                  }}
                                  className="btn btn-primary text-[11px] py-1 px-2.5 font-bold rounded-lg shadow-2xs"
                                >
                                  Update
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* UPDATE STATUS MODAL */}
      {/* ------------------------------------------------------------- */}
      {statusModalOrder && (
        <div className="modal-overlay" onClick={() => setStatusModalOrder(null)}>
          <div className="modal-box p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
              Advance Order Status
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Order: <strong>{statusModalOrder.orderNumber}</strong> ({statusModalOrder.shippingAddress?.fullName})
            </p>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Select Lifecycle Stage</label>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  className="form-select text-xs font-semibold"
                >
                  <option value="Placed">Placed (New Order Received)</option>
                  <option value="Confirmed">Confirmed (Store Accepted)</option>
                  <option value="Packed">Packed (In Silk Protective Box)</option>
                  <option value="Shipped">Shipped (Handed Over to Courier)</option>
                  <option value="Out for Delivery">Out for Delivery (Near Customer)</option>
                  <option value="Delivered">Delivered (Completed)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Courier Shipment & Tracking Inputs */}
              {['Shipped', 'Out for Delivery', 'Delivered'].includes(updatedStatus) && (
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                    <Truck size={15} className="text-blue-700" />
                    <span>Courier Shipment & AWB Tracking</span>
                  </div>

                  <div>
                    <label className="form-label font-bold text-blue-900 block mb-1">Courier Partner Name</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. BlueDart, Delhivery, DTDC, India Post"
                      className="form-input text-xs bg-white border-blue-200"
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold text-blue-900 block mb-1">AWB Tracking Number / URL</label>
                    <input
                      type="text"
                      value={trackingAwb}
                      onChange={(e) => setTrackingAwb(e.target.value)}
                      placeholder="e.g. BD-994820129"
                      className="form-input text-xs font-mono font-bold bg-white border-blue-200"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Current Checkpoint Location</label>
                <input
                  type="text"
                  value={checkpointLocation}
                  onChange={(e) => setCheckpointLocation(e.target.value)}
                  placeholder="e.g. Hyderabad Fulfillment Hub"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label font-bold text-gray-700 block mb-1">Status Notes</label>
                <input
                  type="text"
                  value={trackingNote}
                  onChange={(e) => setTrackingNote(e.target.value)}
                  placeholder="e.g. Saree inspected and handed over to logistics"
                  className="form-input text-xs"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Customer will automatically receive WhatsApp message & Email notification for <strong>{updatedStatus}</strong></span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOrder(null)}
                  className="btn btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs font-bold px-5 py-2 shadow-xs"
                >
                  Save Shipment Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ORDER DETAILS MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedOrderDetails && (
        <div className="modal-overlay" onClick={() => setSelectedOrderDetails(null)}>
          <div className="modal-box p-6 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  Order Details: {selectedOrderDetails.orderNumber}
                </h3>
                <span className="text-xs text-gray-400">Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="p-1 text-gray-400 hover:text-black">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                <div>
                  <strong className="block text-gray-900 font-bold mb-1">Customer & Delivery Address:</strong>
                  <p>{selectedOrderDetails.shippingAddress?.fullName}</p>
                  <p>{selectedOrderDetails.shippingAddress?.street}</p>
                  <p>{selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} - {selectedOrderDetails.shippingAddress?.pincode}</p>
                  <p className="font-mono mt-1 font-bold">📞 {selectedOrderDetails.shippingAddress?.phone}</p>
                </div>
                <div>
                  <strong className="block text-gray-900 font-bold mb-1">Order Summary:</strong>
                  <p>Status: <span className="font-bold text-[#700B1A]">{selectedOrderDetails.orderStatus}</span></p>
                  <p>Payment: {selectedOrderDetails.paymentMethod} ({selectedOrderDetails.isPaid ? 'Paid' : 'Pending'})</p>
                  <p className="text-sm font-black text-gray-900 mt-2">Total Bill: ₹{Number(selectedOrderDetails.totalPrice).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div>
                <strong className="block text-gray-900 font-bold mb-2">Ordered Handloom Silk Sarees:</strong>
                <div className="space-y-2">
                  {selectedOrderDetails.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl">
                      <div>
                        <span className="font-bold text-gray-900 block">{item.title}</span>
                        <span className="text-[11px] text-gray-400">Color: {item.color || 'Standard'} | Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-gray-900">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRINTABLE OFFICIAL GST INVOICE MODAL */}
      {/* ------------------------------------------------------------- */}
      {printableInvoiceOrder && (
        <div className="modal-overlay" onClick={() => setPrintableInvoiceOrder(null)}>
          <div className="modal-box p-8 max-w-3xl bg-white text-xs space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="font-serif font-black text-xl text-[#700B1A]">SRI VIJAYLAXMI SAREES</h2>
                <span className="text-[10px] text-gray-500 font-semibold block">Authentic Indian Handloom Silk Mark Certified</span>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-sm text-gray-900">GST TAX INVOICE</h3>
                <span className="text-gray-500 font-mono text-[11px]">#{printableInvoiceOrder.orderNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <strong className="text-[10px] uppercase text-gray-400 font-bold block mb-1">Billed & Shipped To:</strong>
                <p className="font-bold text-gray-900">{printableInvoiceOrder.shippingAddress?.fullName}</p>
                <p>{printableInvoiceOrder.shippingAddress?.street}</p>
                <p>{printableInvoiceOrder.shippingAddress?.city}, {printableInvoiceOrder.shippingAddress?.state} - {printableInvoiceOrder.shippingAddress?.pincode}</p>
                <p>Phone: {printableInvoiceOrder.shippingAddress?.phone}</p>
              </div>
              <div className="text-right space-y-1">
                <p>Invoice Date: <strong>{new Date(printableInvoiceOrder.createdAt).toLocaleDateString()}</strong></p>
                <p>Payment: <strong>{printableInvoiceOrder.paymentMethod}</strong></p>
                <p>Status: <strong className="text-emerald-700">{printableInvoiceOrder.orderStatus}</strong></p>
              </div>
            </div>

            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                <tr>
                  <th className="p-2 border border-gray-200">Item Description</th>
                  <th className="p-2 border border-gray-200 text-center">Qty</th>
                  <th className="p-2 border border-gray-200 text-right">Price</th>
                  <th className="p-2 border border-gray-200 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {printableInvoiceOrder.orderItems?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border border-gray-200 font-semibold">{item.title}</td>
                    <td className="p-2 border border-gray-200 text-center">{item.quantity}</td>
                    <td className="p-2 border border-gray-200 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
                    <td className="p-2 border border-gray-200 text-right font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="p-2 text-right font-bold border border-gray-200">Grand Total Amount (Incl. GST):</td>
                  <td className="p-2 text-right font-black text-sm border border-gray-200 text-[#700B1A]">
                    ₹{Number(printableInvoiceOrder.totalPrice).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-[10px] text-gray-400">Thank you for preserving India's rich handloom heritage!</span>
              <button
                onClick={() => window.print()}
                className="btn btn-primary text-xs font-bold px-5 py-2 flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
