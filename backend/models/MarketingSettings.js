import mongoose from 'mongoose';

const stageTemplateSchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  whatsappTemplateName: {
    type: String,
    required: true,
  },
  whatsappLanguage: {
    type: String,
    default: 'hi',
  },
  whatsappBody: {
    type: String,
    required: true,
  },
  whatsappButtonText: {
    type: String,
    default: 'Track Order Live',
  },
  whatsappButtonUrl: {
    type: String,
    default: 'https://srivijaylaxmisarees.com/track/{order_number}',
  },
  emailSubject: {
    type: String,
    required: true,
  },
  emailHeading: {
    type: String,
    default: '',
  },
  emailSubtext: {
    type: String,
    default: '',
  },
  emailBody: {
    type: String,
    default: '',
  },
  attachInvoice: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    enum: ['UTILITY', 'MARKETING', 'AUTHENTICATION'],
    default: 'UTILITY',
  },
});

const marketingSettingsSchema = new mongoose.Schema({
  // WhatsApp WABA Settings
  wabaPhoneNumberId: {
    type: String,
    default: '1252418734612866',
  },
  wabaBusinessAccountId: {
    type: String,
    default: '',
  },
  wabaAccessToken: {
    type: String,
    default: '',
  },
  wabaSenderPhone: {
    type: String,
    default: '+91 82183 22073',
  },
  wabaEnabled: {
    type: Boolean,
    default: true,
  },

  // Resend Email Settings
  resendApiKey: {
    type: String,
    default: '',
  },
  resendFromEmail: {
    type: String,
    default: 'Sri Vijaylaxmi Sarees <orders@resend.dev>',
  },
  resendReplyTo: {
    type: String,
    default: 'care@srivijaylaxmisarees.com',
  },
  emailEnabled: {
    type: Boolean,
    default: true,
  },

  // Stage-wise and Custom Templates configuration
  stageTemplates: [stageTemplateSchema],
}, {
  timestamps: true,
});

const MarketingSettings = mongoose.model('MarketingSettings', marketingSettingsSchema);
export default MarketingSettings;
