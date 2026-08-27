import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail, getPasswordResetHtmlTemplate } from '../utils/sendEmail.js';
import { syncLeadToGoogleSheet } from '../utils/googleSheetsService.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'srivijaylaxmi_super_secure_jwt_secret_2026_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account already exists with this email address' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'customer',
    });

    // Real-time sync new customer signup to Google Sheet & FlowConnect CRM
    syncLeadToGoogleSheet({
      leadType: 'Signup',
      fullName: user.name,
      email: user.email,
      phone: user.phone || '',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
        token: generateToken(updatedUser._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add delivery address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, landmark, city, state, pincode, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    const newAddress = {
      fullName,
      phone,
      street,
      landmark: landmark || '',
      city,
      state,
      pincode,
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save();

    // Sync updated address details to Google Sheet
    syncLeadToGoogleSheet({
      leadType: 'Address Added',
      fullName: newAddress.fullName || user.name,
      phone: newAddress.phone || user.phone,
      email: user.email,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      address: `${newAddress.street}${newAddress.landmark ? ', ' + newAddress.landmark : ''}`,
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete delivery address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();

    res.json({
      success: true,
      message: 'Address removed successfully',
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/auth/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const index = user.wishlist.indexOf(productId);
    let isWishlisted = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      isWishlisted = false;
    } else {
      user.wishlist.push(productId);
      isWishlisted = true;
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.json({
      success: true,
      message: isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
      isWishlisted,
      data: updatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({
      success: true,
      data: user.wishlist || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password - Generate reset token and email reset link
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account registered with this email address' });
    }

    // Generate reset token and expiration
    const resetToken = user.getResetPasswordToken();

    // Save token to DB without executing full schema validations
    await user.save({ validateBeforeSave: false });

    // Determine base URL (front origin / admin origin / environment fallback)
    const reqOrigin = req.get('origin') || req.get('referer');
    let baseUrl = user.role === 'admin'
      ? (process.env.ADMIN_URL || 'http://localhost:5174')
      : (process.env.FRONTEND_URL || 'http://localhost:5173');

    if (reqOrigin) {
      try {
        const parsed = new URL(reqOrigin);
        baseUrl = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {}
    }

    const resetUrl = `${baseUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;

    const html = getPasswordResetHtmlTemplate({
      userName: user.name,
      resetUrl,
      resetToken,
      validMinutes: 15,
    });

    const message = `You are receiving this email because you (or someone else) requested a password reset for your Sri Vijaylaxmi account.\n\nPlease reset your password using the following link:\n\n${resetUrl}\n\nThis link expires in 15 minutes. If you did not request this, please ignore this email.`;

    const mailResult = await sendEmail({
      email: user.email,
      subject: 'Reset Your Sri Vijaylaxmi Password',
      message,
      html,
      resetUrl,
    });

    res.json({
      success: true,
      message: mailResult.success
        ? 'Password reset link has been dispatched to your email address!'
        : 'Password reset link generated. Check console or server logs in development mode.',
      devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password via secure token
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resettoken } = req.params;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Hash token from param to compare with database
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new link.',
      });
    }

    // Update password & clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password successfully updated! You can now log in.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

