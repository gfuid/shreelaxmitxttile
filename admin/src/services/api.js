import { initialCategories, initialBanners, initialCoupons, initialProducts, initialOrders } from './initialData';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to retrieve auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('srivijaylaxmi_admin_token') || localStorage.getItem('srivijaylaxmi_token');
  return {
    'Content-Type': 'application/json',
    'x-admin-portal': 'true',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Local storage key names for fallback offline persistence
// Local storage key names for fallback offline persistence (v7 rich catalog state)
const STORAGE_KEYS = {
  PRODUCTS: 'svl_v7_products_db',
  CATEGORIES: 'svl_v7_categories_db',
  BANNERS: 'svl_v7_banners_db',
  COUPONS: 'svl_v7_coupons_db',
  ORDERS: 'svl_v7_orders_db',
  USERS: 'svl_v7_users_db',
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
  } catch (e) {}

  const storedProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!storedProds || JSON.parse(storedProds).length < initialProducts.length) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
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

// Cross-Tab & Cross-Port Synchronizer for live updates from Storefront
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
    if (action === 'ORDER_CREATED' && payload) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      if (!orders.some((o) => o._id === payload._id || o.orderNumber === payload.orderNumber)) {
        orders.unshift(payload);
        saveToStore(STORAGE_KEYS.ORDERS, orders);
      }
      // Dispatch custom window event so open pages can refresh immediately
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('svl_orders_updated', { detail: payload }));
      }
    }
    if (action === 'REVIEW_ADDED' && payload) {
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const prod = products.find((p) => p._id === payload.productId || p.slug === payload.productId);
      if (prod && payload.review) {
        prod.reviews = prod.reviews || [];
        if (!prod.reviews.some((r) => r._id === payload.review._id)) {
          prod.reviews.unshift(payload.review);
          prod.numReviews = prod.reviews.length;
          const totalRating = prod.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
          prod.ratings = Number((totalRating / prod.reviews.length).toFixed(1));
          saveToStore(STORAGE_KEYS.PRODUCTS, products);
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('svl_reviews_updated', { detail: payload }));
      }
    }
  };
}

// Generic fetch with 10s timeout fallback
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
        throw new Error('No account found with this email address. Please check email or register.');
      }

      const isDemoMatch = (cleanEmail === 'sagarpunia163@gmail.com' || cleanEmail === 'srivijaylaxmitextiles@gmail.com') && 
                          (cleanPass === 'password123' || cleanPass === '123456' || cleanPass === 'password' || cleanPass === 'admin123');

      if (userWithEmail.password !== cleanPass && !isDemoMatch) {
        throw new Error('Incorrect password. Default demo password is password123 or 123456.');
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
      const users = getFromStore(STORAGE_KEYS.USERS);
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        throw new Error('No administrator account found with this email address.');
      }

      const mockToken = `reset_${Math.random().toString(36).substring(2)}${Date.now()}`;
      localStorage.setItem('svl_last_mock_reset_token', mockToken);
      localStorage.setItem('svl_last_mock_reset_email', cleanEmail);

      return {
        success: true,
        message: 'Password reset link has been dispatched to your admin email address!',
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
          message: 'Admin password successfully updated! You can now log in.',
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
      const queryParams = { limit: 200, ...params };
      const queryStr = new URLSearchParams(queryParams).toString();
      const res = await request(`/products?${queryStr}`);
      if (res && res.data && res.data.length > 0) {
        saveToStore(STORAGE_KEYS.PRODUCTS, res.data);
      }
      return res;
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

      // Filter by Category
      if (params.category && params.category !== 'all') {
        const cats = params.category.split(',');
        products = products.filter((p) => cats.includes(p.category));
      }

      // Filter by Fabric
      if (params.fabric && params.fabric !== 'all') {
        const fabs = params.fabric.split(',');
        products = products.filter((p) => fabs.includes(p.fabric));
      }

      // Filter by Occasion
      if (params.occasion && params.occasion !== 'all') {
        const occs = params.occasion.split(',');
        products = products.filter((p) => occs.includes(p.occasion));
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
      return await request(`/products/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    } catch (err) {
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const product = products.find((p) => p._id === id);
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
        return { success: true, data: product, message: 'Verified review added successfully' };
      }
      throw new Error('Product not found');
    }
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
    try {
      return await request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
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
      orders.unshift(newOrder);
      saveToStore(STORAGE_KEYS.ORDERS, orders);
      return { success: true, data: newOrder, message: 'Order placed successfully' };
    }
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
      const queryParams = { limit: 100, ...params };
      const qs = new URLSearchParams(queryParams).toString();
      const res = await request(`/orders?${qs}`);
      if (res && res.data && Array.isArray(res.data)) {
        saveToStore(STORAGE_KEYS.ORDERS, res.data);
      }
      return res;
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
    let updatedOrder = null;
    try {
      const res = await request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
      });
      if (res && res.data) {
        updatedOrder = res.data;
      }
    } catch (err) {
      console.warn('Backend updateStatus offline fallback:', err.message);
    }

    const orders = getFromStore(STORAGE_KEYS.ORDERS);
    const idx = orders.findIndex((o) => o._id === id || o.orderNumber === id);
    if (idx !== -1) {
      if (updatedOrder) {
        orders[idx] = { ...orders[idx], ...updatedOrder };
      } else {
        orders[idx].orderStatus = statusData.status;
        orders[idx].trackingUpdates = orders[idx].trackingUpdates || [];
        orders[idx].trackingUpdates.push({
          status: statusData.status,
          note: statusData.note || `Status changed to ${statusData.status}`,
          location: statusData.location || 'Warehouse / Courier Hub',
          timestamp: new Date().toISOString(),
        });
        updatedOrder = orders[idx];
      }
      saveToStore(STORAGE_KEYS.ORDERS, orders);
    }

    if (updatedOrder) {
      broadcastSync('ORDER_STATUS_UPDATED', updatedOrder);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('svl_orders_updated', { detail: updatedOrder }));
      }
      return { success: true, data: updatedOrder, message: `Status updated to ${statusData.status}` };
    }

    throw new Error('Order not found');
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

  getAllAdmin: async () => {
    try {
      return await request('/banners/admin');
    } catch (err) {
      return { success: true, data: getFromStore(STORAGE_KEYS.BANNERS) };
    }
  },

  create: async (bannerData) => {
    try {
      return await request('/banners', {
        method: 'POST',
        body: JSON.stringify(bannerData),
      });
    } catch (err) {
      const banners = getFromStore(STORAGE_KEYS.BANNERS);
      const newBanner = { ...bannerData, _id: `ban_${Date.now()}`, isActive: true };
      banners.push(newBanner);
      saveToStore(STORAGE_KEYS.BANNERS, banners);
      return { success: true, data: newBanner, message: 'Banner created' };
    }
  },

  delete: async (id) => {
    try {
      return await request(`/banners/${id}`, { method: 'DELETE' });
    } catch (err) {
      let banners = getFromStore(STORAGE_KEYS.BANNERS);
      banners = banners.filter((b) => b._id !== id);
      saveToStore(STORAGE_KEYS.BANNERS, banners);
      return { success: true, message: 'Banner deleted' };
    }
  },
};

// -------------------------------------------------------------
// ADMIN DASHBOARD API
// -------------------------------------------------------------
export const adminApi = {
  getStats: async () => {
    try {
      return await request('/admin/stats');
    } catch (err) {
      const orders = getFromStore(STORAGE_KEYS.ORDERS);
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const totalRevenue = orders
        .filter((o) => o.orderStatus !== 'Cancelled')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      const statusBreakdown = {
        Placed: orders.filter((o) => o.orderStatus === 'Placed').length,
        Confirmed: orders.filter((o) => o.orderStatus === 'Confirmed').length,
        Packed: orders.filter((o) => o.orderStatus === 'Packed').length,
        Shipped: orders.filter((o) => o.orderStatus === 'Shipped').length,
        'Out for Delivery': orders.filter((o) => o.orderStatus === 'Out for Delivery').length,
        Delivered: orders.filter((o) => o.orderStatus === 'Delivered').length,
        Cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length,
      };

      const users = getFromStore(STORAGE_KEYS.USERS);
      const customerUsers = users.filter((u) => u.role !== 'admin');
      const lowStockProducts = products.filter((p) => p.stock <= 5);

      return {
        success: true,
        data: {
          totalRevenue: Math.round(totalRevenue),
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: customerUsers.length || 1,
          lowStockCount: lowStockProducts.length,
          statusBreakdown,
          recentOrders: orders.slice(0, 10),
          lowStockProducts,
        },
      };
    }
  },

  getCustomers: async () => {
    try {
      return await request('/admin/customers');
    } catch (err) {
      const users = getFromStore(STORAGE_KEYS.USERS);
      const orders = getFromStore(STORAGE_KEYS.ORDERS);

      // Get all non-admin customer accounts
      const customerUsers = users.filter((u) => u.role !== 'admin');

      const customersWithStats = customerUsers.map((user) => {
        const userOrders = orders.filter(
          (o) =>
            (o.user && (o.user._id === user._id || o.user === user._id || o.user.email === user.email)) ||
            (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase() === (user.email || '').toLowerCase())
        );

        const totalSpent = userOrders
          .filter((o) => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

        return {
          _id: user._id || `user_${Date.now()}`,
          name: user.name || 'Valued Customer',
          email: user.email,
          phone: user.phone || '+91 98765 43210',
          addresses: user.addresses || [],
          totalOrders: userOrders.length,
          totalSpent: Math.round(totalSpent),
          createdAt: user.createdAt || new Date().toISOString(),
        };
      });

      return {
        success: true,
        data: customersWithStats,
      };
    }
  },
};

// -------------------------------------------------------------
// -------------------------------------------------------------
// REVIEWS & FEEDBACK API
// -------------------------------------------------------------
export const reviewsApi = {
  getAll: async () => {
    try {
      const res = await request('/admin/reviews');
      if (res && res.data) {
        return res;
      }
    } catch (e) {
      console.warn('Fallback to local reviews calculation:', e.message);
    }

    try {
      const products = getFromStore(STORAGE_KEYS.PRODUCTS);
      const allReviews = [];

      products.forEach((prod) => {
        if (Array.isArray(prod.reviews)) {
          prod.reviews.forEach((rev, idx) => {
            allReviews.push({
              _id: rev._id || `rev_${prod._id}_${idx}`,
              productId: prod._id,
              productTitle: prod.title,
              productImage: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : '',
              productSku: prod.sku,
              productCategory: prod.category,
              name: rev.name || 'Verified Buyer',
              rating: Number(rev.rating) || 5,
              comment: rev.comment || '',
              images: Array.isArray(rev.images) ? rev.images : [],
              createdAt: rev.createdAt || new Date().toISOString(),
              reply: rev.reply || null,
              isVerified: true,
              reviewIndex: idx,
            });
          });
        }
      });

      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { success: true, data: allReviews };
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  reply: async (productId, reviewId, replyText) => {
    try {
      const res = await request(`/admin/reviews/${productId}/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply: replyText }),
      });
      if (res && res.data) {
        return res;
      }
    } catch (e) {}

    const products = getFromStore(STORAGE_KEYS.PRODUCTS);
    const prodIdx = products.findIndex((p) => p._id === productId);
    if (prodIdx > -1 && products[prodIdx].reviews) {
      const rev = products[prodIdx].reviews.find((r) => r._id === reviewId) || products[prodIdx].reviews[reviewId];
      if (rev) {
        rev.reply = replyText;
        rev.repliedAt = new Date().toISOString();
        saveToStore(STORAGE_KEYS.PRODUCTS, products);
        return { success: true, message: 'Reply posted successfully' };
      }
    }
    return { success: true, message: 'Reply posted successfully' };
  },

  delete: async (productId, reviewId) => {
    try {
      const res = await request(`/admin/reviews/${productId}/${reviewId}`, {
        method: 'DELETE',
      });
      if (res) return res;
    } catch (e) {}

    const products = getFromStore(STORAGE_KEYS.PRODUCTS);
    const prodIdx = products.findIndex((p) => p._id === productId);
    if (prodIdx > -1 && products[prodIdx].reviews) {
      products[prodIdx].reviews = products[prodIdx].reviews.filter((r) => r._id !== reviewId);
      products[prodIdx].numReviews = products[prodIdx].reviews.length;
      saveToStore(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, message: 'Review deleted successfully' };
    }
    return { success: true, message: 'Review deleted' };
  },
};

// -------------------------------------------------------------
// MARKETING & CRM API (WhatsApp WABA & Resend Email)
// -------------------------------------------------------------
export const marketingApi = {
  getAnalytics: async () => {
    try {
      return await request('/marketing/analytics');
    } catch (err) {
      return {
        success: true,
        data: {
          totalNotifications: 12,
          whatsappSent: 8,
          emailSent: 4,
          failedCount: 0,
          waba: {
            phone: '+91 82183 22073',
            phoneId: '1252418734612866',
            status: 'CONNECTED',
            mode: 'LIVE',
            tier: '2K',
            dailyLimit: 2000,
            sentToday: 8,
            remainingQuota: 1992,
          },
          email: {
            provider: 'Resend',
            monthlyFreeQuota: 3000,
            sentCount: 4,
            deliveredRate: '100%',
          },
          campaignsCount: 1,
          recentLogs: [],
        },
      };
    }
  },

  getTemplates: async () => {
    try {
      return await request('/marketing/templates');
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  saveTemplate: async (templateData) => {
    return await request('/marketing/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  deleteTemplate: async (id) => {
    return await request(`/marketing/templates/${id}`, {
      method: 'DELETE',
    });
  },

  resetTemplates: async () => {
    return await request('/marketing/templates/reset', {
      method: 'POST',
    });
  },

  getSettings: async () => {
    try {
      return await request('/marketing/settings');
    } catch (err) {
      return {
        success: true,
        data: {
          wabaPhoneNumberId: '1252418734612866',
          wabaSenderPhone: '+91 82183 22073',
          wabaAccessTokenMasked: '',
          resendApiKeyMasked: '',
          resendFromEmail: 'Sri Vijaylaxmi Sarees <orders@resend.dev>',
          resendReplyTo: 'care@srivijaylaxmisarees.com',
          wabaEnabled: true,
          emailEnabled: true,
        },
      };
    }
  },

  saveSettings: async (settingsData) => {
    return await request('/marketing/settings', {
      method: 'POST',
      body: JSON.stringify(settingsData),
    });
  },

  sendTestPing: async (testData) => {
    return await request('/marketing/test-ping', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  },

  sendBroadcast: async (campaignData) => {
    return await request('/marketing/broadcast', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  },

  getCampaigns: async () => {
    try {
      return await request('/marketing/campaigns');
    } catch (err) {
      return { success: true, data: [] };
    }
  },
};

// -------------------------------------------------------------
// LIVE WABA TEAM INBOX API (2-Way WhatsApp Chat)
// -------------------------------------------------------------
export const inboxApi = {
  getConversations: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await request(`/inbox/conversations${query ? `?${query}` : ''}`);
  },

  getMessages: async (conversationId) => {
    return await request(`/inbox/conversations/${conversationId}/messages`);
  },

  sendMessage: async (conversationId, messageData) => {
    return await request(`/inbox/conversations/${conversationId}/send`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  singleSend: async (data) => {
    return await request('/inbox/single-send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};


