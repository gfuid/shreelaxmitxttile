import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { 
  Store, 
  ShieldCheck, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Bell,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const AdminLayout = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#700B1A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Route title mapper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/admin') return 'Dashboard Overview';
    if (path.includes('/orders')) return 'Orders & Fulfillment';
    if (path.includes('/marketing')) return 'WhatsApp (WABA) & Email Marketing CRM';
    if (path.includes('/products')) return 'Products & Inventory';
    if (path.includes('/categories')) return 'Saree Categories';
    if (path.includes('/reviews')) return 'Reviews & Customer Ratings';
    if (path.includes('/coupons')) return 'Coupons & Promotions';
    if (path.includes('/banners')) return 'Hero Banner Slides';
    if (path.includes('/customers')) return 'Customer Directory';
    return 'Admin Management';
  };

  const isDashboard = location.pathname === '/' || location.pathname === '/admin';

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {/* Desktop / Mobile Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E8E2D9] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          {/* Left: Mobile Menu Toggle, Back Arrow & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>

            {/* Back Navigation Arrow */}
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-gray-600 hover:text-[#700B1A] hover:bg-[#FDF2F4] border border-gray-200 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title="Go Back to Previous Page"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <Link to="/admin" className="text-gray-400 font-medium hover:text-[#700B1A] hidden sm:inline transition-colors">
                Admin
              </Link>
              <ChevronRight size={13} className="text-gray-300 hidden sm:inline" />
              <h2 className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Right: Quick Actions & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Storefront Link */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF7F2] border border-[#E8A87C]/40 text-[#700B1A] text-xs font-bold hover:bg-[#700B1A] hover:text-white transition-colors"
            >
              <Store size={13} />
              <span className="hidden sm:inline">Live Storefront</span>
              <ExternalLink size={11} className="hidden sm:inline" />
            </a>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#700B1A] to-[#D97706] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SV'}
              </div>
              <div className="hidden md:block text-left">
                <span className="font-bold text-gray-800 text-xs block leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#D97706] font-bold uppercase tracking-wider block">
                  Super Admin
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>

          </div>

        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
