import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ['customer', 'agent', 'system'],
    required: true,
  },
  senderName: {
    type: String,
    default: '',
  },
  messageType: {
    type: String,
    enum: ['text', 'template', 'image', 'document'],
    default: 'text',
  },
  text: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
    default: '',
  },
  templateName: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent',
  },
  whatsappMessageId: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
