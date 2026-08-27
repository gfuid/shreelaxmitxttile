import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add coupon code'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: [true, 'Please add discount value'],
    min: 1,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    default: 10000,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please add expiry date'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
    default: 1000,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
