// 📁 backend/routes/events.js
import express from 'express';
import {
  createEvent,
  getEvents,
  deleteEvent,
  registerEvent
} from '../controllers/eventController.js';

import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected Routes
router.get('/', verifyToken, getEvents);
router.post('/', verifyToken, createEvent);
router.delete('/:id', verifyToken, deleteEvent);

// Public (optional): anyone can register
router.post('/:id/register', registerEvent);

export default router;
