import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponsApi } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('svl_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('svl_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('svl_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('svl_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('svl_applied_coupon');
    }
  }, [appliedCoupon]);

  // Add Item to Cart
  const addToCart = (product, quantity = 1, color = null) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product === product._id && (!color || item.color === color)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += Number(quantity);
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            title: product.title,
            image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
            price: Number(product.price),
            originalPrice: Number(product.originalPrice || product.price),
            color: color || product.color || 'Standard',
            fabric: product.fabric || '',
            category: product.category || '',
            stock: product.stock || 10,
            quantity: Number(quantity),
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId ? { ...item, quantity: Math.min(newQuantity, item.stock || 50) } : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));
  };

  // Clear all cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('svl_cart_items');
    localStorage.removeItem('svl_applied_coupon');
  };

  // Pricing calculations
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const totalMrp = cartItems.reduce(
    (acc, item) => acc + (Number(item.originalPrice) || Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const totalSavings = Math.max(0, totalMrp - itemsPrice);

  // Free shipping on orders above 999
  const FREE_SHIPPING_THRESHOLD = 999;
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD || itemsPrice === 0 ? 0 : 99;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - itemsPrice);

  // Calculate discount from applied coupon safely
  let discountAmount = 0;
  if (appliedCoupon && itemsPrice > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      const val = Number(appliedCoupon.discountValue) || 0;
      discountAmount = (itemsPrice * val) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > Number(appliedCoupon.maxDiscount)) {
        discountAmount = Number(appliedCoupon.maxDiscount);
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Number(appliedCoupon.discountValue) || Number(appliedCoupon.discountAmount) || 0;
    } else if (appliedCoupon.discountAmount !== undefined && !isNaN(Number(appliedCoupon.discountAmount))) {
      discountAmount = Number(appliedCoupon.discountAmount);
    } else if (appliedCoupon.discountValue !== undefined && !isNaN(Number(appliedCoupon.discountValue))) {
      discountAmount = Number(appliedCoupon.discountValue);
    }
    discountAmount = Math.max(0, Math.min(Number(discountAmount) || 0, itemsPrice));
  }

  const totalPrice = Math.max(0, itemsPrice - discountAmount + shippingPrice);
  const itemCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  // Apply Coupon code
  const applyCouponCode = async (code) => {
    if (!code) throw new Error('Please enter a coupon code');
    try {
      const res = await couponsApi.apply(code, itemsPrice);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        return res;
      }
      throw new Error(res.message || 'Invalid coupon');
    } catch (error) {
      throw error;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        itemsPrice,
        totalMrp,
        totalSavings,
        shippingPrice,
        amountToFreeShipping,
        discountAmount,
        totalPrice,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
