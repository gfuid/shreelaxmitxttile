/**
 * Service to sync customer leads, signups, inquiries, and orders
 * to Google Sheets and FlowConnect CRM in real-time.
 */

export const syncLeadToGoogleSheet = async (leadData) => {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl && !crmWebhookUrl) {
    return { success: false, message: 'No webhook URL configured' };
  }

  const payload = {
    dateTime: leadData.dateTime || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    leadType: leadData.leadType || 'Website Lead',
    fullName: leadData.fullName || leadData.name || '',
    phone: leadData.phone || '',
    email: leadData.email || '',
    city: leadData.city || '',
    state: leadData.state || '',
    pincode: leadData.pincode || '',
    address: leadData.address || leadData.street || '',
    orderNumber: leadData.orderNumber || '',
    products: leadData.products || '',
    totalAmount: leadData.totalAmount !== undefined ? leadData.totalAmount : '',
    paymentMethod: leadData.paymentMethod || '',
    paymentStatus: leadData.paymentStatus || '',
  };

  // Asynchronously dispatch to Google Sheet
  if (webhookUrl) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      })
        .then((res) => {
          if (res.ok) {
            console.log(`[GoogleSheet Sync] Successfully synced "${payload.leadType}" for ${payload.fullName || payload.email}`);
          } else {
            console.warn(`[GoogleSheet Sync] Response status: ${res.status}`);
          }
        })
        .catch((err) => {
          console.warn('[GoogleSheet Sync] Failed to sync row:', err.message);
        });
    } catch (e) {
      console.warn('[GoogleSheet Sync] Dispatch error:', e.message);
    }
  }

  // Optional: Direct FlowConnect CRM Webhook dispatch if configured
  if (crmWebhookUrl) {
    try {
      fetch(crmWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.fullName,
          phone: payload.phone,
          email: payload.email,
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          address: payload.address,
          lead_source: `Website - ${payload.leadType}`,
          order_number: payload.orderNumber,
          order_total: payload.totalAmount,
          products: payload.products,
          created_at: payload.dateTime,
        }),
      })
        .then((res) => {
          console.log(`[CRM Sync] Dispatched to FlowConnect CRM: ${res.status}`);
        })
        .catch((err) => {
          console.warn('[CRM Sync] Failed to sync to CRM:', err.message);
        });
    } catch (e) {
      console.warn('[CRM Sync] Dispatch error:', e.message);
    }
  }

  return { success: true };
};

export default syncLeadToGoogleSheet;
