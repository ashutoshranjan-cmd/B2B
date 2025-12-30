import express from "express";
import { getGeminiProductData } from "../controllers/gemini.controller.js";

const router = express.Router();

router.post("/product-details", getGeminiProductData);

export default router;
