import express from 'express';
import { createLead, getAllLeads } from '../controllers/leadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createLead)
  .get(protect, admin, getAllLeads);

export default router;
