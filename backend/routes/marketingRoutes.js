import express from 'express';
import {
  getMarketingAnalytics,
  getStageTemplates,
  saveTemplate,
  deleteTemplate,
  resetTemplates,
  getMarketingSettings,
  saveMarketingSettings,
  sendTestNotification,
  sendBulkBroadcast,
  getCampaignHistory,
} from '../controllers/marketingController.js';

const router = express.Router();

// Analytics & Reports
router.get('/analytics', getMarketingAnalytics);

// Template Management (List, Create, Update, Delete, Reset)
router.get('/templates', getStageTemplates);
router.post('/templates', saveTemplate);
router.delete('/templates/:id', deleteTemplate);
router.post('/templates/reset', resetTemplates);

// Settings (WABA Token & Resend Key)
router.get('/settings', getMarketingSettings);
router.post('/settings', saveMarketingSettings);

// 1-Click Test Ping
router.post('/test-ping', sendTestNotification);

// Bulk Broadcast Campaigns
router.post('/broadcast', sendBulkBroadcast);
router.get('/campaigns', getCampaignHistory);

export default router;
