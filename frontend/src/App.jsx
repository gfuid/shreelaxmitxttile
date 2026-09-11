import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Storefront Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AiChatbot from './components/AiChatbot';
import WhatsAppButton from './components/WhatsAppButton';
import MobileBottomNav from './components/MobileBottomNav';
import SareeLoader from './components/common/SareeLoader';

// Storefront Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CollectionsPage from './pages/CollectionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrderQueryPage from './pages/OrderQueryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import WishlistPage from './pages/WishlistPage';
import SilkCarePage from './pages/SilkCarePage';
import ReturnsPolicyPage from './pages/ReturnsPolicyPage';
import TermsPrivacyPage from './pages/TermsPrivacyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccountPage from './pages/AccountPage';

// Royal Route Navigation Bar (displays golden zari silk shimmer on page changes)
const RouteLoadingBar = () => {
  const location = useLocation();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(true);
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  if (!navigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1 bg-transparent overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-[#BE185D] via-[#D97706] to-[#E8A87C] animate-royal-gleam shadow-md"></div>
    </div>
  );
};

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 950);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {initialLoading && (
            <SareeLoader
              size="fullscreen"
              message="Sri Vijay Laxmi Sarees & Textiles"
              subtext="Pure Handloom Silk Mark Certified • Rikab Gunj, Hyderabad"
            />
          )}
          <Router>
            <ScrollToTop />
            <RouteLoadingBar />
            <div className="flex flex-col min-h-screen pb-16 md:pb-0">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  {/* Public Customer Storefront Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/order-query" element={<OrderQueryPage />} />
                  <Route path="/silk-care" element={<SilkCarePage />} />
                  <Route path="/returns" element={<ReturnsPolicyPage />} />
                  <Route path="/terms" element={<TermsPrivacyPage />} />
                  <Route path="/privacy" element={<TermsPrivacyPage />} />
                  <Route path="/faq" element={<TermsPrivacyPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                  <Route path="/orders" element={<MyOrdersPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  {/* Auth / Login disabled: Redirect directly to Home */}
                  <Route path="/account" element={<Navigate to="/" replace />} />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="/register" element={<Navigate to="/" replace />} />
                  <Route path="/forgot-password" element={<Navigate to="/" replace />} />
                  <Route path="/reset-password/:token" element={<Navigate to="/" replace />} />

                  {/* 404 Fallback */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </div>
              <Footer />

              {/* Global AI Stylist Chatbot & WhatsApp Support */}
              <AiChatbot />
              <WhatsAppButton />

              {/* Mobile Bottom Navigation Bar matching reference site */}
              <MobileBottomNav />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
