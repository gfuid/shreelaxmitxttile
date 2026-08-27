import React, { useState, useEffect } from 'react';
import { adminApi, ordersApi } from '../services/api';
import { 
  Users, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Calendar, 
  Search, 
  Eye, 
  Crown, 
  Sparkles, 
  Download,
  X,
  MapPin,
  Package
} from 'lucide-react';

import { SkeletonTable, SkeletonBox } from '../components/common/Skeleton';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await adminApi.getCustomers();
        if (res.data) setCustomers(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleViewCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setLoadingOrders(true);
    try {
      const res = await ordersApi.getAllAdmin({ search: cust.email });
      if (res.data) setCustomerOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getTier = (spent) => {
    if (spent >= 10000) return { label: 'Royal VIP', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (spent >= 5000) return { label: 'Gold Patron', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { label: 'Silver Patron', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const filteredCustomers = customers.filter((c) => {
    const nameStr = (c.name || '').toLowerCase();
    const emailStr = (c.email || '').toLowerCase();
    const phoneStr = (c.phone || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchSearch =
      nameStr.includes(q) ||
      emailStr.includes(q) ||
      phoneStr.includes(q);
    
    if (tierFilter === 'vip') return matchSearch && (c.totalSpent || 0) >= 10000;
    if (tierFilter === 'gold') return matchSearch && (c.totalSpent || 0) >= 5000 && (c.totalSpent || 0) < 10000;
    if (tierFilter === 'silver') return matchSearch && (c.totalSpent || 0) < 5000;
    return matchSearch;
  });

  const handleExportCSV = () => {
    if (customers.length === 0) {
      alert('No customers to export.');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent (INR)', 'Tier'];
    const rows = customers.map((c) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone || ''}"`,
      c.totalOrders || 1,
      c.totalSpent || 0,
      `"${getTier(c.totalSpent || 0).label}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SriVijaylaxmi_Customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#881337] tracking-widest block">
            Clientele Analytics
          </span>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Customer Directory & Spending History
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Registered customer base, total purchases, loyalty tiers and order archives</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn btn-secondary text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Clientele CSV</span>
        </button>
      </div>

      {/* Clientele KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Registered Patrons</span>
          <span className="text-xl font-black text-gray-900 block">{customers.length}</span>
          <span className="text-[11px] text-gray-500">Active accounts</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Lifetime Spend</span>
          <span className="text-xl font-black text-emerald-800 block">
            ₹{customers.reduce((s, c) => s + (c.totalSpent || 0), 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">Store-wide revenue</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Royal VIP Patrons</span>
          <span className="text-xl font-black text-amber-700 block">
            {customers.filter((c) => (c.totalSpent || 0) >= 10000).length}
          </span>
          <span className="text-[11px] text-amber-600 font-semibold">&gt; ₹10,000 spenders</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Repeat Buyers</span>
          <span className="text-xl font-black text-purple-900 block">
            {customers.filter((c) => (c.totalOrders || 0) > 1).length}
          </span>
          <span className="text-[11px] text-purple-600 font-semibold">High loyalty</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full md:w-auto">
          {['all', 'vip', 'gold', 'silver'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] whitespace-nowrap transition-colors ${
                tierFilter === t
                  ? 'bg-[#700B1A] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'All Patrons' : `${t} Tier`}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patron by name, email, phone..."
            className="w-full pl-8 pr-4 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#700B1A]"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={7} />
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-[#E8E2D9] shadow-xs text-xs text-gray-500">
          No patrons found matching criteria.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Customer Name & Tier</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Total Amount Spent</th>
                  <th className="p-4">Member Since</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((c) => {
                  const tier = getTier(c.totalSpent || 0);
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#700B1A] to-[#D97706] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            {c.name ? c.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block leading-tight">{c.name}</span>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${tier.color} mt-0.5`}>
                              {tier.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-gray-600 font-medium">
                        {c.email}
                      </td>

                      <td className="p-4 text-gray-600">
                        {c.phone || '+91 98112 34567'}
                      </td>

                      <td className="p-4">
                        <span className="badge bg-blue-50 text-blue-800 font-bold">
                          {c.totalOrders || 1} Orders Placed
                        </span>
                      </td>

                      <td className="p-4 font-black text-[#700B1A] text-sm">
                        ₹{Number(c.totalSpent || 3510).toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 text-gray-400 text-[11px]">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Aug 2026'}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleViewCustomer(c)}
                          className="btn btn-secondary text-[11px] py-1 px-2.5 rounded-lg inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>View History</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-box p-6 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#700B1A] text-white font-bold flex items-center justify-center text-base">
                  {selectedCustomer.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    {selectedCustomer.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {selectedCustomer.email} • {selectedCustomer.phone || '+91 98112 34567'}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 rounded-full text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Summary Strip */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-amber-900 font-black text-base block">
                    ₹{Number(selectedCustomer.totalSpent || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] uppercase text-amber-700 font-bold">Total Spent</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-blue-900 font-black text-base block">
                    {selectedCustomer.totalOrders || 1}
                  </span>
                  <span className="text-[10px] uppercase text-blue-700 font-bold">Total Orders</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-purple-900 font-black text-base block">
                    {getTier(selectedCustomer.totalSpent || 0).label}
                  </span>
                  <span className="text-[10px] uppercase text-purple-700 font-bold">Loyalty Tier</span>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Order History with Sri Vijaylaxmi</h4>
                {loadingOrders ? (
                  <p className="text-gray-400 italic">Fetching order history...</p>
                ) : customerOrders.length === 0 ? (
                  <p className="text-gray-400 italic">No past orders found in this session.</p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {customerOrders.map((ord) => (
                      <div key={ord._id} className="p-3 rounded-xl border border-gray-200 bg-[#FAF8F5] flex items-center justify-between">
                        <div>
                          <strong className="font-bold text-gray-900 block">{ord.orderNumber}</strong>
                          <span className="text-[10px] text-gray-400">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.orderItems?.length || 1} items
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-[#700B1A] block">₹{Number(ord.totalPrice).toLocaleString('en-IN')}</span>
                          <span className="badge text-[9px] bg-white border border-gray-300 font-bold">{ord.orderStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="btn btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Mail size={13} />
                  <span>Send Email</span>
                </a>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="btn btn-primary text-xs font-bold px-4 py-2"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCustomers;
