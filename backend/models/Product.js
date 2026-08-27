import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    default: () => `usr_${Date.now()}`,
  },
  name: {
    type: String,
    required: true,
    default: 'Verified Buyer',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  reply: {
    type: String,
  },
  repliedAt: {
    type: Date,
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add product title'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    required: [true, 'Please add product description'],
  },
  category: {
    type: String,
    required: [true, 'Please select category'],
    index: true,
  },
  fabric: {
    type: String,
    required: [true, 'Please specify fabric'],
    index: true,
  },
  occasion: {
    type: String,
    default: 'Festive & Party',
    index: true,
  },
  workType: {
    type: String,
    default: 'Zari Weave',
  },
  pattern: {
    type: String,
    default: 'Traditional',
  },
  color: {
    type: String,
    required: true,
    index: true,
  },
  colorHex: {
    type: String,
    default: '#B91C1C',
  },
  sareeLength: {
    type: String,
    default: '5.5 meters',
  },
  blouseLength: {
    type: String,
    default: '0.8 meters (Unstitched)',
  },
  blouseIncluded: {
    type: Boolean,
    default: true,
  },
  washCare: {
    type: String,
    default: 'Dry Clean Only',
  },
  price: {
    type: Number,
    required: [true, 'Please add selling price'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please add original MRP'],
    min: 0,
  },
  discountPercent: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock count'],
    default: 10,
    min: 0,
  },
  images: [{
    type: String,
    required: true,
  }],
  ratings: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
    index: true,
  },
  isTrending: {
    type: Boolean,
    default: false,
    index: true,
  },
  isNewArrival: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Auto-calculate discount percentage before saving
productSchema.pre('save', function (next) {
  if (this.originalPrice > this.price) {
    this.discountPercent = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else {
    this.discountPercent = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
