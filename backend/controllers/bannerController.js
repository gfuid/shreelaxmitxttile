import Banner from '../models/Banner.js';

// @desc    Get active banners for homepage carousel
// @route   GET /api/banners
// @access  Public
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create banner (Admin)
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, badgeText, discountText, image, link, category, bgGradient, displayOrder } = req.body;

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      badgeText: badgeText || 'SPECIAL FESTIVE OFFER',
      discountText: discountText || 'Up to 50% Off',
      image,
      link: link || '/shop',
      category: category || '',
      bgGradient: bgGradient || 'linear-gradient(135deg, #4A0404 0%, #1F0000 100%)',
      displayOrder: Number(displayOrder) || 0,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update banner (Admin)
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    Object.assign(banner, req.body);
    const updated = await banner.save();

    res.json({
      success: true,
      message: 'Banner updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete banner (Admin)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Banner removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
