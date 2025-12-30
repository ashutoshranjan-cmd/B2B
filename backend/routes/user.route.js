import express from 'express';
import {
  register,
  login,
  me,
  completeOnboarding,
} from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// auth
router.post('/register', register);
router.post('/login', login);

// user
router.get('/me', requireAuth, me);
router.post('/me/onboarding/complete', requireAuth, completeOnboarding);

export default router;
