import express from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getActiveBanners);
router.get('/admin', protect, admin, getAllBanners);

router.post('/', protect, admin, createBanner);

router.route('/:id')
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

export default router;
