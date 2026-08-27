import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Total Revenue from completed/paid/non-cancelled orders
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });

    // Orders breakdown by status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    const statusMap = {
      Placed: 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0,
    };
    statusCounts.forEach((item) => {
      if (item._id) statusMap[item._id] = item.count;
    });

    // Recent 10 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('title stock price images category sku')
      .limit(6);

    // Sales by Day (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesHistory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          orderStatus: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount,
        statusBreakdown: statusMap,
        recentOrders,
        lowStockProducts,
        salesHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers with order counts and total spent
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });

    const customersWithStats = await Promise.all(
      users.map(async (user) => {
        const userOrders = await Order.find({ user: user._id });
        const totalSpent = userOrders
          .filter((o) => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalPrice, 0);

        return {
          ...user.toObject(),
          totalOrders: userOrders.length,
          totalSpent: Math.round(totalSpent),
        };
      })
    );

    res.json({
      success: true,
      data: customersWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all product reviews for admin portal
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .select('title sku category images reviews');

    const allReviews = [];
    products.forEach((prod) => {
      if (Array.isArray(prod.reviews)) {
        prod.reviews.forEach((rev) => {
          allReviews.push({
            _id: rev._id,
            productId: prod._id,
            productTitle: prod.title,
            productImage: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : '',
            productSku: prod.sku,
            productCategory: prod.category,
            name: rev.name || 'Verified Buyer',
            rating: Number(rev.rating) || 5,
            comment: rev.comment || '',
            images: Array.isArray(rev.images) ? rev.images : [],
            reply: rev.reply || null,
            repliedAt: rev.repliedAt || null,
            isVerified: rev.isVerifiedPurchase !== false,
            createdAt: rev.createdAt || new Date(),
          });
        });
      }
    });

    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: allReviews,
      totalReviews: allReviews.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to customer review
// @route   POST /api/admin/reviews/:productId/:reviewId/reply
// @access  Private/Admin
export const replyToReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { reply } = req.body;

    const product = productId.match(/^[0-9a-fA-F]{24}$/)
      ? await Product.findById(productId)
      : await Product.findOne({ $or: [{ _id: productId }, { slug: productId }, { sku: productId }, { title: productId }] });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(reviewId) || product.reviews.find((r) => String(r._id) === String(reviewId));
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.reply = reply;
    review.repliedAt = new Date();
    await product.save();

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a customer review
// @route   DELETE /api/admin/reviews/:productId/:reviewId
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = productId.match(/^[0-9a-fA-F]{24}$/)
      ? await Product.findById(productId)
      : await Product.findOne({ $or: [{ _id: productId }, { slug: productId }, { sku: productId }, { title: productId }] });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.reviews = product.reviews.filter((r) => String(r._id) !== String(reviewId));
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.length > 0
      ? Number((product.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / product.reviews.length).toFixed(1))
      : 4.8;

    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
