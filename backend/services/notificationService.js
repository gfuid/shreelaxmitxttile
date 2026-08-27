import { generateInvoicePDF } from './invoiceService.js';
import { sendEmailNotification, buildEmailTemplate } from './emailService.js';
import { sendWhatsAppNotification, DEFAULT_STAGE_TEMPLATES } from './whatsappService.js';
import NotificationLog from '../models/NotificationLog.js';
import MarketingSettings from '../models/MarketingSettings.js';

/**
 * Replace placeholders like {customer_name}, {order_number}, {total_amount}, {courier_name}, {tracking_awb}
 */
const interpolateTemplate = (text, order, extraDetails = {}) => {
  if (!text) return '';
  const customerName = order?.shippingAddress?.fullName || 'Customer';
  const orderNumber = order?.orderNumber || 'SVL-ORDER';
  const totalAmount = Number(order?.totalPrice || 0).toLocaleString('en-IN');
  const paymentMethod = order?.paymentMethod || 'COD';
  const courierName = extraDetails?.courierName || 'BlueDart Logistics';
  const trackingAwb = extraDetails?.trackingAwb || extraDetails?.note || 'AWB-LIVE';
  const trackingUrl = `https://srivijaylaxmisarees.com/track/${orderNumber}`;

  return text
    .replace(/{customer_name}/g, customerName)
    .replace(/{{1}}/g, customerName)
    .replace(/{order_number}/g, orderNumber)
    .replace(/{{2}}/g, orderNumber)
    .replace(/{total_amount}/g, totalAmount)
    .replace(/{{3}}/g, totalAmount)
    .replace(/{payment_method}/g, paymentMethod)
    .replace(/{{4}}/g, paymentMethod)
    .replace(/{courier_name}/g, courierName)
    .replace(/{tracking_awb}/g, trackingAwb)
    .replace(/{tracking_url}/g, trackingUrl)
    .replace(/{note}/g, extraDetails?.note || '');
};

/**
 * Main Trigger function called when order is created or status changes
 */
export const triggerOrderNotification = async (order, stage = 'Placed', extraDetails = {}) => {
  if (!order) return;

  const results = {
    orderNumber: order.orderNumber,
    stage,
    whatsapp: { status: 'SKIPPED' },
    email: { status: 'SKIPPED' },
  };

  try {
    // 1. Fetch configured Marketing Settings & Stage Templates
    let settings = null;
    try {
      settings = await MarketingSettings.findOne();
    } catch (e) {}

    // Find custom template configured by Admin (if any)
    const customTemplate = settings?.stageTemplates?.find(
      (t) => t.stage.toLowerCase() === stage.toLowerCase() && t.isActive !== false
    );

    const recipientPhone = order.shippingAddress?.phone;
    const recipientEmail = order.shippingAddress?.email || order.user?.email || (typeof order.user === 'object' ? order.user?.email : null);
    const customerName = order.shippingAddress?.fullName || 'Customer';

    // 2. Generate Luxury PDF Invoice Buffer if enabled or on Placed/Delivered/Shipped
    let invoicePdfBuffer = null;
    const shouldAttachInvoice = customTemplate ? customTemplate.attachInvoice : (stage === 'Placed' || stage === 'Delivered' || stage === 'Shipped');
    if (shouldAttachInvoice) {
      try {
        invoicePdfBuffer = await generateInvoicePDF(order);
      } catch (pdfErr) {
        console.warn('PDF invoice generation notice:', pdfErr.message);
      }
    }

    // 3. Send WhatsApp Notification
    if (recipientPhone) {
      try {
        const stageDef = DEFAULT_STAGE_TEMPLATES[stage] || DEFAULT_STAGE_TEMPLATES.Placed;
        const templateName = customTemplate?.whatsappTemplateName || stageDef.templateName;
        const language = customTemplate?.whatsappLanguage || stageDef.language || 'hi';
        
        let textBody = null;
        if (customTemplate?.whatsappBody) {
          textBody = interpolateTemplate(customTemplate.whatsappBody, order, extraDetails);
        }

        const parameters = stageDef.buildParams(order, extraDetails);

        const waRes = await sendWhatsAppNotification({
          phone: recipientPhone,
          templateName,
          language,
          parameters,
          textBody,
          phoneNumberId: settings?.wabaPhoneNumberId,
          accessToken: settings?.wabaAccessToken,
        });

        results.whatsapp = {
          status: waRes.success ? 'SENT' : 'FAILED',
          messageId: waRes.messageId,
          provider: waRes.provider,
        };
      } catch (waErr) {
        console.error(`WhatsApp stage notification error [${stage}]:`, waErr.message);
        results.whatsapp = { status: 'FAILED', error: waErr.message };
      }
    }

    // 4. Send Email Notification with PDF Attachment
    if (recipientEmail && recipientEmail.includes('@') && !recipientEmail.includes('none')) {
      try {
        const emailSubject = customTemplate?.emailSubject
          ? interpolateTemplate(customTemplate.emailSubject, order, extraDetails)
          : `🌸 Order #${order.orderNumber} Update: ${stage} | Sri Vijaylaxmi Sarees`;

        const emailHeading = customTemplate?.emailHeading
          ? interpolateTemplate(customTemplate.emailHeading, order, extraDetails)
          : `Order Status: ${stage}`;

        const emailSubtext = customTemplate?.emailSubtext
          ? interpolateTemplate(customTemplate.emailSubtext, order, extraDetails)
          : (extraDetails.note || `Status of your handloom saree order #${order.orderNumber} is now: ${stage}.`);

        const emailHtml = buildEmailTemplate({
          stage,
          order,
          customHeading: emailHeading,
          customSubtext: emailSubtext,
        });

        const attachments = [];
        if (invoicePdfBuffer) {
          attachments.push({
            filename: `SriVijaylaxmi_Invoice_${order.orderNumber}.pdf`,
            content: invoicePdfBuffer,
          });
        }

        const emailRes = await sendEmailNotification({
          to: recipientEmail,
          subject: emailSubject,
          html: emailHtml,
          attachments,
          apiKey: settings?.resendApiKey,
          fromEmail: settings?.resendFromEmail,
        });

        results.email = {
          status: emailRes.success ? 'SENT' : 'FAILED',
          messageId: emailRes.messageId,
          provider: emailRes.provider,
          hasInvoiceAttachment: attachments.length > 0,
        };
      } catch (emErr) {
        console.error(`Email stage notification error [${stage}]:`, emErr.message);
        results.email = { status: 'FAILED', error: emErr.message };
      }
    }

    // 5. Save Record to NotificationLog in MongoDB
    try {
      await NotificationLog.create({
        channel: 'BOTH',
        type: 'ORDER_STAGE',
        stage,
        orderId: order._id,
        orderNumber: order.orderNumber,
        recipient: {
          name: customerName,
          phone: recipientPhone || '',
          email: recipientEmail || '',
        },
        whatsappDetails: {
          templateName: customTemplate?.whatsappTemplateName || DEFAULT_STAGE_TEMPLATES[stage]?.templateName || 'svl_order_placed',
          status: results.whatsapp.status,
          messageId: results.whatsapp.messageId,
          error: results.whatsapp.error,
        },
        emailDetails: {
          subject: `Order #${order.orderNumber} Update: ${stage}`,
          status: results.email.status,
          messageId: results.email.messageId,
          hasInvoiceAttachment: !!results.email.hasInvoiceAttachment,
          error: results.email.error,
        },
        summary: `Stage [${stage}] triggered for ${customerName} (#${order.orderNumber})`,
      });
    } catch (logErr) {
      console.warn('Could not save notification log:', logErr.message);
    }

    return results;
  } catch (err) {
    console.error('Fatal notification service error:', err);
    return results;
  }
};
