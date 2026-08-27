import React, { useState, useEffect } from 'react';
import { bannersApi } from '../services/api';
import { Image as ImageIcon, Plus, Trash2, X, Sparkles, Eye, ArrowRight } from 'lucide-react';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: 'The Royal Banarasi Wedding Edit 2026',
    subtitle: 'Pure Katan Silk & Antique Gold Zari Woven in Kashi',
    badgeText: 'FESTIVE COLLECTION 2026',
    discountText: 'FLAT 40% OFF',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    link: '/shop?category=Banarasi+Silk',
    bgGradient: 'linear-gradient(135deg, #580816 0%, #1A0005 100%)',
    displayOrder: 1,
  });

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await bannersApi.getAllAdmin();
      if (res.data) setBanners(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    try {
      await bannersApi.create(formData);
      setIsModalOpen(false);
      loadBanners();
    } catch (err) {
      alert(err.message || 'Error saving banner');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete banner "${title}"?`)) {
      try {
        await bannersApi.delete(id);
        loadBanners();
      } catch (err) {
        alert(err.message || 'Error deleting banner');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#881337] tracking-widest block">
            Homepage Promotions
          </span>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Hero Banners & Sliders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage full-width luxury promotional slides and headline campaigns</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} />
          <span>Add New Hero Slide</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-40 bg-gray-200 animate-pulse rounded-2xl"></div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E2D9] text-gray-400 text-xs">
            No hero banner slides found. Create one now!
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5"
            >
              <div className="w-full md:w-56 aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded">
                  Order #{b.displayOrder || 1}
                </span>
              </div>

              <div className="flex-1 space-y-1.5 text-xs">
                <span className="inline-block bg-amber-100 text-[#92400E] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {b.badgeText || 'SPECIAL OFFER'}
                </span>
                <h3 className="font-serif text-lg font-bold text-gray-900">{b.title}</h3>
                <p className="text-gray-500 line-clamp-1">{b.subtitle}</p>
                <div className="flex items-center gap-3 pt-1 text-gray-400 text-[11px]">
                  <span>Target: <strong>{b.link}</strong></span>
                  <span>Highlight: <strong className="text-emerald-700">{b.discountText}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(b._id, b.title)}
                  className="btn bg-red-50 text-red-600 hover:bg-red-100 text-xs py-2 px-3 rounded-lg"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal with Live Preview */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box p-6 sm:p-8 max-w-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Create Hero Banner Slide
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            {/* Live Banner Preview Card */}
            <div className="mb-5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Live Slide Preview:
              </span>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#4A0E17] to-[#200408] text-white p-5 shadow-md flex items-center justify-between min-h-[160px]">
                <div className="relative z-10 max-w-sm space-y-1">
                  <span className="text-[9px] font-bold text-amber-300 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded">
                    {formData.badgeText || 'SPECIAL OFFER'}
                  </span>
                  <h4 className="font-serif text-base font-bold leading-tight text-white mt-1">
                    {formData.title || 'Slide Headline'}
                  </h4>
                  <p className="text-[11px] text-gray-300 line-clamp-1">{formData.subtitle}</p>
                  <span className="inline-block text-[10px] font-bold text-amber-200 bg-[#700B1A] px-2 py-0.5 rounded mt-1">
                    {formData.discountText}
                  </span>
                </div>
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/20 shrink-0">
                  <img src={formData.image} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3 text-xs">
              <div>
                <label className="form-label">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Banarasi Wedding Edit"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label">Subtitle Description</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Pure Gold Zari Weaves from Kashi"
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Top Badge Text</label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Discount Pill Text</label>
                  <input
                    type="text"
                    value={formData.discountText}
                    onChange={(e) => setFormData({ ...formData, discountText: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="form-label">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Target Link URL</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/shop?category=Banarasi+Silk"
                  className="form-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs font-bold px-4 py-2">
                  Save Banner Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBanners;
