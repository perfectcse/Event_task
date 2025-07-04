import express from 'express';
import {
  loginAdmin,
  forgotPassword,
  resetPassword
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
