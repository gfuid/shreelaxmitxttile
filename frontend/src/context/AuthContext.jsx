import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Synchronous initialization prevents flash of logged-out state on refresh
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('srivijaylaxmi_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('srivijaylaxmi_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Keep in sync with local storage if modified in another tab
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem('srivijaylaxmi_user');
        const savedToken = localStorage.getItem('srivijaylaxmi_token');
        setUser(savedUser ? JSON.parse(savedUser) : null);
        setToken(savedToken || null);
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.token || 'mock_token');
        localStorage.setItem('srivijaylaxmi_user', JSON.stringify(res.data));
        if (res.data.token) {
          localStorage.setItem('srivijaylaxmi_token', res.data.token);
        }
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.token || 'mock_token');
        localStorage.setItem('srivijaylaxmi_user', JSON.stringify(res.data));
        if (res.data.token) {
          localStorage.setItem('srivijaylaxmi_token', res.data.token);
        }
        return res;
      }
      throw new Error(res.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('srivijaylaxmi_user');
    localStorage.removeItem('srivijaylaxmi_token');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('srivijaylaxmi_user', JSON.stringify(updated));
      return res;
    } catch (err) {
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('srivijaylaxmi_user', JSON.stringify(updated));
      return { success: true };
    }
  };

  const addAddress = async (addressData) => {
    const newAddr = { ...addressData, _id: `addr_${Date.now()}` };
    const updatedAddresses = [...(user?.addresses || []), newAddr];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('srivijaylaxmi_user', JSON.stringify(updatedUser));
    return newAddr;
  };

  const deleteAddress = async (addressId) => {
    const updatedAddresses = (user?.addresses || []).filter((a) => a._id !== addressId);
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('srivijaylaxmi_user', JSON.stringify(updatedUser));
  };

  // Quick switch role (Dev Helper)
  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      const adminUser = {
        _id: 'admin_1',
        name: 'Sri Vijaylaxmi Admin',
        email: 'admin@srivijaylaxmi.com',
        phone: '+91 98765 43210',
        role: 'admin',
        addresses: [],
      };
      setUser(adminUser);
      localStorage.setItem('srivijaylaxmi_user', JSON.stringify(adminUser));
    } else {
      const customerUser = {
        _id: 'user_cust',
        name: 'Pooja Sharma',
        email: 'user@srivijaylaxmi.com',
        phone: '+91 98112 34567',
        role: 'customer',
        addresses: [
          {
            _id: 'addr_1',
            fullName: 'Pooja Sharma',
            phone: '+91 98112 34567',
            street: 'Flat 402, Lotus Grandeur, Sector 62',
            landmark: 'Opposite Cyber Park',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201309',
            isDefault: true,
          },
        ],
      };
      setUser(customerUser);
      localStorage.setItem('srivijaylaxmi_user', JSON.stringify(customerUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
