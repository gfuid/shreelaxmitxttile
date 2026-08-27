import express from 'express';
import {
  getConversations,
  getConversationMessages,
  sendChatMessage,
  singleSend,
} from '../controllers/inboxController.js';

const router = express.Router();

router.get('/conversations', getConversations);
router.get('/conversations/:id/messages', getConversationMessages);
router.post('/conversations/:id/send', sendChatMessage);
router.post('/single-send', singleSend);

export default router;
