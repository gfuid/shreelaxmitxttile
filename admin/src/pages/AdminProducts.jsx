import React, { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '../services/api';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Sparkles, 
  Star, 
  Image as ImageIcon,
  X,
  Check,
  Download,
  AlertTriangle,
  Flame
} from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const initialFormState = {
    title: '',
    category: 'Banarasi Silk',
    fabric: 'Pure Katan Silk',
    occasion: 'Festive & Party',
    workType: 'Kadwa Zari Weaving',
    pattern: 'Floral Jaal & Paisley',
    color: 'Crimson Red',
    colorHex: '#991B1B',
    sareeLength: '5.5 meters',
    blouseLength: '0.8 meters (Unstitched)',
    blouseIncluded: true,
    washCare: 'Dry Clean Only',
    price: 2999,
    originalPrice: 5999,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    description: '',
    isFeatured: true,
    isBestSeller: false,
    isTrending: true,
    isNewArrival: true,
    tags: 'saree, silk, banarasi, festive',
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll({ search: searchTerm, category: categoryFilter }),
        categoriesApi.getAll(),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product._id);
    setFormData({
      ...product,
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [''],
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleAddImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleRemoveImageField = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated.length > 0 ? updated : [''] });
  };

  const handleQuickStockAdjust = async (productId, delta, currentStock) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await productsApi.update(productId, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p))
      );
    } catch (err) {
      alert('Failed to update inventory stock');
    }
  };

  const handleToggleBadge = async (productId, field, currentValue) => {
    try {
      await productsApi.update(productId, { [field]: !currentValue });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, [field]: !currentValue } : p))
      );
    } catch (err) {
      alert('Failed to toggle badge');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock),
        images: formData.images.filter((img) => img.trim().length > 0),
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map((t) => t.trim()) : formData.tags,
      };

      if (editingProductId) {
        await productsApi.update(editingProductId, payload);
      } else {
        await productsApi.create(payload);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await productsApi.delete(id);
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleExportCSV = () => {
    if (products.length === 0) {
      alert('No products available to export.');
      return;
    }
    const headers = ['SKU', 'Title', 'Category', 'Fabric', 'Color', 'Price (INR)', 'MRP (INR)', 'Stock', 'Featured', 'BestSeller'];
    const rows = products.map((p) => [
      `"${p.sku || ''}"`,
      `"${p.title}"`,
      `"${p.category}"`,
      `"${p.fabric}"`,
      `"${p.color}"`,
      p.price,
      p.originalPrice,
      p.stock,
      p.isFeatured ? 'YES' : 'NO',
      p.isBestSeller ? 'YES' : 'NO',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SriVijaylaxmi_Catalog_Products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter products by stock
  const filteredProducts = products.filter((p) => {
    if (stockFilter === 'low') return p.stock <= 5 && p.stock > 0;
    if (stockFilter === 'out') return p.stock === 0;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#881337] tracking-widest block">
            Store Catalog & Inventory
          </span>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Saree Products Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Add new saree weaves, edit specifications, and adjust inventory live</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary text-xs font-bold py-2 px-3 flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export Catalog CSV</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="btn btn-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} />
            <span>Add New Saree</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category & Stock Select */}
        <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-bold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#700B1A]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-bold">Stock Status:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#700B1A]"
            >
              <option value="all">All Inventory</option>
              <option value="low">⚠️ Low Stock (&le; 5 units)</option>
              <option value="out">❌ Out of Stock (0 units)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saree title, fabric, SKU..."
            className="w-full pl-8 pr-12 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#700B1A]"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          <button type="submit" className="absolute right-2 top-1.5 btn btn-primary text-[10px] py-1 px-2.5 rounded-lg">
            Search
          </button>
        </form>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading catalog items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No saree products found matching criteria. Click "Add New Saree" to list your first weave!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Saree & SKU</th>
                  <th className="p-4">Category & Fabric</th>
                  <th className="p-4">Price & MRP</th>
                  <th className="p-4">Inventory Stock</th>
                  <th className="p-4">Quick Badges</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]}
                          alt=""
                          className="w-12 h-16 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1 text-xs max-w-xs">
                            {product.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono">
                            SKU: {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Fabric */}
                    <td className="p-4">
                      <span className="font-semibold text-gray-800 block">{product.category}</span>
                      <span className="text-gray-500 text-[11px] block">{product.fabric}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
                          style={{ backgroundColor: product.colorHex || '#991B1B' }}
                        ></span>
                        <span className="text-[10px] text-gray-400">{product.color}</span>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="p-4">
                      <strong className="text-sm font-black text-[#700B1A] block">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </strong>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          MRP: ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                      {product.discountPercent > 0 && (
                        <span className="badge badge-discount text-[9px] ml-1">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </td>

                    {/* Stock & Quick Adjustments */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${product.stock <= 5 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {product.stock}
                        </span>
                        <span className="text-[10px] text-gray-400">units</span>

                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => handleQuickStockAdjust(product._id, 5, product.stock)}
                            className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-mono text-[10px] font-bold border border-emerald-200"
                            title="Add +5 stock"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleQuickStockAdjust(product._id, 10, product.stock)}
                            className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-mono text-[10px] font-bold border border-blue-200"
                            title="Add +10 stock"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                      <span className="block text-[10px] text-gray-400 mt-0.5">
                        {product.stock <= 5 ? '⚠️ Low Inventory' : 'Adequate Stock'}
                      </span>
                    </td>

                    {/* Quick Badges Toggle */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleToggleBadge(product._id, 'isFeatured', product.isFeatured)}
                          className={`badge text-[9px] cursor-pointer transition-all ${
                            product.isFeatured ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          ★ Featured
                        </button>
                        <button
                          onClick={() => handleToggleBadge(product._id, 'isBestSeller', product.isBestSeller)}
                          className={`badge text-[9px] cursor-pointer transition-all ${
                            product.isBestSeller ? 'bg-purple-100 text-purple-900 border border-purple-300 font-bold' : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          👑 Best Seller
                        </button>
                        <button
                          onClick={() => handleToggleBadge(product._id, 'isTrending', product.isTrending)}
                          className={`badge text-[9px] cursor-pointer transition-all ${
                            product.isTrending ? 'bg-rose-100 text-rose-900 border border-rose-300 font-bold' : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          🔥 Trending
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="btn btn-secondary text-[11px] py-1 px-2.5 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id, product.title)}
                        className="btn bg-red-50 hover:bg-red-100 text-red-600 text-[11px] py-1 px-2.5 rounded-lg"
                        title="Delete Product"
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

      {/* Add / Edit Saree Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box p-6 sm:p-8 max-w-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                {editingProductId ? 'Edit Saree Product' : 'Add New Saree Weave to Catalog'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="form-label">Saree Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Shubh Vivah Crimson Red Pure Banarasi Katan Silk Saree"
                  className="form-input text-xs"
                />
              </div>

              {/* Category, Fabric, Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Fabric *</label>
                  <input
                    type="text"
                    required
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. Pure Katan Silk"
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Occasion</label>
                  <input
                    type="text"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    placeholder="e.g. Bridal & Wedding"
                    className="form-input text-xs"
                  />
                </div>
              </div>

              {/* Work Type, Pattern, Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Work / Weaving Type</label>
                  <input
                    type="text"
                    value={formData.workType}
                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                    placeholder="e.g. Kadwa Zari Weave"
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Pattern</label>
                  <input
                    type="text"
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    placeholder="e.g. Floral Jaal"
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Color Name & Hex</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="Color Name"
                      className="form-input text-xs flex-1"
                    />
                    <input
                      type="color"
                      value={formData.colorHex || '#991B1B'}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="w-10 h-9 p-0.5 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="form-label">Original MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Inventory Stock Count *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              {/* Saree & Blouse Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Saree Length</label>
                  <input
                    type="text"
                    value={formData.sareeLength}
                    onChange={(e) => setFormData({ ...formData, sareeLength: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Blouse Piece Length</label>
                  <input
                    type="text"
                    value={formData.blouseLength}
                    onChange={(e) => setFormData({ ...formData, blouseLength: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Wash Care Instructions</label>
                  <input
                    type="text"
                    value={formData.washCare}
                    onChange={(e) => setFormData({ ...formData, washCare: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0">High-Resolution Photo URLs</label>
                  <button
                    type="button"
                    onClick={handleAddImageField}
                    className="text-xs font-bold text-[#700B1A] hover:underline"
                  >
                    + Add Another Image URL
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="url"
                        required
                        value={img}
                        onChange={(e) => handleImageChange(i, e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="form-input text-xs flex-1"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageField(i)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe weaving, motifs, pallu details, drape, and origin..."
                  className="form-textarea text-xs"
                ></textarea>
              </div>

              {/* Badges & Tags */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#700B1A]"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-[#700B1A]"
                  />
                  <span>Best Seller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="rounded text-[#700B1A]"
                  />
                  <span>Trending Saree</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs font-bold px-6 py-2.5"
                >
                  {editingProductId ? 'Update Saree Product' : 'Publish Product to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
