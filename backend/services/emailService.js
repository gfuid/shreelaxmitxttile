import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Stage-wise Email HTML Template Generator
 */
export const buildEmailTemplate = ({ stage, order, customHeading, customSubtext, customBody, couponCode, bannerUrl, ctaUrl }) => {
  const customerName = order?.shippingAddress?.fullName || 'Valued Customer';
  const orderNumber = order?.orderNumber || 'SVL-ORDER';
  const grandTotal = Number(order?.totalPrice || 0).toLocaleString('en-IN');
  const items = order?.orderItems || [];
  const trackingLink = `https://srivijaylaxmisarees.com/track/${orderNumber}`;

  // Stage Specific Theme Badges
  const stageBadges = {
    Placed: { title: 'Order Confirmed & Received', color: '#700B1A', icon: '🌸' },
    Confirmed: { title: 'Order Accepted & In Production', color: '#D97706', icon: '🧵' },
    Packed: { title: 'Packed with Silk Protection', color: '#2563EB', icon: '📦' },
    Shipped: { title: 'Dispatched & Handed to Courier', color: '#4F46E5', icon: '🚚' },
    'Out for Delivery': { title: 'Out for Delivery Today', color: '#059669', icon: '🛵' },
    Delivered: { title: 'Successfully Delivered', color: '#16A34A', icon: '🎉' },
    Cancelled: { title: 'Order Cancelled', color: '#DC2626', icon: '❌' },
  };

  const badge = stageBadges[stage] || { title: `Order Update: ${stage}`, color: '#700B1A', icon: '✨' };

  // Items table HTML
  const itemsHtml = items.map((it) => `
    <tr style="border-bottom: 1px solid #F5F0EB;">
      <td style="padding: 12px 0;">
        <div style="font-weight: 600; color: #1C1917; font-size: 14px;">${it.title || 'Pure Handloom Silk Saree'}</div>
        <div style="color: #78716C; font-size: 12px;">Color: ${it.color || 'Traditional'} | Qty: ${it.quantity || 1}</div>
      </td>
      <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #700B1A; font-size: 14px;">
        Rs. ${Number(it.price || 0).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sri Vijaylaxmi Sarees</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #292524;">
    <div style="max-width: 620px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EAE4DC; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
      
      <!-- Brand Header -->
      <div style="background: linear-gradient(135deg, #700B1A 0%, #4A0510 100%); padding: 32px 24px; text-align: center; color: #FFFFFF;">
        <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #FDE68A; font-weight: bold; margin-bottom: 6px;">
          Authentic Handloom Heritage
        </div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1px; font-family: Georgia, serif;">
          SRI VIJAYLAXMI SAREES
        </h1>
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #F5E8D8; opacity: 0.9;">
          Pure Silk Mark Certified Handloom Weaves | Hyderabad, India
        </p>
      </div>

      <!-- Status Banner -->
      <div style="background-color: #FDF7F2; border-bottom: 1px solid #EFE6DC; padding: 18px 24px; text-align: center;">
        <div style="display: inline-block; background-color: ${badge.color}; color: #FFFFFF; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold;">
          ${badge.icon} ${customHeading || badge.title}
        </div>
        <div style="margin-top: 8px; font-size: 13px; color: #78716C;">
          Order Reference: <strong style="color: #1C1917;">#${orderNumber}</strong>
        </div>
      </div>

      <!-- Main Body -->
      <div style="padding: 28px 24px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: #292524;">
          Namaste <strong>${customerName}</strong>,
        </p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #57534E; margin: 0 0 24px 0;">
          ${customSubtext || customBody || `We are pleased to update you regarding your pure silk saree order with Sri Vijaylaxmi Sarees.`}
        </p>

        <!-- Order Items Box -->
        <div style="background-color: #FAF8F5; border-radius: 12px; padding: 20px; border: 1px solid #EAE4DC; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #700B1A; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #E8E2D9; padding-bottom: 6px;">
            Order Items Summary
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="border-top: 1px solid #E8E2D9; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
            <div style="font-size: 13px; color: #78716C;">Total Payable:</div>
            <div style="font-size: 16px; font-weight: 800; color: #700B1A;">Rs. ${grandTotal}</div>
          </div>
        </div>

        ${couponCode ? `
        <!-- Promo Coupon Highlight -->
        <div style="background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 1px dashed #D97706; border-radius: 10px; padding: 14px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 11px; font-weight: bold; color: #92400E; text-transform: uppercase;">Special Privilege Coupon</div>
          <div style="font-size: 18px; font-weight: 800; color: #700B1A; letter-spacing: 2px; margin: 4px 0;">${couponCode}</div>
          <div style="font-size: 11px; color: #78350F;">Use this code on your next purchase for exclusive weaver discounts.</div>
        </div>
        ` : ''}

        <!-- CTA Button -->
        <div style="text-align: center; margin: 28px 0;">
          <a href="${ctaUrl || trackingLink}" style="background-color: #700B1A; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 25px; font-size: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(112, 11, 26, 0.25);">
            Track Shipment Live
          </a>
        </div>

        <p style="font-size: 12px; color: #A8A29E; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
          📎 <em>A copy of your official GST Tax Invoice has been attached to this email as a PDF.</em>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #1C1917; padding: 24px; text-align: center; color: #A8A29E; font-size: 11px; line-height: 1.6;">
        <div style="color: #F5E8D8; font-weight: bold; font-size: 12px; margin-bottom: 4px;">
          Sri Vijaylaxmi Sarees • Hyderabad Fulfillment Center
        </div>
        <div>Customer Support: +91 82183 22073 | WhatsApp Support Available</div>
        <div>Store Email: care@srivijaylaxmisarees.com</div>
        <div style="margin-top: 8px; color: #78716C;">
          © ${new Date().getFullYear()} Sri Vijaylaxmi Sarees. All Rights Reserved. Pure Handloom Authenticity Guaranteed.
        </div>
      </div>

    </div>
  </body>
  </html>
  `;
};

/**
 * Send email using Resend (Primary) with fallback to Nodemailer SMTP
 */
export const sendEmailNotification = async ({ to, subject, html, attachments = [], apiKey, fromEmail }) => {
  const effectiveApiKey = apiKey || process.env.RESEND_API_KEY;
  const effectiveFrom = fromEmail || process.env.RESEND_FROM_EMAIL || 'Sri Vijaylaxmi Sarees <onboarding@resend.dev>';

  // 1. Try Resend if API Key available
  if (effectiveApiKey && effectiveApiKey.startsWith('re_')) {
    try {
      const resend = new Resend(effectiveApiKey);
      const payload = {
        from: effectiveFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      };

      if (attachments.length > 0) {
        payload.attachments = attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
        }));
      }

      const { data, error } = await resend.emails.send(payload);

      if (error) {
        throw new Error(error.message || 'Resend error');
      }

      return {
        success: true,
        provider: 'RESEND',
        messageId: data?.id || `resend_${Date.now()}`,
      };
    } catch (err) {
      console.warn('Resend primary email attempt failed, checking SMTP fallback:', err.message);
    }
  }

  // 2. Fallback to Nodemailer SMTP if configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT || '465') === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Sri Vijaylaxmi Sarees'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        attachments: attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
        })),
      });

      return {
        success: true,
        provider: 'SMTP',
        messageId: info.messageId,
      };
    } catch (smtpErr) {
      console.error('SMTP fallback failed:', smtpErr.message);
      throw smtpErr;
    }
  }

  // In local test mode without credentials configured yet
  return {
    success: true,
    provider: 'SIMULATED_DEV',
    messageId: `dev_email_${Date.now()}`,
    note: 'Email simulated in development mode. Add RESEND_API_KEY in Settings to send live emails.',
  };
};
