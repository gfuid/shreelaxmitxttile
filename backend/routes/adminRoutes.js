import express from 'express';
import {
  getDashboardStats,
  getAllCustomers,
  getAllReviews,
  replyToReview,
  deleteReview,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/customers', protect, admin, getAllCustomers);
router.get('/reviews', protect, admin, getAllReviews);
router.post('/reviews/:productId/:reviewId/reply', protect, admin, replyToReview);
router.delete('/reviews/:productId/:reviewId', protect, admin, deleteReview);

export default router;
