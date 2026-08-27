import Lead from '../models/Lead.js';
import { syncLeadToGoogleSheet } from '../utils/googleSheetsService.js';

// @desc    Submit an inquiry or lead (Contact form, Voucher claim, Callback request)
// @route   POST /api/leads
// @access  Public
export const createLead = async (req, res) => {
  try {
    const { name, phone, email, topic, message, leadType, city, state, pincode, address } = req.body;

    if (!name || (!phone && !email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name and at least a phone number or email address',
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      topic: topic || 'General Inquiry',
      message: message || '',
      leadType: leadType || 'Inquiry',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      address: address || '',
    });

    // Real-time background sync to Google Sheet & FlowConnect CRM
    syncLeadToGoogleSheet({
      leadType: leadType || 'Inquiry',
      fullName: lead.name,
      phone: lead.phone,
      email: lead.email,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      address: lead.address || (lead.message ? `Topic: ${lead.topic} | Msg: ${lead.message}` : ''),
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Our team will reach out soon.',
      data: lead,
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads (Admin)
// @route   GET /api/leads
// @access  Private/Admin
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
