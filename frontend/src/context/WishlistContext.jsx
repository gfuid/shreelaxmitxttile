import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('svl_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out stale dummy IDs from previous iterations
          const cleaned = parsed.filter(
            (id) => typeof id === 'string' && id !== 'prod_1' && id !== 'prod_2' && id !== 'prod_3' && !id.startsWith('dummy')
          );
          return cleaned;
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('svl_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productOrId) => {
    const id = typeof productOrId === 'object' && productOrId?._id ? productOrId._id : productOrId;
    if (!id || typeof id !== 'string') return;

    setWishlist((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isInWishlist = (productOrId) => {
    const id = typeof productOrId === 'object' && productOrId?._id ? productOrId._id : productOrId;
    return Boolean(id && wishlist.includes(id));
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('svl_wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        setWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
