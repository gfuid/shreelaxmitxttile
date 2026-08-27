import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../services/api';
import { Layers, Plus, Edit2, Trash2, X, ExternalLink, Sparkles } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    displayOrder: 1,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.getAll();
      if (res.data) setCategories(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCatId(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      displayOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCatId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image,
      displayOrder: cat.displayOrder || 1,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        await categoriesApi.update(editingCatId, formData);
      } else {
        await categoriesApi.create(formData);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert(err.message || 'Error saving category');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await categoriesApi.delete(id);
        loadCategories();
      } catch (err) {
        alert(err.message || 'Error deleting category');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#881337] tracking-widest block">
            Store Taxonomy
          </span>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Saree Categories & Collections
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage homepage category circles, weave types, and catalog taxonomy</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-2xl"></div>
          ))
        ) : categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-2xl border border-[#E8E2D9] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#700B1A]/40 transition-colors">
            <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Order #{cat.displayOrder || 1}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900">{cat.name}</h3>
                <span className="text-xs font-bold text-[#700B1A] bg-[#FDF2F4] px-2 py-0.5 rounded-md">
                  {cat.itemCount || 0} Sarees
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{cat.description || 'Authentic traditional handloom weave.'}</p>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  target="_blank"
                  className="text-gray-400 hover:text-[#700B1A] inline-flex items-center gap-1"
                  title="View on Storefront"
                >
                  <ExternalLink size={12} />
                  <span>View</span>
                </Link>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="btn btn-secondary text-xs py-1 px-2.5"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 text-xs py-1 px-2"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editingCatId ? 'Edit Category' : 'Add Saree Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Banarasi Silk"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label">Cover Image URL *</label>
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
                <label className="form-label">Display Priority Order</label>
                <input
                  type="number"
                  min={1}
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this weave style..."
                  className="form-textarea text-xs"
                ></textarea>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
