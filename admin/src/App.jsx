import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Admin Layout & Pages
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminCoupons from './pages/AdminCoupons';
import AdminBanners from './pages/AdminBanners';
import AdminCustomers from './pages/AdminCustomers';
import AdminReviews from './pages/AdminReviews';
import AdminMarketing from './pages/AdminMarketing';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminForgotPasswordPage from './pages/AdminForgotPasswordPage';
import AdminResetPasswordPage from './pages/AdminResetPasswordPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Login & Password Recovery Routes */}
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<AdminResetPasswordPage />} />

          {/* Admin Management Protected Routes */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="customers" element={<AdminCustomers />} />
            {/* Fallback alias for /admin */}
            <Route path="admin/*" element={<Navigate to="/" replace />} />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
