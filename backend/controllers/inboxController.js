import Conversation from '../models/Conversation.js';
import ChatMessage from '../models/ChatMessage.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';

// Auto-seed initial conversations from real customers if empty
const ensureInitialConversations = async () => {
  const count = await Conversation.countDocuments();
  if (count > 0) return;

  const sampleChats = [
    {
      customerPhone: '+91 82183 22073',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@gmail.com',
      lastMessage: 'Namaste, my saree has been packed? When will it reach Hyderabad?',
      unreadCount: 1,
      status: 'active',
      tags: ['VIP Customer', 'Kanchipuram Silk'],
      messages: [
        {
          sender: 'system',
          text: '🌸 Order #SVL-2026-88321 Confirmed: Royal Kanchipuram Pure Zari Silk Saree (₹14,500). GST Invoice attached.',
          messageType: 'template',
          timestamp: new Date(Date.now() - 3600000 * 4),
        },
        {
          sender: 'customer',
          text: 'Namaste, my saree has been packed? When will it reach Hyderabad?',
          messageType: 'text',
          timestamp: new Date(Date.now() - 3600000 * 2),
        },
      ],
    },
    {
      customerPhone: '+91 93945 12326',
      customerName: 'Ananya Verma',
      customerEmail: 'ananya.v@yahoo.com',
      lastMessage: 'Thank you! The pure Banarasi saree quality is outstanding.',
      unreadCount: 0,
      status: 'resolved',
      tags: ['Banarasi Katan', 'Delivered'],
      messages: [
        {
          sender: 'system',
          text: '🎉 Order #SVL-2026-77210 has been successfully delivered! Silk Mark certification enclosed.',
          messageType: 'template',
          timestamp: new Date(Date.now() - 86400000 * 2),
        },
        {
          sender: 'customer',
          text: 'Thank you! The pure Banarasi saree quality is outstanding.',
          messageType: 'text',
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          sender: 'agent',
          senderName: 'Sri Vijaylaxmi Support',
          text: 'We are delighted you loved the handloom weave, Ananya ji! Thank you for supporting our master weavers.',
          messageType: 'text',
          timestamp: new Date(Date.now() - 86400000 + 1800000),
        },
      ],
    },
    {
      customerPhone: '+91 98765 43210',
      customerName: 'Sagar Punia',
      customerEmail: 'sagarpunia163@gmail.com',
      lastMessage: 'Is express delivery available for Dharmavaram Pattu sarees?',
      unreadCount: 2,
      status: 'active',
      tags: ['Pre-Purchase Enquiry'],
      messages: [
        {
          sender: 'customer',
          text: 'Hello, looking for pure silk sarees for upcoming wedding in family.',
          messageType: 'text',
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          sender: 'customer',
          text: 'Is express delivery available for Dharmavaram Pattu sarees?',
          messageType: 'text',
          timestamp: new Date(Date.now() - 3600000),
        },
      ],
    },
  ];

  for (const item of sampleChats) {
    const { messages, ...convoData } = item;
    const convo = await Conversation.create(convoData);
    for (const msg of messages) {
      await ChatMessage.create({
        conversationId: convo._id,
        customerPhone: convo.customerPhone,
        sender: msg.sender,
        senderName: msg.senderName || '',
        messageType: msg.messageType,
        text: msg.text,
        timestamp: msg.timestamp,
        status: 'read',
      });
    }
  }
};

// @desc    Get all conversations
// @route   GET /api/inbox/conversations
// @access  Private/Admin
export const getConversations = async (req, res) => {
  try {
    await ensureInitialConversations();
    const query = {};
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }
    if (req.query.search) {
      query.$or = [
        { customerName: new RegExp(req.query.search, 'i') },
        { customerPhone: new RegExp(req.query.search, 'i') },
        { lastMessage: new RegExp(req.query.search, 'i') },
      ];
    }

    const conversations = await Conversation.find(query).sort({ lastMessageTimestamp: -1 });
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/inbox/conversations/:id/messages
// @access  Private/Admin
export const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Mark unread as 0
    conversation.unreadCount = 0;
    await conversation.save();

    const messages = await ChatMessage.find({ conversationId: id }).sort({ timestamp: 1 });

    // Fetch customer's orders for CRM Dossier
    const cleanPhone = conversation.customerPhone.replace(/\D/g, '').slice(-10);
    const customerOrders = await Order.find({
      $or: [
        { 'shippingAddress.phone': new RegExp(cleanPhone, 'i') },
        { 'paymentResult.emailAddress': conversation.customerEmail },
      ],
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        conversation,
        messages,
        customerOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send live reply to customer via WhatsApp WABA
// @route   POST /api/inbox/conversations/:id/send
// @access  Private/Admin
export const sendChatMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, messageType = 'text', templateName, mediaUrl } = req.body;

    if (!text && !templateName) {
      return res.status(400).json({ success: false, message: 'Message text or template is required' });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // 1. Fire live WhatsApp notification via Meta WABA
    let waResult = null;
    try {
      waResult = await sendWhatsAppNotification({
        phone: conversation.customerPhone,
        textBody: text,
        templateName,
      });
    } catch (waErr) {
      console.warn('WABA message dispatch error notice:', waErr.message);
    }

    // 2. Save Message to Database
    const newMsg = await ChatMessage.create({
      conversationId: id,
      customerPhone: conversation.customerPhone,
      sender: 'agent',
      senderName: req.user?.name || 'Store Agent',
      messageType,
      text: text || `[Template: ${templateName}]`,
      mediaUrl: mediaUrl || '',
      templateName: templateName || '',
      status: waResult?.success ? 'delivered' : 'sent',
      whatsappMessageId: waResult?.messageId || '',
      timestamp: new Date(),
    });

    // 3. Update Conversation Last Message
    conversation.lastMessage = text || `[Template: ${templateName}]`;
    conversation.lastMessageTimestamp = new Date();
    await conversation.save();

    res.json({
      success: true,
      data: newMsg,
      waResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Single Send Direct WhatsApp Dispatcher
// @route   POST /api/inbox/single-send
// @access  Private/Admin
export const singleSend = async (req, res) => {
  try {
    const { phone, name, text, templateName, parameters } = req.body;
    if (!phone || (!text && !templateName)) {
      return res.status(400).json({ success: false, message: 'Phone and message/template required' });
    }

    // 1. Dispatch via WhatsApp WABA
    const waResult = await sendWhatsAppNotification({
      phone,
      textBody: text,
      templateName,
      parameters: parameters || [],
    });

    // 2. Create or find conversation
    let convo = await Conversation.findOne({ customerPhone: phone });
    if (!convo) {
      convo = await Conversation.create({
        customerPhone: phone,
        customerName: name || 'Customer',
        lastMessage: text || `[Template: ${templateName}]`,
        lastMessageTimestamp: new Date(),
      });
    } else {
      convo.lastMessage = text || `[Template: ${templateName}]`;
      convo.lastMessageTimestamp = new Date();
      await convo.save();
    }

    // 3. Log Message
    await ChatMessage.create({
      conversationId: convo._id,
      customerPhone: phone,
      sender: 'agent',
      senderName: req.user?.name || 'Store Admin',
      messageType: templateName ? 'template' : 'text',
      text: text || `[Template: ${templateName}]`,
      templateName: templateName || '',
      status: waResult?.success ? 'delivered' : 'sent',
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: `Message dispatched successfully to ${phone}`,
      data: waResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
