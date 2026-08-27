import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer Transporter instance
 * configured with environment variables.
 */
const getSmtpPass = () => (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '').replace(/\s+/g, '');

const createTransporter = () => {
  const isGmail = process.env.SMTP_SERVICE === 'gmail' || (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail'));
  const user = process.env.SMTP_USER || process.env.SMTP_EMAIL;
  const pass = getSmtpPass();

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Generic send email helper
 * @param {Object} options { email, subject, message, html }
 */
export const sendEmail = async (options) => {
  const fromName = process.env.SMTP_FROM_NAME || 'Sri Vijaylaxmi Sarees';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'srivijaylaxmitextiles@gmail.com';

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${options.email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ SMTP Email Error: ${error.message}`);
    console.warn(`💡 [DEV LOG] Password Reset URL for ${options.email}:`);
    if (options.resetUrl) {
      console.warn(`👉 ${options.resetUrl}`);
    }
    // Return error information without crashing
    return { success: false, error: error.message };
  }
};

/**
 * Generates an elegant royal HTML email template for Sri Vijaylaxmi Password Reset
 */
export const getPasswordResetHtmlTemplate = ({ userName, resetUrl, resetToken, validMinutes = 15 }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Sri Vijaylaxmi Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2B2623; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #FAF8F5; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8E2D9; box-shadow: 0 10px 25px rgba(112, 11, 26, 0.06);">
          
          <!-- Top Royal Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #700B1A 0%, #4A0510 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #D97706;">
              <div style="font-size: 11px; font-weight: 700; color: #F5D38A; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 6px;">
                Sri Vijaylaxmi Sarees & Textiles
              </div>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0; font-family: Georgia, 'Times New Roman', serif; letter-spacing: 0.5px;">
                Password Reset Request
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <p style="font-size: 15px; line-height: 24px; color: #374151; margin: 0 0 18px 0;">
                Hello <strong>${userName || 'Valued Customer'}</strong>,
              </p>

              <p style="font-size: 14px; line-height: 22px; color: #4B5563; margin: 0 0 24px 0;">
                We received a request to reset the password for your <strong>Sri Vijaylaxmi</strong> account. Click the button below to choose a new password:
              </p>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #700B1A; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 34px; border-radius: 10px; border: 1px solid #580816; box-shadow: 0 4px 14px rgba(112, 11, 26, 0.25);">
                      Reset My Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert Box -->
              <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="font-size: 12.5px; line-height: 18px; color: #92400E; margin: 0;">
                  ⏱️ <strong>Note:</strong> This link is valid for <strong>${validMinutes} minutes</strong> only. If you did not make this request, you can safely ignore this email — your account remains secure.
                </p>
              </div>

              <!-- Fallback Direct Link -->
              <div style="border-top: 1px solid #F3F4F6; padding-top: 18px;">
                <p style="font-size: 11px; line-height: 16px; color: #6B7280; margin: 0 0 6px 0;">
                  Button not working? Copy and paste this URL into your browser:
                </p>
                <p style="font-size: 11px; line-height: 16px; color: #700B1A; word-break: break-all; margin: 0; background-color: #FAF8F5; padding: 8px 10px; border-radius: 6px; border: 1px solid #E5E7EB;">
                  ${resetUrl}
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF8F5; padding: 24px 30px; text-align: center; border-top: 1px solid #E8E2D9;">
              <p style="font-size: 11.5px; line-height: 17px; color: #6B7280; margin: 0 0 6px 0;">
                Sri Vijay Laxmi Textiles, 21-1-667/5/B, God Gift Market, Rikab Gunj, Hyderabad - 500002
              </p>
              <p style="font-size: 11px; color: #9CA3AF; margin: 0;">
                Need help? WhatsApp: +91 93945 12326 | Email: care@srivijaylaxmi.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export default sendEmail;
