import mongoose from "mongoose";

const productAISchema = new mongoose.Schema(
  {
    // 🔗 Relation to product
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
      index: true,
    },

    // 🧾 Snapshot (prevents spelling / rename issues)
    productName: {
      type: String,
      required: true,
    },

    // 🤖 AI-generated content (ONLY this)
    highlights: {
      type: [String],
      default: [],
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    longDescription: {
      type: String,
      default: "",
    },

    // ℹ️ Metadata (minimal)
    modelUsed: {
      type: String,
      default: "gemini-2.5-flash",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProductAI", productAISchema);
