import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema({
  channel: {
    type: String,
    enum: ['WHATSAPP', 'EMAIL', 'BOTH'],
    required: true,
  },
  type: {
    type: String,
    enum: ['ORDER_STAGE', 'BULK_BROADCAST', 'TEST_PING'],
    default: 'ORDER_STAGE',
  },
  stage: {
    type: String,
    default: '',
  },
  orderId: {
    type: mongoose.Schema.Types.Mixed,
  },
  orderNumber: {
    type: String,
    default: '',
  },
  recipient: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  whatsappDetails: {
    templateName: { type: String },
    status: { type: String, enum: ['SENT', 'DELIVERED', 'FAILED', 'SKIPPED'], default: 'SKIPPED' },
    messageId: { type: String },
    error: { type: String },
  },
  emailDetails: {
    subject: { type: String },
    status: { type: String, enum: ['SENT', 'DELIVERED', 'FAILED', 'SKIPPED'], default: 'SKIPPED' },
    messageId: { type: String },
    hasInvoiceAttachment: { type: Boolean, default: false },
    error: { type: String },
  },
  summary: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);
export default NotificationLog;
