import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  customerPhone: {
    type: String,
    required: true,
    index: true,
  },
  customerName: {
    type: String,
    default: 'Shopper',
  },
  customerEmail: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  lastMessage: {
    type: String,
    default: '',
  },
  lastMessageTimestamp: {
    type: Date,
    default: Date.now,
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'pending'],
    default: 'active',
  },
  tags: [{ type: String }],
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
