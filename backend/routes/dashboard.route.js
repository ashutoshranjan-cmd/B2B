import express from 'express';
import {
  getDashboardSummary,
  getDashboardAnalytics,
  getDashboardActivity
} from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { isSeller } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * ==========================
 * SELLER DASHBOARD ROUTES
 * ==========================
 * All routes require authentication and seller role
 */

/**
 * Get dashboard summary with key metrics
 * GET /api/v1/seller/dashboard/summary
 */
router.get('/summary', requireAuth, isSeller, getDashboardSummary);

/**
 * Get dashboard analytics data
 * GET /api/v1/seller/dashboard/analytics
 */
router.get('/analytics', requireAuth, isSeller, getDashboardAnalytics);

/**
 * Get dashboard recent activity feed
 * GET /api/v1/seller/dashboard/activity
 */
router.get('/activity', requireAuth, isSeller, getDashboardActivity);

export default router;