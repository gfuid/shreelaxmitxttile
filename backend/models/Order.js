import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed, // Supports both ObjectId and string product IDs (e.g. prod_1)
    required: true,
  },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  color: { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

const trackingUpdateSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    required: true,
  },
  note: { type: String, default: '' },
  location: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed, // Supports both ObjectId and string user IDs
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI', 'CARD', 'NETBANKING'],
    default: 'COD',
  },
  paymentResult: {
    id: { type: String },
    status: { type: String, default: 'Pending' },
    updateTime: { type: String },
    emailAddress: { type: String },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  discountAmount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  couponCode: {
    type: String,
    default: '',
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  trackingUpdates: [trackingUpdateSchema],
  deliveredAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
