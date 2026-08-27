import React, { useState, useEffect } from 'react';
import { couponsApi } from '../services/api';
import { Tag, Plus, Trash2, X, CheckCircle2, Copy, Sparkles, Check } from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1499,
    maxDiscount: 1000,
    expiryDate: '2027-12-31',
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await couponsApi.getAllAdmin();
      if (res.data) setCoupons(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      code: preset.code,
      description: preset.description,
      discountType: preset.discountType,
      discountValue: preset.discountValue,
      minOrderAmount: preset.minOrderAmount,
      maxDiscount: preset.maxDiscount,
      expiryDate: '2027-12-31',
    });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await couponsApi.create(formData);
      setIsModalOpen(false);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 1499,
        maxDiscount: 1000,
        expiryDate: '2027-12-31',
      });
      loadCoupons();
    } catch (err) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete coupon code "${code}"?`)) {
      try {
        await couponsApi.delete(id);
        loadCoupons();
      } catch (err) {
        alert(err.message || 'Failed to delete coupon');
      }
    }
  };

  const presets = [
    { code: 'FESTIVE500', description: 'Flat ₹500 discount for festive shoppers', discountType: 'fixed', discountValue: 500, minOrderAmount: 2999, maxDiscount: 500 },
    { code: 'BRIDAL15', description: '15% Off on pure silk bridal sarees', discountType: 'percentage', discountValue: 15, minOrderAmount: 4999, maxDiscount: 2000 },
    { code: 'SILKMARK10', description: '10% Welcome gift for new members', discountType: 'percentage', discountValue: 10, minOrderAmount: 1999, maxDiscount: 800 },
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#881337] tracking-widest block">
            Promotions & Discounts
          </span>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Coupons & Promo Codes
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Create festive promotional codes, discount percentage rules, and track customer usage</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading coupons...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount Value</th>
                  <th className="p-4">Min. Purchase</th>
                  <th className="p-4">Max Cap</th>
                  <th className="p-4">Usage Stats</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#700B1A] bg-[#FDF2F4] px-2.5 py-1 rounded-md border border-pink-200">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopy(c.code)}
                          className="p-1 text-gray-400 hover:text-black"
                          title="Copy Code"
                        >
                          {copiedCode === c.code ? (
                            <Check size={14} className="text-emerald-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{c.description}</p>
                    </td>

                    <td className="p-4">
                      <strong className="text-sm text-gray-900 font-bold">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                      </strong>
                    </td>

                    <td className="p-4 text-gray-700 font-medium">
                      ₹{c.minOrderAmount}
                    </td>

                    <td className="p-4 text-gray-700 font-medium">
                      {c.maxDiscount ? `₹${c.maxDiscount}` : 'No Limit'}
                    </td>

                    <td className="p-4">
                      <span className="badge bg-emerald-50 text-emerald-700 font-bold">
                        {c.usedCount || 0} times used
                      </span>
                    </td>

                    <td className="p-4 text-gray-500">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(c._id, c.code)}
                        className="btn bg-red-50 text-red-600 hover:bg-red-100 text-xs py-1 px-2.5 rounded-lg"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Create New Promo Code
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            {/* Quick Templates */}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Quick Fill Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="text-[10px] font-bold font-mono px-2 py-1 bg-amber-50 text-[#700B1A] border border-amber-200 rounded hover:bg-amber-100 transition-colors"
                  >
                    + {p.code}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="form-label">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. DIWALI2026"
                  className="form-input text-xs font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Min. Order Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label">Offer Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 15% off on all bridal sarees"
                  className="form-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs font-bold px-4 py-2">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCoupons;
