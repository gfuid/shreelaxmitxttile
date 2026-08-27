import dotenv from 'dotenv';
dotenv.config();

/**
 * Stage-wise WhatsApp Template Default Definitions
 */
export const DEFAULT_STAGE_TEMPLATES = {
  Placed: {
    templateName: 'svl_order_placed',
    language: 'hi',
    bodyPreview: '🌸 नमस्ते {{1}}, Sri Vijaylaxmi Sarees से आपकी खरीदारी के लिए धन्यवाद! आपका ऑर्डर #{{2}} स्वीकार कर लिया गया है। कुल अमाउंट: ₹{{3}} ({{4}})। आपका बिल/इनवॉइस तैयार है।',
    buildParams: (order) => [
      order.shippingAddress?.fullName || 'Customer',
      order.orderNumber,
      Number(order.totalPrice || 0).toLocaleString('en-IN'),
      order.paymentMethod || 'COD',
    ],
  },
  Confirmed: {
    templateName: 'svl_order_confirmed',
    language: 'hi',
    bodyPreview: '🧵 नमस्ते {{1}}, आपका ऑर्डर #{{2}} स्वीकार कर लिया गया है और हमारी हैंडलूम टीम आपकी साड़ी तैयार कर रही है।',
    buildParams: (order) => [
      order.shippingAddress?.fullName || 'Customer',
      order.orderNumber,
    ],
  },
  Packed: {
    templateName: 'svl_order_packed',
    language: 'hi',
    bodyPreview: '📦 नमस्ते {{1}}, आपका ऑर्डर #{{2}} स्वीकार कर लिया गया है और आपकी प्योर सिल्क साड़ी को सिल्क प्रोटेक्टिव बॉक्स में सुरक्षित पैक कर दिया गया है।',
    buildParams: (order) => [
      order.shippingAddress?.fullName || 'Customer',
      order.orderNumber,
    ],
  },
  Shipped: {
    templateName: 'svl_order_shipped',
    language: 'hi',
    bodyPreview: '🚚 नमस्ते {{1}}, आपका ऑर्डर #{{2}} रवाना हो चुका है! कूरियर: {{3}}, Tracking AWB: {{4}}। लाइव लोकेशन ट्रैक करें: https://srivijaylaxmisarees.com/track/{{2}}',
    buildParams: (order, extra) => [
      order.shippingAddress?.fullName || 'Customer',
      order.orderNumber,
      extra?.courierName || extra?.location || 'BlueDart Logistics',
      extra?.trackingAwb || extra?.note || 'AWB-IN-TRANSIT',
    ],
  },
  'Out for Delivery': {
    templateName: 'svl_out_for_delivery',
    language: 'hi',
    bodyPreview: '🛵 नमस्ते {{1}}, आपका साड़ी पार्सल (#{{2}}) आज आपके पते पर डिलीवर होने वाला है। कृपया फोन एक्टिव रखें।',
    buildParams: (order) => [
      order.shippingAddress?.fullName || 'Customer',
      order.orderNumber,
    ],
  },
  Delivered: {
    templateName: 'svl_order_delivered',
    language: 'hi',
    bodyPreview: '🎉 नमस्ते {{1}}, आपका ऑर्डर #{{2}} सफलतापूर्वक डिलीवर हो गया है! Sri Vijaylaxmi Sarees को चुनने के लिए धन्यवाद।',
    buildParams: (order) => [
      order.shippingAddress?.fullName || 'Customer',
      order.orderNumber,
    ],
  },
  Cancelled: {
    templateName: 'svl_order_cancelled',
    language: 'hi',
    bodyPreview: '❌ नमस्ते {{1}}, आपका ऑर्डर #{{2}} कैंसिल कर दिया गया है। कारण: {{3}}। रिफंड सहायता के लिए WhatsApp करें।',
    buildParams: (order, extra) => [
      order.shippingAddress?.fullName || 'Customer',
      order.orderNumber,
      extra?.note || order.cancellationReason || 'Requested by Customer',
    ],
  },
};

/**
 * Normalize Indian Phone numbers to 91XXXXXXXXXX
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
};

/**
 * Sends a Template message or text via Meta WhatsApp Business Cloud API
 */
export const sendWhatsAppNotification = async ({
  phone,
  templateName,
  language = 'hi',
  parameters = [],
  textBody,
  phoneNumberId,
  accessToken,
}) => {
  const formattedPhone = formatPhoneNumber(phone);
  if (!formattedPhone) {
    throw new Error('Invalid phone number provided for WhatsApp');
  }

  const effectivePhoneId = phoneNumberId || process.env.WABA_PHONE_NUMBER_ID || '1252418734612866';
  const effectiveToken = accessToken || process.env.WABA_ACCESS_TOKEN;

  // Build Meta Graph API Payload
  let payload;
  if (templateName) {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: language },
        components: [
          {
            type: 'body',
            parameters: parameters.map((param) => ({
              type: 'text',
              text: String(param),
            })),
          },
        ],
      },
    };
  } else if (textBody) {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: {
        preview_url: true,
        body: textBody,
      },
    };
  }

  // If Live Token is present, make the live Meta Cloud API request
  if (effectiveToken && effectiveToken.length > 20) {
    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/${effectivePhoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || `Meta API error (${response.status})`);
      }

      return {
        success: true,
        provider: 'META_WABA_LIVE',
        messageId: data.messages?.[0]?.id || `waba_${Date.now()}`,
        data,
      };
    } catch (apiErr) {
      console.warn('Meta Graph API request error:', apiErr.message);
      throw apiErr;
    }
  }

  // In Local Development / Staging before token is saved
  return {
    success: true,
    provider: 'SIMULATED_DEV',
    messageId: `sim_waba_${Date.now()}`,
    phone: formattedPhone,
    templateName,
    parameters,
    note: 'Message simulated in local development mode. Enter WABA_ACCESS_TOKEN in Admin Marketing Settings to deliver to real phones.',
  };
};
