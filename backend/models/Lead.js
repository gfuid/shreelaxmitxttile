import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  leadType: {
    type: String,
    enum: ['Signup', 'New Order', 'Inquiry', 'Festive Voucher', 'Contact Form', 'Custom Weave', 'Other'],
    default: 'Inquiry',
  },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  topic: { type: String, default: '' },
  message: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  address: { type: String, default: '' },
  status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Closed'], default: 'New' },
}, {
  timestamps: true,
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
