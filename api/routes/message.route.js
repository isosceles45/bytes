import express from 'express';
import { messages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/messages/:userId', messages);

export default router;