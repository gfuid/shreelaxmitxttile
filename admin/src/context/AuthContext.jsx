import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Synchronous initialization so page refreshes retain logged-in user instantly
  const [user, setUser] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem('srivijaylaxmi_admin_user');
      if (savedAdmin) return JSON.parse(savedAdmin);

      const generalUser = localStorage.getItem('srivijaylaxmi_user');
      if (generalUser) {
        const parsed = JSON.parse(generalUser);
        if (parsed.role === 'admin') return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem('srivijaylaxmi_admin_token') ||
      localStorage.getItem('srivijaylaxmi_token') ||
      null
    );
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        const adminData = {
          ...res.data,
          role: 'admin',
        };
        setUser(adminData);
        setToken(adminData.token || 'jwt_admin_session');
        localStorage.setItem('srivijaylaxmi_admin_user', JSON.stringify(adminData));
        localStorage.setItem('srivijaylaxmi_admin_token', adminData.token || 'jwt_admin_session');
        localStorage.setItem('srivijaylaxmi_user', JSON.stringify(adminData));
        localStorage.setItem('srivijaylaxmi_token', adminData.token || 'jwt_admin_session');
        return { success: true, data: adminData };
      }
      throw new Error(res.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register({
        ...userData,
        role: 'admin',
      });
      if (res.success && res.data) {
        const adminData = {
          ...res.data,
          role: 'admin',
        };
        setUser(adminData);
        setToken(adminData.token || 'jwt_admin_session');
        localStorage.setItem('srivijaylaxmi_admin_user', JSON.stringify(adminData));
        localStorage.setItem('srivijaylaxmi_admin_token', adminData.token || 'jwt_admin_session');
        localStorage.setItem('srivijaylaxmi_user', JSON.stringify(adminData));
        localStorage.setItem('srivijaylaxmi_token', adminData.token || 'jwt_admin_session');
        return { success: true, data: adminData };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('srivijaylaxmi_admin_user');
    localStorage.removeItem('srivijaylaxmi_admin_token');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('srivijaylaxmi_admin_user', JSON.stringify(updated));
      return res;
    } catch (err) {
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('srivijaylaxmi_admin_user', JSON.stringify(updated));
      return { success: true, data: updated };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: true,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
