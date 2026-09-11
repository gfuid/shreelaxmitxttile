import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store, Heart, ShoppingBag, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'shop',
      label: 'Shop',
      icon: Store,
      path: '/',
      isActive: currentPath === '/' || currentPath === '/shop',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      path: '/wishlist',
      badge: wishlistCount > 0 ? wishlistCount : null,
      isActive: currentPath === '/wishlist',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      path: '/cart',
      badge: itemCount,
      isActive: currentPath === '/cart' || currentPath === '/checkout',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Layers,
      path: '/shop',
      isActive: currentPath === '/shop' || currentPath === '/collections',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/98 backdrop-blur-md border-t border-[#E8E2D9] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-pb"
    >
      <div className="grid grid-cols-4 h-15 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 transition-all select-none ${
                active
                  ? 'text-[#700B1A] font-bold'
                  : 'text-gray-500 hover:text-[#700B1A] font-medium'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  size={21}
                  className={`transition-transform duration-200 ${
                    active ? 'scale-105 stroke-[2.3] fill-[#700B1A]/10' : 'stroke-[1.8]'
                  }`}
                />

                {/* Badge Indicator */}
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 text-[9.5px] font-black rounded-full flex items-center justify-center shadow-xs ${
                      item.id === 'cart'
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-[#700B1A] text-amber-200'
                    }`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] tracking-tight leading-none mt-1">
                {item.label}
              </span>

              {/* Subtle Active Indicator Dot */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-[#700B1A] mt-0.5"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
