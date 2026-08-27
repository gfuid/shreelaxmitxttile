import express from 'express';
import { generateAiTryOn } from '../controllers/tryonController.js';

const router = express.Router();

router.post('/generate', generateAiTryOn);

export default router;
