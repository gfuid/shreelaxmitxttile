import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Tag, 
  Image as ImageIcon, 
  Users, 
  Store, 
  LogOut,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Megaphone,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard Overview', path: '/', icon: LayoutDashboard, exact: true },
    { name: 'Orders & Shipments', path: '/orders', icon: Package },
    { name: 'Marketing & CRM', path: '/marketing', icon: Megaphone },
    { name: 'Products & Inventory', path: '/products', icon: ShoppingBag },
    { name: 'Saree Categories', path: '/categories', icon: Layers },
    { name: 'Reviews & Ratings', path: '/reviews', icon: MessageSquare },
    { name: 'Coupons & Promos', path: '/coupons', icon: Tag },
    { name: 'Hero Banner Slides', path: '/banners', icon: ImageIcon },
    { name: 'Customer Directory', path: '/customers', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1C1917] text-gray-300 flex flex-col justify-between border-r border-[#332E29] shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Brand Header */}
          <div className="p-4 border-b border-[#332E29] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
              <img
                src={logoImg}
                alt="Sri Vijay Laxmi Textiles"
                className="h-10 w-auto object-contain drop-shadow"
              />
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#292524]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-3 pb-2 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
              Management Portal
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#700B1A] text-white shadow-md font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-[#292524]'
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Store Link */}
        <div className="p-4 border-t border-[#332E29] space-y-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-[#292524] hover:bg-[#332E29] text-white text-xs font-bold transition-colors"
          >
            <Store size={14} className="text-[#D97706]" />
            <span>View Live Store (Port 5173)</span>
          </a>

          <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
            <div className="truncate">
              <span className="text-white block font-semibold truncate">{user?.name || 'Admin'}</span>
              <span className="text-[10px] text-gray-500">Super Admin</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
