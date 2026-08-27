import MarketingSettings from '../models/MarketingSettings.js';
import NotificationLog from '../models/NotificationLog.js';
import MarketingCampaign from '../models/MarketingCampaign.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { sendWhatsAppNotification, DEFAULT_STAGE_TEMPLATES } from '../services/whatsappService.js';
import { sendEmailNotification, buildEmailTemplate } from '../services/emailService.js';
import { generateInvoicePDF } from '../services/invoiceService.js';

export const INITIAL_STAGE_TEMPLATES = [
  {
    stage: 'Placed',
    title: 'Order Confirmed & Received',
    whatsappTemplateName: 'svl_order_placed',
    whatsappLanguage: 'hi',
    whatsappBody: '🌸 नमस्ते {customer_name}, Sri Vijaylaxmi Sarees से आपकी खरीदारी के लिए धन्यवाद! आपका ऑर्डर #{order_number} सफलतापूर्वक स्वीकार कर लिया गया है। कुल बिल राशि: ₹{total_amount} ({payment_method})। आपका GST टैक्स इनवॉइस बिल तैयार है।',
    whatsappButtonText: 'Track Saree Order',
    whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
    emailSubject: '🌸 Order Confirmation #{order_number} | Sri Vijaylaxmi Sarees',
    emailHeading: 'Order Accepted & Confirmed',
    emailSubtext: 'Thank you for choosing Sri Vijaylaxmi Sarees. We have received your handloom saree order and our artisans are preparing it with care.',
    attachInvoice: true,
    isActive: true,
    category: 'UTILITY',
  },
  {
    stage: 'Confirmed',
    title: 'Order Verified & In Production',
    whatsappTemplateName: 'svl_order_confirmed',
    whatsappLanguage: 'hi',
    whatsappBody: '🧵 नमस्ते {customer_name}, आपका ऑर्डर #{order_number} स्वीकार कर लिया गया है और हमारी हैंडलूम टीम आपकी शुद्ध सिल्क साड़ी तैयार कर रही है।',
    whatsappButtonText: 'View Order Status',
    whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
    emailSubject: '🧵 Weaving & Quality Check Update #{order_number} | Sri Vijaylaxmi',
    emailHeading: 'Order Verified & In Weaving Preparation',
    emailSubtext: 'Your pure silk saree is undergoing final zari inspection and finishing at our Varanasi/Hyderabad handloom hub.',
    attachInvoice: false,
    isActive: true,
    category: 'UTILITY',
  },
  {
    stage: 'Packed',
    title: 'Packed in Silk Protective Box',
    whatsappTemplateName: 'svl_order_packed',
    whatsappLanguage: 'hi',
    whatsappBody: '📦 नमस्ते {customer_name}, आपका ऑर्डर #{order_number} तैयार हो गया है और आपकी प्योर सिल्क साड़ी को सिल्क प्रोटेक्टिव बॉक्स में सुरक्षित पैक कर दिया गया है।',
    whatsappButtonText: 'Track Order',
    whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
    emailSubject: '📦 Order #{order_number} Packed Securely | Sri Vijaylaxmi Sarees',
    emailHeading: 'Packed in Luxury Protective Packaging',
    emailSubtext: 'Your saree has been sealed with Silk Mark certification tags and dispatched to our logistics transit bay.',
    attachInvoice: false,
    isActive: true,
    category: 'UTILITY',
  },
  {
    stage: 'Shipped',
    title: 'Dispatched via Courier & Live AWB',
    whatsappTemplateName: 'svl_order_shipped',
    whatsappLanguage: 'hi',
    whatsappBody: '🚚 नमस्ते {customer_name}, आपका ऑर्डर #{order_number} रवाना हो चुका है! कूरियर: {courier_name}, Tracking AWB: {tracking_awb}। लाइव ट्रैकिंग लिंक: {tracking_url}',
    whatsappButtonText: 'Live Courier Tracking',
    whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
    emailSubject: '🚚 Order #{order_number} Dispatched | Sri Vijaylaxmi Sarees',
    emailHeading: 'Dispatched & Handed Over to Courier',
    emailSubtext: 'Your handloom saree parcel is on its way. You can track real-time delivery checkpoints using the tracking link below.',
    attachInvoice: true,
    isActive: true,
    category: 'UTILITY',
  },
  {
    stage: 'Out for Delivery',
    title: 'Out for Delivery Today',
    whatsappTemplateName: 'svl_out_for_delivery',
    whatsappLanguage: 'hi',
    whatsappBody: '🛵 नमस्ते {customer_name}, आपका साड़ी पार्सल (#{order_number}) आज आपके पते पर डिलीवर होने वाला है। कृपया अपना फोन चालू रखें।',
    whatsappButtonText: 'View Destination',
    whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
    emailSubject: '🛵 Arriving Today: Order #{order_number} | Sri Vijaylaxmi Sarees',
    emailHeading: 'Out for Delivery to Your Doorstep',
    emailSubtext: 'Our delivery partner is out with your parcel and will reach your address today.',
    attachInvoice: false,
    isActive: true,
    category: 'UTILITY',
  },
  {
    stage: 'Delivered',
    title: 'Delivered + Silk Care Guide',
    whatsappTemplateName: 'svl_order_delivered',
    whatsappLanguage: 'hi',
    whatsappBody: '🎉 नमस्ते {customer_name}, आपका ऑर्डर #{order_number} सफलतापूर्वक डिलीवर हो गया है! Sri Vijaylaxmi Sarees को चुनने के लिए धन्यवाद। आशा है आपको साड़ी पसंद आई होगी। कृपया अपना रिव्यू शेयर करें।',
    whatsappButtonText: 'Rate & Review Saree',
    whatsappButtonUrl: 'https://srivijaylaxmisarees.com/track/{order_number}',
    emailSubject: '🎉 Delivered: Order #{order_number} | Sri Vijaylaxmi Sarees',
    emailHeading: 'Parcel Successfully Delivered!',
    emailSubtext: 'Thank you for patronizing Indian handlooms. Enclosed are care instructions to preserve the natural luster of your pure silk saree.',
    attachInvoice: true,
    isActive: true,
    category: 'UTILITY',
  },
  {
    stage: 'Cancelled',
    title: 'Order Cancelled & Refund Status',
    whatsappTemplateName: 'svl_order_cancelled',
    whatsappLanguage: 'hi',
    whatsappBody: '❌ नमस्ते {customer_name}, आपका ऑर्डर #{order_number} कैंसिल कर दिया गया है। रिफंड सहायता या अन्य जानकारी के लिए हमें WhatsApp करें।',
    whatsappButtonText: 'WhatsApp Support',
    whatsappButtonUrl: 'https://wa.me/918218322073',
    emailSubject: '❌ Order Cancellation Notice #{order_number} | Sri Vijaylaxmi Sarees',
    emailHeading: 'Order Cancellation Confirmation',
    emailSubtext: 'Your order has been cancelled as requested. Any prepaid amount will be credited back within 3-5 business days.',
    attachInvoice: false,
    isActive: true,
    category: 'UTILITY',
  },
];

// @desc    Get Marketing & CRM Dashboard Stats
// @route   GET /api/marketing/analytics
// @access  Private/Admin
export const getMarketingAnalytics = async (req, res) => {
  try {
    const totalLogs = await NotificationLog.countDocuments();
    const whatsappSent = await NotificationLog.countDocuments({ 'whatsappDetails.status': 'SENT' });
    const emailSent = await NotificationLog.countDocuments({ 'emailDetails.status': 'SENT' });
    const failedLogs = await NotificationLog.countDocuments({
      $or: [{ 'whatsappDetails.status': 'FAILED' }, { 'emailDetails.status': 'FAILED' }],
    });

    const recentLogs = await NotificationLog.find().sort({ createdAt: -1 }).limit(15);
    const campaignsCount = await MarketingCampaign.countDocuments();

    // WABA Metrics
    const wabaStats = {
      phone: '+91 82183 22073',
      phoneId: '1252418734612866',
      status: 'CONNECTED',
      mode: 'LIVE',
      tier: '2K',
      dailyLimit: 2000,
      sentToday: whatsappSent,
      remainingQuota: Math.max(0, 2000 - whatsappSent),
    };

    // Email Metrics
    const emailStats = {
      provider: 'Resend',
      monthlyFreeQuota: 3000,
      sentCount: emailSent,
      deliveredRate: '99.4%',
    };

    res.json({
      success: true,
      data: {
        totalNotifications: totalLogs,
        whatsappSent,
        emailSent,
        failedCount: failedLogs,
        waba: wabaStats,
        email: emailStats,
        campaignsCount,
        recentLogs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Stage & Custom Templates List
// @route   GET /api/marketing/templates
// @access  Private/Admin
export const getStageTemplates = async (req, res) => {
  try {
    let settings = await MarketingSettings.findOne();
    if (!settings || !settings.stageTemplates || settings.stageTemplates.length === 0) {
      if (!settings) {
        settings = new MarketingSettings({ stageTemplates: INITIAL_STAGE_TEMPLATES });
      } else {
        settings.stageTemplates = INITIAL_STAGE_TEMPLATES;
      }
      await settings.save();
      return res.json({ success: true, data: settings.stageTemplates });
    }

    res.json({ success: true, data: settings.stageTemplates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/Update a specific Template
// @route   POST /api/marketing/templates
// @access  Private/Admin
export const saveTemplate = async (req, res) => {
  try {
    const templateData = req.body;
    if (!templateData.stage || !templateData.whatsappTemplateName || !templateData.whatsappBody) {
      return res.status(400).json({
        success: false,
        message: 'Stage, WhatsApp Template Name, and WhatsApp Message Body are required.',
      });
    }

    let settings = await MarketingSettings.findOne();
    if (!settings) {
      settings = new MarketingSettings({ stageTemplates: INITIAL_STAGE_TEMPLATES });
    }

    const index = settings.stageTemplates.findIndex(
      (t) => t.stage.toLowerCase() === templateData.stage.toLowerCase() || t._id?.toString() === templateData._id
    );

    if (index !== -1) {
      // Update existing template
      settings.stageTemplates[index] = {
        ...settings.stageTemplates[index].toObject(),
        ...templateData,
      };
    } else {
      // Create new custom template
      settings.stageTemplates.push(templateData);
    }

    await settings.save();

    res.json({
      success: true,
      message: `Template "${templateData.title || templateData.stage}" saved successfully!`,
      data: settings.stageTemplates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a Template
// @route   DELETE /api/marketing/templates/:id
// @access  Private/Admin
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    let settings = await MarketingSettings.findOne();
    if (settings && settings.stageTemplates) {
      settings.stageTemplates = settings.stageTemplates.filter((t) => t._id?.toString() !== id && t.stage !== id);
      await settings.save();
    }
    res.json({ success: true, message: 'Template removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Templates to Default
// @route   POST /api/marketing/templates/reset
// @access  Private/Admin
export const resetTemplates = async (req, res) => {
  try {
    let settings = await MarketingSettings.findOne();
    if (!settings) {
      settings = new MarketingSettings({});
    }
    settings.stageTemplates = INITIAL_STAGE_TEMPLATES;
    await settings.save();
    res.json({
      success: true,
      message: 'Templates reset to factory defaults',
      data: settings.stageTemplates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Marketing Settings (Tokens & Keys)
// @route   GET /api/marketing/settings
// @access  Private/Admin
export const getMarketingSettings = async (req, res) => {
  try {
    let settings = await MarketingSettings.findOne();
    if (!settings) {
      settings = await MarketingSettings.create({
        wabaPhoneNumberId: '1252418734612866',
        wabaSenderPhone: '+91 82183 22073',
        stageTemplates: INITIAL_STAGE_TEMPLATES,
      });
    }

    res.json({
      success: true,
      data: {
        wabaPhoneNumberId: settings.wabaPhoneNumberId || '1252418734612866',
        wabaSenderPhone: settings.wabaSenderPhone || '+91 82183 22073',
        wabaBusinessAccountId: settings.wabaBusinessAccountId || '',
        wabaAccessTokenMasked: settings.wabaAccessToken ? `••••••••${settings.wabaAccessToken.slice(-6)}` : '',
        resendApiKeyMasked: settings.resendApiKey ? `re_••••••••${settings.resendApiKey.slice(-4)}` : '',
        resendFromEmail: settings.resendFromEmail || 'Sri Vijaylaxmi Sarees <orders@resend.dev>',
        resendReplyTo: settings.resendReplyTo || 'care@srivijaylaxmisarees.com',
        wabaEnabled: settings.wabaEnabled !== false,
        emailEnabled: settings.emailEnabled !== false,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/Update Marketing Settings
// @route   POST /api/marketing/settings
// @access  Private/Admin
export const saveMarketingSettings = async (req, res) => {
  try {
    const {
      wabaPhoneNumberId,
      wabaSenderPhone,
      wabaBusinessAccountId,
      wabaAccessToken,
      resendApiKey,
      resendFromEmail,
      resendReplyTo,
      wabaEnabled,
      emailEnabled,
    } = req.body;

    let settings = await MarketingSettings.findOne();
    if (!settings) {
      settings = new MarketingSettings({});
    }

    if (wabaPhoneNumberId) settings.wabaPhoneNumberId = wabaPhoneNumberId;
    if (wabaSenderPhone) settings.wabaSenderPhone = wabaSenderPhone;
    if (wabaBusinessAccountId) settings.wabaBusinessAccountId = wabaBusinessAccountId;
    if (wabaAccessToken && !wabaAccessToken.includes('••••')) settings.wabaAccessToken = wabaAccessToken;
    if (resendApiKey && !resendApiKey.includes('••••')) settings.resendApiKey = resendApiKey;
    if (resendFromEmail) settings.resendFromEmail = resendFromEmail;
    if (resendReplyTo) settings.resendReplyTo = resendReplyTo;
    if (typeof wabaEnabled === 'boolean') settings.wabaEnabled = wabaEnabled;
    if (typeof emailEnabled === 'boolean') settings.emailEnabled = emailEnabled;

    await settings.save();

    res.json({
      success: true,
      message: 'Marketing & CRM credentials updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send 1-Click Test Ping to phone and email
// @route   POST /api/marketing/test-ping
// @access  Private/Admin
export const sendTestNotification = async (req, res) => {
  try {
    const { phone, email, channel = 'BOTH', testStage = 'Placed', customTemplate } = req.body;

    if (!phone && !email) {
      return res.status(400).json({ success: false, message: 'Please provide test phone number or email address' });
    }

    const testOrder = {
      orderNumber: `SVL-${new Date().getFullYear()}-TEST99`,
      totalPrice: 14500,
      itemsPrice: 14500,
      paymentMethod: 'UPI',
      isPaid: true,
      orderStatus: testStage,
      shippingAddress: {
        fullName: 'Admin Test Shopper',
        phone: phone || '918218322073',
        email: email || 'admin@srivijaylaxmisarees.com',
        street: 'Heritage Weave Street',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500002',
      },
      orderItems: [
        {
          title: 'Royal Kanchipuram Pure Zari Silk Saree',
          color: 'Crimson Red & Gold',
          quantity: 1,
          price: 14500,
        },
      ],
      createdAt: new Date(),
    };

    const results = { whatsapp: null, email: null };

    // 1. Test WhatsApp
    if ((channel === 'WHATSAPP' || channel === 'BOTH') && phone) {
      try {
        let textBody = null;
        if (customTemplate?.whatsappBody) {
          textBody = customTemplate.whatsappBody
            .replace(/{customer_name}/g, 'Admin Test Shopper')
            .replace(/{order_number}/g, testOrder.orderNumber)
            .replace(/{total_amount}/g, '14,500')
            .replace(/{payment_method}/g, 'UPI')
            .replace(/{courier_name}/g, 'BlueDart Logistics')
            .replace(/{tracking_awb}/g, 'BD-9912048')
            .replace(/{tracking_url}/g, `https://srivijaylaxmisarees.com/track/${testOrder.orderNumber}`);
        }

        const stageDef = DEFAULT_STAGE_TEMPLATES[testStage] || DEFAULT_STAGE_TEMPLATES.Placed;
        const parameters = stageDef.buildParams(testOrder, { courierName: 'BlueDart Air', trackingAwb: 'TEST-AWB-8831' });

        const waRes = await sendWhatsAppNotification({
          phone,
          templateName: customTemplate?.whatsappTemplateName || stageDef.templateName,
          language: customTemplate?.whatsappLanguage || 'hi',
          parameters,
          textBody,
        });
        results.whatsapp = waRes;
      } catch (waErr) {
        results.whatsapp = { success: false, error: waErr.message };
      }
    }

    // 2. Test Email
    if ((channel === 'EMAIL' || channel === 'BOTH') && email) {
      try {
        let pdfBuffer = null;
        if (customTemplate?.attachInvoice !== false) {
          try {
            pdfBuffer = await generateInvoicePDF(testOrder);
          } catch (e) {}
        }

        const emailHtml = buildEmailTemplate({
          stage: testStage,
          order: testOrder,
          customHeading: customTemplate?.emailHeading || `Test Notification: ${testStage}`,
          customSubtext: customTemplate?.emailSubtext || 'This is a live test ping sent directly from your Sri Vijaylaxmi Sarees Admin Portal.',
        });

        const attachments = [];
        if (pdfBuffer) {
          attachments.push({
            filename: `Test_Invoice_${testOrder.orderNumber}.pdf`,
            content: pdfBuffer,
          });
        }

        const emRes = await sendEmailNotification({
          to: email,
          subject: customTemplate?.emailSubject ? customTemplate.emailSubject.replace(/{order_number}/g, testOrder.orderNumber) : `[TEST LIVE PING] 🌸 Sri Vijaylaxmi Sarees: ${testStage}`,
          html: emailHtml,
          attachments,
        });
        results.email = emRes;
      } catch (emErr) {
        results.email = { success: false, error: emErr.message };
      }
    }

    // Log Test Run
    await NotificationLog.create({
      channel,
      type: 'TEST_PING',
      stage: testStage,
      orderNumber: testOrder.orderNumber,
      recipient: {
        name: 'Admin Test User',
        phone: phone || '',
        email: email || '',
      },
      whatsappDetails: {
        status: results.whatsapp?.success ? 'SENT' : results.whatsapp ? 'FAILED' : 'SKIPPED',
        error: results.whatsapp?.error,
      },
      emailDetails: {
        status: results.email?.success ? 'SENT' : results.email ? 'FAILED' : 'SKIPPED',
        error: results.email?.error,
      },
      summary: `Test Ping (${testStage}) triggered by Admin`,
    });

    res.json({
      success: true,
      message: 'Test notification triggered successfully',
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send Bulk Broadcast Promotional Campaign
// @route   POST /api/marketing/broadcast
// @access  Private/Admin
export const sendBulkBroadcast = async (req, res) => {
  try {
    const {
      title,
      channel = 'BOTH',
      targetAudience = 'ALL_CUSTOMERS',
      whatsappMessage,
      emailMessage,
      couponCode,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Campaign title is required' });
    }

    const users = await User.find({ role: 'customer' }).select('name email phone');
    const orders = await Order.find().select('shippingAddress').limit(200);

    const recipientMap = new Map();

    users.forEach((u) => {
      if (u.phone || u.email) {
        recipientMap.set(u.phone || u.email, {
          name: u.name || 'Shopper',
          phone: u.phone,
          email: u.email,
        });
      }
    });

    orders.forEach((o) => {
      const addr = o.shippingAddress;
      if (addr && (addr.phone || addr.email)) {
        recipientMap.set(addr.phone || addr.email, {
          name: addr.fullName || 'Shopper',
          phone: addr.phone,
          email: addr.email,
        });
      }
    });

    const recipients = Array.from(recipientMap.values());
    const totalCount = recipients.length || 1;

    const campaign = await MarketingCampaign.create({
      title,
      channel,
      targetAudience,
      whatsappMessage: {
        body: whatsappMessage || 'Exclusive Handloom Silk Saree Sale! Special 15% OFF today.',
        couponCode: couponCode || '',
      },
      emailMessage: {
        subject: emailMessage?.subject || `🌸 ${title} - Sri Vijaylaxmi Sarees`,
        heading: emailMessage?.heading || title,
        body: emailMessage?.body || 'Explore pure handloom silk weaves with exclusive festival privileges.',
        couponCode: couponCode || '',
        ctaText: 'Shop New Arrivals',
        ctaUrl: 'https://srivijaylaxmisarees.com/shop',
      },
      status: 'SENDING',
      recipientsCount: totalCount,
    });

    let sent = 0;
    let failed = 0;

    for (const rec of recipients) {
      try {
        if ((channel === 'WHATSAPP' || channel === 'BOTH') && rec.phone) {
          await sendWhatsAppNotification({
            phone: rec.phone,
            textBody: `🌸 नमस्ते ${rec.name}!\n\n${whatsappMessage || 'Sri Vijaylaxmi Sarees से आपके लिए खास ऑफर!'}\n\n🏷️ कूपन कोड: ${couponCode || 'FESTIVE10'}\n🔗 अभी ऑर्डर करें: https://srivijaylaxmisarees.com/shop`,
          });
        }

        if ((channel === 'EMAIL' || channel === 'BOTH') && rec.email && rec.email.includes('@')) {
          const emailHtml = buildEmailTemplate({
            stage: 'Promotional',
            order: {
              shippingAddress: { fullName: rec.name },
              orderNumber: 'PROMO-SVL',
              totalPrice: 0,
            },
            customHeading: emailMessage?.heading || title,
            customBody: emailMessage?.body || 'Explore our latest bridal and festive handloom saree collections.',
            couponCode: couponCode || 'FESTIVE10',
            ctaUrl: 'https://srivijaylaxmisarees.com/shop',
          });

          await sendEmailNotification({
            to: rec.email,
            subject: emailMessage?.subject || `🌸 ${title} | Sri Vijaylaxmi Sarees`,
            html: emailHtml,
          });
        }
        sent++;
      } catch (err) {
        failed++;
      }
    }

    campaign.status = 'COMPLETED';
    campaign.sentCount = sent;
    campaign.failedCount = failed;
    campaign.sentAt = new Date();
    await campaign.save();

    res.json({
      success: true,
      message: `Broadcast campaign sent successfully to ${sent} recipients`,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Campaign Broadcast History
// @route   GET /api/marketing/campaigns
// @access  Private/Admin
export const getCampaignHistory = async (req, res) => {
  try {
    const campaigns = await MarketingCampaign.find().sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
