import ProductAI from "../models/gemini.model.js";
import Product from "../models/product.model.js";
import { generateProductDetails } from "../utils/gemini.js";

export const getGeminiProductData = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    /* ================== 1️⃣ FETCH PRODUCT ================== */
    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /* ================== 2️⃣ CHECK AI CACHE ================== */
    const cachedAI = await ProductAI.findOne({ productId }).lean();

    if (cachedAI) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: {
          highlights: cachedAI.highlights,
          specifications: cachedAI.specifications,
          longDescription: cachedAI.longDescription,
        },
      });
    }

    /* ================== 3️⃣ GENERATE AI (Gemini → Ollama fallback) ================== */
    const aiData = await generateProductDetails({
      name: product.name,
      category: product.category,
      description: product.description,
    });

    /* ================== 4️⃣ STORE AI DATA ================== */
    await ProductAI.create({
      productId: product._id,
      productName: product.name,
      highlights: aiData.highlights || [],
      specifications: aiData.specifications || {},
      longDescription: aiData.longDescription || "",
    });

    /* ================== 5️⃣ RETURN AI DATA ================== */
    return res.status(200).json({
      success: true,
      source: "ai",
      data: aiData,
    });

  } catch (error) {
    console.error("Gemini Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};
