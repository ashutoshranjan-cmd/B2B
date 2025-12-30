import express from 'express';
import {
  upsertCompany,
  getMyCompany,
  updateCompany,
} from '../controllers/seller.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { isSeller } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * ==========================
 * SELLER / COMPANY ROUTES
 * ==========================
 */

/**
 * Create or Update company (Seller onboarding)
 * POST /api/v1/company
 */
router.post('/', requireAuth, upsertCompany);

/**
 * Get logged-in seller's company
 * GET /api/v1/company/me
 */
router.get('/me', requireAuth, isSeller, getMyCompany);

/**
 * Update logged-in seller's company
 * PUT /api/v1/company/me
 */
router.put('/me', requireAuth, isSeller, updateCompany);

export default router;
