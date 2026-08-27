import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  badgeText: {
    type: String,
    default: 'SPECIAL FESTIVE OFFER',
  },
  discountText: {
    type: String,
    default: 'Up to 50% Off',
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '/shop',
  },
  category: {
    type: String,
    default: '',
  },
  bgGradient: {
    type: String,
    default: 'linear-gradient(135deg, #4A0404 0%, #1F0000 100%)',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
