import mongoose from 'mongoose';

const marketingCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    enum: ['WHATSAPP', 'EMAIL', 'BOTH'],
    default: 'BOTH',
  },
  targetAudience: {
    type: String,
    enum: ['ALL_CUSTOMERS', 'REPEAT_BUYERS', 'NEW_USERS'],
    default: 'ALL_CUSTOMERS',
  },
  whatsappMessage: {
    templateName: { type: String, default: '' },
    body: { type: String, default: '' },
    couponCode: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },
  },
  emailMessage: {
    subject: { type: String, default: '' },
    heading: { type: String, default: '' },
    body: { type: String, default: '' },
    couponCode: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    ctaText: { type: String, default: 'Shop Handloom Sarees' },
    ctaUrl: { type: String, default: 'https://srivijaylaxmisarees.com/shop' },
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SENDING', 'COMPLETED', 'FAILED'],
    default: 'DRAFT',
  },
  recipientsCount: {
    type: Number,
    default: 0,
  },
  sentCount: {
    type: Number,
    default: 0,
  },
  failedCount: {
    type: Number,
    default: 0,
  },
  sentAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const MarketingCampaign = mongoose.model('MarketingCampaign', marketingCampaignSchema);
export default MarketingCampaign;
