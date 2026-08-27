import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { syncLeadToGoogleSheet } from '../utils/googleSheetsService.js';
import { triggerOrderNotification } from '../services/notificationService.js';

// Helper to generate readable Order Number: SVL-2026-XXXXX
const generateOrderNumber = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SVL-${new Date().getFullYear()}-${randomNum}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private / Public Guest
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discountAmount,
      couponCode,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Incomplete shipping address' });
    }

    // Verify stock and update inventory safely if product exists in MongoDB
    for (const item of orderItems) {
      try {
        const prodId = item.product?._id || item.product;
        const isObjectId = typeof prodId === 'string' && prodId.match(/^[0-9a-fA-F]{24}$/);
        const product = isObjectId 
          ? await Product.findById(prodId)
          : await Product.findOne({ $or: [{ _id: prodId }, { title: item.title }] });

        if (product && typeof product.stock === 'number') {
          product.stock = Math.max(0, product.stock - (item.quantity || 1));
          await product.save();
        }
      } catch (e) {
        console.warn('Product stock deduction notice:', e.message);
      }
    }

    // If coupon used, increment coupon usage count
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.usedCount = (coupon.usedCount || 0) + 1;
          await coupon.save();
        }
      } catch (e) {}
    }

    const orderNumber = generateOrderNumber();
    const userId = req.user?._id || req.user?.id || `usr_${Date.now()}`;

    const order = new Order({
      user: userId,
      orderNumber,
      orderItems: orderItems.map((it) => ({
        product: it.product?._id || it.product || `prod_${Date.now()}`,
        title: it.title || 'Saree',
        image: it.image || it.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        price: Number(it.price || 0),
        originalPrice: Number(it.originalPrice || it.price || 0),
        color: it.color || 'Standard',
        quantity: Number(it.quantity || 1),
      })),
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice: Number(itemsPrice || totalPrice || 0),
      shippingPrice: Number(shippingPrice || 0),
      discountAmount: Number(discountAmount || 0),
      couponCode: couponCode || '',
      totalPrice: Number(totalPrice || itemsPrice || 0),
      isPaid: paymentMethod !== 'COD',
      paidAt: paymentMethod !== 'COD' ? new Date() : null,
      orderStatus: 'Placed',
      trackingUpdates: [
        {
          status: 'Placed',
          note: 'Your order has been placed successfully.',
          location: 'Online Store',
          timestamp: new Date(),
        },
      ],
    });

    const createdOrder = await order.save();

    // Compile product titles & quantities
    const productSummaries = (createdOrder.orderItems || [])
      .map((it) => `${it.title || 'Saree'} (x${it.quantity || 1})`)
      .join(', ');

    // Real-time sync new order details to Google Sheet & FlowConnect CRM
    syncLeadToGoogleSheet({
      leadType: 'New Order',
      fullName: shippingAddress.fullName || req.user?.name || '',
      phone: shippingAddress.phone || req.user?.phone || '',
      email: req.user?.email || req.body.email || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      pincode: shippingAddress.pincode || '',
      address: `${shippingAddress.street || ''}${shippingAddress.landmark ? ', ' + shippingAddress.landmark : ''}`,
      orderNumber: createdOrder.orderNumber,
      products: productSummaries,
      totalAmount: createdOrder.totalPrice,
      paymentMethod: createdOrder.paymentMethod,
      paymentStatus: createdOrder.isPaid ? 'Paid' : 'Pending (COD)',
    });

    // 🔔 Trigger WhatsApp & Resend Email (with PDF Invoice) for Order Confirmation
    triggerOrderNotification(createdOrder, 'Placed').catch((err) => {
      console.warn('Background order notification trigger notice:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: createdOrder,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private / Public
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email;
    const userPhone = req.user?.phone;
    const userName = req.user?.name;

    const conditions = [];

    if (userId && !String(userId).startsWith('usr_guest_')) {
      conditions.push({ user: userId });
    }
    if (userPhone && userPhone !== 'none' && userPhone.length > 5) {
      conditions.push({ 'shippingAddress.phone': userPhone });
    }
    if (userName && userName !== 'Customer Guest' && userName !== 'Customer' && userName !== 'none') {
      conditions.push({ 'shippingAddress.fullName': userName });
    }
    if (userEmail && userEmail !== 'none') {
      conditions.push({ 'paymentResult.emailAddress': userEmail });
    }

    let orders;
    if (conditions.length > 0) {
      orders = await Order.find({ $or: conditions }).sort({ createdAt: -1 });
    } else {
      // For guest visitors, return recent store orders
      orders = await Order.find().sort({ createdAt: -1 }).limit(20);
    }

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public / Private
export const getOrderById = async (req, res) => {
  try {
    let order;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ orderNumber: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const query = {};

    if (req.query.status && req.query.status !== 'all') {
      query.orderStatus = req.query.status;
    }

    if (req.query.search) {
      query.$or = [
        { orderNumber: new RegExp(req.query.search, 'i') },
        { 'shippingAddress.fullName': new RegExp(req.query.search, 'i') },
        { 'shippingAddress.phone': new RegExp(req.query.search, 'i') },
      ];
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      data: orders,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status & tracking (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, location, courierName, trackingAwb } = req.body;
    let order;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ $or: [{ _id: req.params.id }, { orderNumber: req.params.id }] });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;

    // Add tracking step
    order.trackingUpdates.push({
      status,
      note: note || (trackingAwb ? `Dispatched via ${courierName || 'Courier'} (AWB: ${trackingAwb})` : `Order status updated to ${status}`),
      location: location || 'Hyderabad Fulfillment Hub',
      timestamp: new Date(),
    });

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.isPaid = true;
      if (!order.paidAt) order.paidAt = new Date();
    } else if (status === 'Cancelled') {
      order.cancelledAt = new Date();
      order.cancellationReason = note || 'Cancelled by Store Admin';
    }

    const updatedOrder = await order.save();

    // 🔔 Trigger WhatsApp & Email Notification for Stage Change
    triggerOrderNotification(updatedOrder, status, {
      note,
      location,
      courierName: courierName || 'BlueDart Logistics',
      trackingAwb: trackingAwb || 'AWB-LIVE-TRACK',
    }).catch((err) => {
      console.warn('Background stage notification trigger notice:', err.message);
    });

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order (Customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    let order;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ $or: [{ _id: req.params.id }, { orderNumber: req.params.id }] });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled now as it is already ${order.orderStatus}`,
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelled by customer';

    order.trackingUpdates.push({
      status: 'Cancelled',
      note: reason || 'Order cancelled by customer',
      location: 'Online',
      timestamp: new Date(),
    });

    const updatedOrder = await order.save();

    // 🔔 Trigger WhatsApp & Email Notification for Cancellation
    triggerOrderNotification(updatedOrder, 'Cancelled', { note: reason }).catch((err) => {
      console.warn('Background cancellation notification notice:', err.message);
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
