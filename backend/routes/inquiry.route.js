import express from "express";
import {
  createEnquiry,
  getSellerEnquiries,
  updateEnquiryStatus
} from "../controllers/inquiry.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { isSeller } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ================= BUYER ================= */
router.post("/", requireAuth, createEnquiry);

/* ================= SELLER ================= */
router.get("/seller", requireAuth, isSeller, getSellerEnquiries);
router.put("/:id/status", requireAuth, isSeller, updateEnquiryStatus);

export default router;
