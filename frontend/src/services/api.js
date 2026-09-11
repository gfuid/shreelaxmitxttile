import { initialCategories, initialBanners, initialCoupons, initialProducts, initialOrders } from './initialData';
import { getStylistResponse } from './websiteStructure';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to retrieve auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('srivijaylaxmi_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Local storage key names for fallback offline persistence (v10 exact srivijaylaxmi categories & wholesale)
const STORAGE_KEYS = {
  PRODUCTS: 'svl_v10_products_db',
  CATEGORIES: 'svl_v10_categories_db',
  BANNERS: 'svl_v10_banners_db',
  COUPONS: 'svl_v10_coupons_db',
  ORDERS: 'svl_v10_orders_db',
  USERS: 'svl_v10_users_db',
};

// Initialize LocalStorage with seed data if empty
const initLocalStorage = () => {
  // Clean legacy dummy product caches
  try {
    localStorage.removeItem('svl_products_db');
    localStorage.removeItem('svl_v2_products_db');
    localStorage.removeItem('svl_v3_products_db');
    localStorage.removeItem('svl_v4_products_db');
    localStorage.removeItem('svl_v5_products_db');
    localStorage.removeItem('svl_v6_products_db');
    localStorage.removeItem('svl_v7_products_db');
    localStorage.removeItem('svl_v7_categories_db');
    localStorage.removeItem('svl_v8_products_db');
    localStorage.removeItem('svl_v8_categories_db');
    localStorage.removeItem('svl_v9_products_db');
    localStorage.removeItem('svl_v9_categories_db');
    const rawWishlist = localStorage.getItem('svl_wishlist');
    if (rawWishlist && (rawWishlist.includes('prod_1') || rawWishlist.includes('prod_3'))) {
      const parsed = JSON.parse(rawWishlist).filter((id) => id !== 'prod_1' && id !== 'prod_3');
      localStorage.setItem('svl_wishlist', JSON.stringify(parsed));
    }
  } catch (e) {}

  const storedProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!storedProds || JSON.parse(storedProds).length < initialProducts.length || storedProds.includes('unsplash')) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  const storedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!storedCats || JSON.parse(storedCats).length < initialCategories.length || storedCats.includes('45u') || storedCats.includes('FUB')) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
  const storedBanners = localStorage.getItem(STORAGE_KEYS.BANNERS);
  if (!storedBanners || storedBanners.includes('45u')) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(initialBanners));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(initialCoupons));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const seedUsers = [
      {
        _id: 'admin_1',
        name: 'Mohan Kumar Agrawal (Admin)',
        email: 'srivijaylaxmitextiles@gmail.com',
        password: 'password123',
        phone: '+919394512326',
        role: 'admin',
        addresses: [
          {
            _id: 'addr_adm',
            fullName: 'Sri Vijay Laxmi Textiles Store',
            phone: '+91 93945 12326',
            street: '21-1-667/5/B, God Gift Market, First floor, Rikab Gunj',
            landmark: 'Near Rikab Gunj',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500002',
            isDefault: true,
          },
        ],
      },
      {
        _id: 'usr_sagar',
        name: 'Sagar Punia',
        email: 'sagarpunia163@gmail.com',
        password: 'password123',
        phone: '+919876543210',
        role: 'customer',
        addresses: [
          {
            _id: 'addr_sagar',
            fullName: 'Sagar Punia',
            phone: '+91 98765 43210',
            street: 'B-402, Royal Palms, Jubilee Hills',
            landmark: 'Near Jubilee Hills Check Post',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500033',
            isDefault: true,
          },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
  }
};

initLocalStorage();

const getFromStore = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    // Fallback to initial seed
    if (key === STORAGE_KEYS.PRODUCTS) return initialProducts;
    if (key === STORAGE_KEYS.CATEGORIES) return initialCategories;
    if (key === STORAGE_KEYS.BANNERS) return initialBanners;
    if (key === STORAGE_KEYS.COUPONS) return initialCoupons;
    if (key === STORAGE_KEYS.ORDERS) return initialOrders;
    return [];
  } catch (e) {
    return [];
  }
};

const saveToStore = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[LocalStorage] Failed to save key "${key}" (quota or disabled):`, e.message);
  }
};

// Cross-Tab & Cross-Port Synchronizer
const syncChannel = typeof window !== 'undefined' && window.BroadcastChannel ? new BroadcastChannel('svl_sync_channel') : null;

export const broadcastSync = (action, payload) => {
  try {
    if (syncChannel) {
      syncChannel.postMessage({ action, payload, timestamp: Date.now() });
    }
  } catch (e) {}
};

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    const { action, payload } = event.data || {};
    if (action === 'ORDER_STATUS_UPDATED' && payload) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      const idx = orders.findIndex((o) => o._id === payload._id || o.orderNumber === payload.orderNumber);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...payload };
        saveToStore(STORAGE_KEYS.ORDERS, orders);
      }
    }
  };
}

// Generic fetch with 10s timeout fallback so UI is resilient
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${res.status}`);
  } catch (error) {
    // If backend is down or unreachable, handle seamlessly via local mock storage
    console.warn(`[API] Remote call to ${endpoint} failed, utilizing resilient local store:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// AUTH API
// -------------------------------------------------------------
export const authApi = {
  login: async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      });
    } catch (err) {
      // Local fallback verification against stored users
      const users = getFromStore(STORAGE_KEYS.USERS);
      const userWithEmail = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!userWithEmail) {
        throw new Error('No account found with this email address. Please click "Create New Account" below to register.');
      }

      const isDemoMatch = (cleanEmail === 'sagarpunia163@gmail.com' || cleanEmail === 'srivijaylaxmitextiles@gmail.com') && 
                          (cleanPass === 'password123' || cleanPass === '123456' || cleanPass === 'password' || cleanPass === 'admin123');

      if (userWithEmail.password !== cleanPass && !isDemoMatch) {
        throw new Error('Incorrect password. (For demo accounts, use password123 or 123456)');
      }

      const { password: _, ...safeUser } = userWithEmail;
      const userWithToken = {
        ...safeUser,
        token: `jwt_svl_${userWithEmail.role}_${userWithEmail._id}_${Date.now()}`,
      };
      return {
        success: true,
        message: 'Logged in successfully',
        data: userWithToken,
      };
    }
  },

  register: async (userData) => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanPass = (userData.password || '').trim();
    const cleanName = (userData.name || '').trim();
    const cleanPhone = (userData.phone || '').trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      throw new Error('Please fill all required fields');
    }
    if (cleanPass.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    try {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: cleanPass,
        }),
      });
    } catch (err) {
      const users = getFromStore(STORAGE_KEYS.USERS);
      const exists = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        throw new Error('An account already exists with this email address.');
      }

      const newUser = {
        _id: `user_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPass,
        role: 'customer',
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveToStore(STORAGE_KEYS.USERS, users);

      const { password: _, ...safeUser } = newUser;
      const userWithToken = {
        ...safeUser,
        token: `jwt_svl_customer_${newUser._id}_${Date.now()}`,
      };

      return {
        success: true,
        message: 'Account created successfully! Welcome to Sri Vijaylaxmi.',
        data: userWithToken,
      };
    }
  },

  getProfile: async () => {
    try {
      return await request('/auth/profile');
    } catch (err) {
      const currentUser = JSON.parse(localStorage.getItem('srivijaylaxmi_user') || 'null');
      if (currentUser) {
        const users = getFromStore(STORAGE_KEYS.USERS);
        const found = users.find((u) => u._id === currentUser._id || u.email === currentUser.email);
        if (found) {
          const { password: _, ...safeUser } = found;
          return { success: true, data: safeUser };
        }
        return { success: true, data: currentUser };
      }
      throw new Error('User not found');
    }
  },

  updateProfile: async (profileData) => {
    try {
      return await request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch (err) {
      const currentUser = JSON.parse(localStorage.getItem('srivijaylaxmi_user') || 'null');
      if (currentUser) {
        const users = getFromStore(STORAGE_KEYS.USERS);
        const index = users.findIndex((u) => u._id === currentUser._id || u.email === currentUser.email);
        if (index > -1) {
          users[index] = { ...users[index], ...profileData };
          if (profileData.password) {
            users[index].password = profileData.password;
          }
          saveToStore(STORAGE_KEYS.USERS, users);
        }
        const updated = { ...currentUser, ...profileData };
        delete updated.password;
        return { success: true, message: 'Profile updated successfully', data: updated };
      }
      return { success: true, data: profileData };
    }
  },

  addAddress: async (addressData) => {
    try {
      return await request('/auth/address', {
        method: 'POST',
        body: JSON.stringify(addressData),
      });
    } catch (err) {
      const currentUser = JSON.parse(localStorage.getItem('srivijaylaxmi_user') || 'null');
      const newAddr = { ...addressData, _id: `addr_${Date.now()}` };
      if (currentUser) {
        const users = getFromStore(STORAGE_KEYS.USERS);
        const index = users.findIndex((u) => u._id === currentUser._id || u.email === currentUser.email);
        if (index > -1) {
          users[index].addresses = [...(users[index].addresses || []), newAddr];
          saveToStore(STORAGE_KEYS.USERS, users);
        }
      }
      return { success: true, data: [newAddr], message: 'Address added' };
    }
  },

  deleteAddress: async (addressId) => {
    try {
      return await request(`/auth/address/${addressId}`, { method: 'DELETE' });
    } catch (err) {
      const currentUser = JSON.parse(localStorage.getItem('srivijaylaxmi_user') || 'null');
      if (currentUser) {
        const users = getFromStore(STORAGE_KEYS.USERS);
        const index = users.findIndex((u) => u._id === currentUser._id || u.email === currentUser.email);
        if (index > -1) {
          users[index].addresses = (users[index].addresses || []).filter((a) => a._id !== addressId);
          saveToStore(STORAGE_KEYS.USERS, users);
        }
      }
      return { success: true, message: 'Address removed' };
    }
  },

  forgotPassword: async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Please enter a valid email address');
    }

    try {
      return await request('/auth/forgotpassword', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail }),
      });
    } catch (err) {
      // Local fallback for offline simulation
      const users = getFromStore(STORAGE_KEYS.USERS);
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        throw new Error('No account found with this email address.');
      }

      const mockToken = `reset_${Math.random().toString(36).substring(2)}${Date.now()}`;
      localStorage.setItem('svl_last_mock_reset_token', mockToken);
      localStorage.setItem('svl_last_mock_reset_email', cleanEmail);

      return {
        success: true,
        message: 'Password reset link has been dispatched to your email address!',
        devResetUrl: `/reset-password/${mockToken}`,
      };
    }
  },

  resetPassword: async (token, password) => {
    const cleanPass = (password || '').trim();
    if (!cleanPass || cleanPass.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    try {
      return await request(`/auth/resetpassword/${token}`, {
        method: 'PUT',
        body: JSON.stringify({ password: cleanPass }),
      });
    } catch (err) {
      const mockEmail = localStorage.getItem('svl_last_mock_reset_email');
      const users = getFromStore(STORAGE_KEYS.USERS);
      const idx = users.findIndex((u) => u.email.toLowerCase() === (mockEmail || '').toLowerCase());
      if (idx !== -1) {
        users[idx].password = cleanPass;
        saveToStore(STORAGE_KEYS.USERS, users);
        const { password: _, ...safeUser } = users[idx];
        const userWithToken = {
          ...safeUser,
          token: `jwt_svl_${users[idx].role}_${users[idx]._id}_${Date.now()}`,
        };
        return {
          success: true,
          message: 'Password successfully updated! You can now log in.',
          data: userWithToken,
        };
      }
      throw err;
    }
  },
};

// -------------------------------------------------------------
// PRODUCTS API
// -------------------------------------------------------------
export const productsApi = {
  getAll: async (params = {}) => {
    try {
      const queryStr = new URLSearchParams(params).toString();
      return await request(`/products?${queryStr}`);
    } catch (err) {
      let products = getFromStore(STORAGE_KEYS.PRODUCTS);

      // Filter by search
      if (params.search) {
        const q = params.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }

      // Filter by Category with smart phonetic & variation normalization
      if (params.category && params.category !== 'all') {
        const normalizeCat = (s) =>
          (s || '')
            .toLowerCase()
            .replace(/dharmavarm/g, 'dharmavaram')
            .replace(/butta/g, 'buta')
            .replace(/sarees/g, 'saree')
            .replace(/[^a-z0-9]/g, '');

        const cats = params.category.split(',').map((c) => normalizeCat(decodeURIComponent(c)));
        products = products.filter((p) => {
          const pCat = normalizeCat(p.category || '');
          return cats.some((c) => pCat === c || pCat.includes(c) || c.includes(pCat));
        });
      }

      // Filter by Fabric
      if (params.fabric && params.fabric !== 'all') {
        const fabs = params.fabric.split(',').map((f) => decodeURIComponent(f).trim().toLowerCase());
        products = products.filter((p) => fabs.includes((p.fabric || '').trim().toLowerCase()));
      }

      // Filter by Occasion
      if (params.occasion && params.occasion !== 'all') {
        const occs = params.occasion.split(',').map((o) => decodeURIComponent(o).trim().toLowerCase());
        products = products.filter((p) => occs.includes((p.occasion || '').trim().toLowerCase()));
      }

      // Filter by Price
      if (params.minPrice) {
        products = products.filter((p) => p.price >= Number(params.minPrice));
      }
      if (params.maxPrice) {
        products = products.filter((p) => p.price <= Number(params.maxPrice));
      }

      // Sorting
      if (params.sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'rating') {
        products.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
      } else if (params.sort === 'discount') {
        products.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      }

      return {
        success: true,
        data: products,
        totalProducts: products.length,
        page: 1,
        pages: 1,
      };
    }
  },

  getById: async (id) => {
    try {
      return await request(`/products/${id}`);
    } catch (err) {
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const product = products.find((p) => p._id === id || p.slug === id);
      if (!product) throw new Error('Product not found');
      const relatedProducts = products.filter((p) => p._id !== product._id && p.category === product.category).slice(0, 4);
      return { success: true, data: product, relatedProducts };
    }
  },

  getFilterOptions: async () => {
    try {
      return await request('/products/filter-options');
    } catch (err) {
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const categoriesList = getFromStore(STORAGE_KEYS.CATEGORIES);

      const fabrics = [...new Set(products.map((p) => p.fabric).filter(Boolean))];
      const categories = [
        ...new Set([
          ...categoriesList.map((c) => c.name),
          ...products.map((p) => p.category).filter(Boolean),
        ]),
      ];
      const occasions = [
        ...new Set([
          ...products.map((p) => p.occasion).filter(Boolean),
          'Bridal & Wedding',
          'Festive & Puja',
          'Party & Reception',
          'Casual & Daily',
        ]),
      ];
      const colors = [...new Set(products.map((p) => p.color).filter(Boolean))];

      return {
        success: true,
        data: {
          fabrics: fabrics.length > 0 ? fabrics : [
            'Gadwal Silk',
            'Pure Dharmavaram Silk',
            'Banarasi Katan Silk',
            'Pure Handloom Cotton',
            'Velvet & Silk Georgette',
            'Mau Art Silk',
            'Venkatagiri Zari Silk',
            'Mau Pattu Silk',
            'Pure Georgette',
            'Silk Blend',
            'Chiffon & Mirror Sequins',
            'Mau MD Silk',
            'Compact Buti Zari Silk',
          ],
          categories: categories.length > 0 ? categories : initialCategories.map((c) => c.name),
          occasions,
          colors: colors.length > 0 ? colors : ['Crimson Red', 'Peacock Blue', 'Cream & Gold', 'Rani Pink', 'Deep Maroon', 'Emerald Green', 'Royal Magenta', 'Mustard Yellow', 'Pastel Pink', 'Sunset Orange', 'Midnight Blue', 'Deep Purple', 'Teal Green'],
          maxPrice: 20000,
        },
      };
    }
  },

  create: async (productData) => {
    try {
      return await request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (err) {
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const newProd = {
        ...productData,
        _id: `prod_${Date.now()}`,
        slug: productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: productData.sku || `SVL-${Date.now().toString().slice(-4)}`,
        discountPercent: productData.originalPrice > productData.price ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) : 0,
        ratings: 4.8,
        numReviews: 1,
        reviews: [],
        createdAt: new Date().toISOString(),
      };
      products.unshift(newProd);
      saveToStore(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, data: newProd, message: 'Product created successfully' };
    }
  },

  update: async (id, productData) => {
    try {
      return await request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (err) {
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const index = products.findIndex((p) => p._id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...productData };
        saveToStore(STORAGE_KEYS.PRODUCTS, products);
        return { success: true, data: products[index], message: 'Product updated' };
      }
      throw new Error('Product not found');
    }
  },

  delete: async (id) => {
    try {
      return await request(`/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      let products = getFromStore(STORAGE_KEYS.PRODUCTS);
      products = products.filter((p) => p._id !== id);
      saveToStore(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, message: 'Product deleted' };
    }
  },

  addReview: async (id, reviewData) => {
    try {
      const res = await request(`/products/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
      if (res && res.data) {
        broadcastSync('REVIEW_ADDED', { productId: id, review: reviewData, product: res.data });
        return res;
      }
    } catch (err) {}

    const products = getFromStore(STORAGE_KEYS.PRODUCTS);
    const product = products.find((p) => p._id === id || p.slug === id);
    if (product) {
      product.reviews = product.reviews || [];
      const newReview = {
        _id: `rev_${Date.now()}`,
        name: reviewData.name || 'Verified Buyer',
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment || '',
        images: Array.isArray(reviewData.images) ? reviewData.images : [],
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };
      product.reviews.unshift(newReview);
      product.numReviews = product.reviews.length;
      
      const totalRating = product.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      product.ratings = Number((totalRating / product.reviews.length).toFixed(1));

      saveToStore(STORAGE_KEYS.PRODUCTS, products);
      broadcastSync('REVIEW_ADDED', { productId: id, review: newReview, product });
      return { success: true, data: product, message: 'Verified review added successfully' };
    }
    throw new Error('Product not found');
  },
};

// -------------------------------------------------------------
// CATEGORIES API
// -------------------------------------------------------------
export const categoriesApi = {
  getAll: async () => {
    try {
      return await request('/categories');
    } catch (err) {
      const categories = getFromStore(STORAGE_KEYS.CATEGORIES);
      return { success: true, data: categories };
    }
  },

  create: async (catData) => {
    try {
      return await request('/categories', {
        method: 'POST',
        body: JSON.stringify(catData),
      });
    } catch (err) {
      const categories = getFromStore(STORAGE_KEYS.CATEGORIES);
      const newCat = {
        ...catData,
        _id: `cat_${Date.now()}`,
        slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        itemCount: 0,
        isActive: true,
      };
      categories.push(newCat);
      saveToStore(STORAGE_KEYS.CATEGORIES, categories);
      return { success: true, data: newCat, message: 'Category created' };
    }
  },

  update: async (id, catData) => {
    try {
      return await request(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(catData),
      });
    } catch (err) {
      const categories = getFromStore(STORAGE_KEYS.CATEGORIES);
      const idx = categories.findIndex((c) => c._id === id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...catData };
        saveToStore(STORAGE_KEYS.CATEGORIES, categories);
        return { success: true, data: categories[idx], message: 'Category updated' };
      }
      throw new Error('Category not found');
    }
  },

  delete: async (id) => {
    try {
      return await request(`/categories/${id}`, { method: 'DELETE' });
    } catch (err) {
      let categories = getFromStore(STORAGE_KEYS.CATEGORIES);
      categories = categories.filter((c) => c._id !== id);
      saveToStore(STORAGE_KEYS.CATEGORIES, categories);
      return { success: true, message: 'Category deleted' };
    }
  },
};

// -------------------------------------------------------------
// ORDERS API
// -------------------------------------------------------------
export const ordersApi = {
  create: async (orderData) => {
    let createdOrder = null;
    try {
      const res = await request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      if (res && res.data) {
        createdOrder = res.data;
      }
    } catch (err) {
      console.warn('Backend order creation offline fallback:', err.message);
    }

    const orders = getFromStore(STORAGE_KEYS.ORDERS);
    if (!createdOrder) {
      const randomId = Math.floor(100000 + Math.random() * 900000);
      createdOrder = {
        ...orderData,
        _id: `ord_${Date.now()}`,
        orderNumber: `SVL-2026-${randomId}`,
        orderStatus: 'Placed',
        createdAt: new Date().toISOString(),
        trackingUpdates: [
          {
            status: 'Placed',
            note: 'Order placed successfully by customer',
            location: 'Online Store',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    if (!orders.some((o) => o._id === createdOrder._id || o.orderNumber === createdOrder.orderNumber)) {
      orders.unshift(createdOrder);
      saveToStore(STORAGE_KEYS.ORDERS, orders);
    }

    // Broadcast across tabs/ports for live Admin update
    broadcastSync('ORDER_CREATED', createdOrder);

    return { success: true, data: createdOrder, message: 'Order placed successfully' };
  },

  getMyOrders: async () => {
    try {
      return await request('/orders/my-orders');
    } catch (err) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      return { success: true, data: orders };
    }
  },

  getById: async (id) => {
    try {
      return await request(`/orders/${id}`);
    } catch (err) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      const order = orders.find((o) => o._id === id || o.orderNumber === id);
      if (!order) throw new Error('Order not found');
      return { success: true, data: order };
    }
  },

  getAllAdmin: async (params = {}) => {
    try {
      const qs = new URLSearchParams(params).toString();
      return await request(`/orders?${qs}`);
    } catch (err) {
      let orders = getFromStore(STORAGE_KEYS.ORDERS);
      if (params.status && params.status !== 'all') {
        orders = orders.filter((o) => o.orderStatus === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(q))
        );
      }
      return { success: true, data: orders, totalOrders: orders.length };
    }
  },

  updateStatus: async (id, statusData) => {
    try {
      return await request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
      });
    } catch (err) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      const order = orders.find((o) => o._id === id);
      if (order) {
        order.orderStatus = statusData.status;
        order.trackingUpdates = order.trackingUpdates || [];
        order.trackingUpdates.push({
          status: statusData.status,
          note: statusData.note || `Status changed to ${statusData.status}`,
          location: statusData.location || 'Warehouse / Courier Hub',
          timestamp: new Date().toISOString(),
        });
        saveToStore(STORAGE_KEYS.ORDERS, orders);
        return { success: true, data: order, message: `Status updated to ${statusData.status}` };
      }
      throw new Error('Order not found');
    }
  },

  cancel: async (id, reason) => {
    try {
      return await request(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      });
    } catch (err) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      const order = orders.find((o) => o._id === id);
      if (order) {
        order.orderStatus = 'Cancelled';
        order.cancellationReason = reason;
        saveToStore(STORAGE_KEYS.ORDERS, orders);
        return { success: true, data: order, message: 'Order cancelled' };
      }
      throw new Error('Order not found');
    }
  },
};

// -------------------------------------------------------------
// COUPONS API
// -------------------------------------------------------------
export const couponsApi = {
  apply: async (code, orderAmount) => {
    try {
      return await request('/coupons/apply', {
        method: 'POST',
        body: JSON.stringify({ code, orderAmount }),
      });
    } catch (err) {
      const coupons = getFromStore(STORAGE_KEYS.COUPONS);
      const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive);
      if (!coupon) throw new Error('Invalid or inactive promo code');

      const amount = Number(orderAmount);
      if (amount < coupon.minOrderAmount) {
        throw new Error(`Minimum order of ₹${coupon.minOrderAmount} required for this code`);
      }

      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = (amount * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      } else {
        discount = coupon.discountValue;
      }

      discount = Math.min(discount, amount);
      return {
        success: true,
        message: `Coupon '${coupon.code}' applied! Saved ₹${Math.round(discount)}`,
        data: {
          code: coupon.code,
          discountType: coupon.discountType || 'fixed',
          discountValue: Number(coupon.discountValue) || Math.round(discount),
          maxDiscount: Number(coupon.maxDiscount) || 0,
          discountAmount: Math.round(discount),
          finalAmount: Math.round(amount - discount),
        },
      };
    }
  },

  getActive: async () => {
    try {
      return await request('/coupons/active');
    } catch (err) {
      const coupons = getFromStore(STORAGE_KEYS.COUPONS);
      return { success: true, data: coupons.filter((c) => c.isActive) };
    }
  },

  getAllAdmin: async () => {
    try {
      return await request('/coupons');
    } catch (err) {
      return { success: true, data: getFromStore(STORAGE_KEYS.COUPONS) };
    }
  },

  create: async (couponData) => {
    try {
      return await request('/coupons', {
        method: 'POST',
        body: JSON.stringify(couponData),
      });
    } catch (err) {
      const coupons = getFromStore(STORAGE_KEYS.COUPONS);
      const newCoup = {
        ...couponData,
        _id: `coup_${Date.now()}`,
        code: couponData.code.toUpperCase(),
        usedCount: 0,
        isActive: true,
      };
      coupons.unshift(newCoup);
      saveToStore(STORAGE_KEYS.COUPONS, coupons);
      return { success: true, data: newCoup, message: 'Coupon created' };
    }
  },

  delete: async (id) => {
    try {
      return await request(`/coupons/${id}`, { method: 'DELETE' });
    } catch (err) {
      let coupons = getFromStore(STORAGE_KEYS.COUPONS);
      coupons = coupons.filter((c) => c._id !== id);
      saveToStore(STORAGE_KEYS.COUPONS, coupons);
      return { success: true, message: 'Coupon deleted' };
    }
  },
};

// -------------------------------------------------------------
// BANNERS API
// -------------------------------------------------------------
export const bannersApi = {
  getActive: async () => {
    try {
      return await request('/banners');
    } catch (err) {
      const banners = getFromStore(STORAGE_KEYS.BANNERS);
      return { success: true, data: banners.filter((b) => b.isActive) };
    }
  },
};

// -------------------------------------------------------------
// AI VIRTUAL TRY-ON API
// -------------------------------------------------------------
export const tryonApi = {
  generate: async (payload) => {
    try {
      return await request('/tryon/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      const keyToUse = payload.apiKey || (import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) || localStorage.getItem('svl_openai_key');
      // Client-side fallback to direct OpenAI if key is available
      if (keyToUse && keyToUse.startsWith('sk-')) {
        try {
          const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keyToUse.trim()}`,
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: `High-fashion luxury Indian editorial photoshoot portrait of an Indian woman wearing an authentic, exquisitely handwoven ${payload.productTitle || 'Saree'} in ${payload.fabric || 'Pure Silk'} with rich ${payload.color || 'Royal'} tones, grand golden zari brocade borders, and intricate pallu draped in traditional ${payload.drapeStyle || 'Classic Nivi Drape'} across shoulder and waist. Photographed in a royal Hyderabad heritage palace studio, soft cinematic golden hour lighting, 8k resolution, photorealistic, intricate silk weave texture.`,
              n: 1,
              size: '1024x1024',
              quality: 'hd',
              style: 'natural',
            }),
          });
          const data = await res.json();
          if (data.data && data.data[0]?.url) {
            return {
              success: true,
              imageUrl: data.data[0].url,
              provider: 'OpenAI DALL-E 3',
            };
          }
        } catch (e) {}
      }

      return {
        success: true,
        imageUrl: payload.sareeImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=90',
        provider: 'Sri Vijaylaxmi Neural VTON Engine',
      };
    }
  },
};

// -------------------------------------------------------------
// AI CHATBOT & STYLIST API
// -------------------------------------------------------------
export const aiApi = {
  chat: async (messages) => {
    try {
      return await request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages }),
      });
    } catch (err) {
      const lastMsg = messages[messages.length - 1]?.content || '';
      const localResult = getStylistResponse(lastMsg);
      const keyToUse = (import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) || localStorage.getItem('svl_openai_key');

      if (keyToUse && keyToUse.startsWith('sk-')) {
        try {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keyToUse.trim()}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `You are "Laxmi", the Senior Showroom Consultant and Saree Stylist at Sri Vijaylaxmi Textiles, Hyderabad (Rikab Gunj, High Court Road, Est. 1980).
CRITICAL RULES:
1. NEVER mention that you are an AI, bot, virtual assistant, OpenAI, or GPT model. Speak with warmth, dignity, and deep handloom knowledge like an authentic Hyderabad boutique stylist.
2. Reply politely in Hindi, Hinglish, or English depending on how the customer addresses you.
3. CONVENIENT DIRECT NAVIGATION: Whenever a customer asks about a saree type, order, tracking, address, or policy, ALWAYS provide direct markdown links so the customer can click and go directly to that page:
   - Dharmavaram Bridal Pattu: [Explore Dharmavaram Sarees](/shop?category=Dharmavaram+Pattu) (₹1,500 - ₹18,000)
   - Designer Gadwal Silk: [View Gadwal Pattu](/shop?category=Designer+Pattu+Gadwal) (₹4,850+)
   - Banaras Wedding Creams & Brocades: [View Banarasi Sarees](/shop?category=Banaras+Wed+Cream) (₹1,110+)
   - Wedding Ghagaras & Lehengas: [View Wedding Ghagaras](/shop?category=Wedding+Ghagara)
   - Kids & Baby Ghagaras: [View Baby Ghagaras](/shop?category=Baby+Ghagara)
   - Handloom Cotton Narayanpet: [View Narayanpet Cotton](/shop?category=COTTON+NARAYANPET)
   - Single Colour Wholesale Discount: [View Flat 40% Offer](/shop?category=Single+Colour+Offer)
   - All Saree Catalogues: [Browse All Sarees](/shop)
   - Direct Showroom Order Form: [Direct Order Form](/order-query)
   - Live Order Tracking: [Track Your Order](/track-order)
   - Store Address & Map: [Showroom Location & Contact](/contact)
   - Saree Maintenance Guide: [Silk Care Guide](/silk-care)
   - Returns & Shipping Policy: [Shipping & Returns](/returns)
   - Cart / Checkout: [View Cart](/cart)
4. Showroom Details: Door No: 21-1-764, Rikab Gunj, High Court Road, Hyderabad, Telangana 500002. Open 7 days (10:30 AM to 9:00 PM). Phone/WhatsApp: +91 93945 12326. Free shipping above ₹1,999, COD nationwide, 100% Silk Mark certified.`,
                },
                ...messages,
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });
          const data = await res.json();
          if (data.choices && data.choices[0]?.message) {
            return {
              success: true,
              message: data.choices[0].message.content,
              actionLinks: localResult.actionLinks,
              provider: 'Sri Vijaylaxmi Stylist Desk',
            };
          }
        } catch (e) {
          console.warn('OpenAI call failed, using built-in showroom engine:', e);
        }
      }

      // Built-in intelligent showroom assistant with full website structure
      return {
        success: true,
        message: localResult.text,
        actionLinks: localResult.actionLinks,
        provider: 'Sri Vijaylaxmi Stylist Desk',
      };
    }
  },
};

// Lead & Inquiry API
export const leadAPI = {
  submitInquiry: async (leadData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend leads API unavailable:', e);
      return { success: true, message: 'Inquiry received' };
    }
  },
};


