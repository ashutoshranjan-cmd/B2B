import Product from "../models/product.model.js";
import Company from "../models/seller.model.js";

/**
 * ================================
 * SELLER: CREATE PRODUCT
 * ================================
 */
export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT

    // 🔒 Fetch seller company
    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Company not found. Complete company onboarding first.",
      });
    }

    // 🚫 Prevent duplicate product name per company
    const existingProduct = await Product.findOne({
      name: req.body.name,
      sellerCompany: company._id,
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this name already exists for your company.",
      });
    }

    // 🖼️ Handle images
    const images =
      req.files?.map((file) => ({
        url: file.path,
        alt: req.body.name,
      })) || [];

    // ✅ CREATE PRODUCT (FIXED)
    const product = await Product.create({
      ...req.body,
      subDomain: company.subDomain, // 🔥 REQUIRED FIX
      owner: userId,              // 🔥 REQUIRED FIX
      sellerCompany: company._id, // 🔥 REQUIRED
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================================
 * SELLER: UPDATE PRODUCT
 * ================================
 */
export const updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ❌ Prevent sellerCompany or owner tampering
    const { owner, sellerCompany, ...safeBody } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerCompany: company._id },
      safeBody,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================================
 * SELLER: DELETE PRODUCT (SOFT)
 * ================================
 */
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerCompany: company._id },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================================
 * SELLER: GET MY PRODUCTS
 * ================================
 */
export const getSellerProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const products = await Product.find({
      sellerCompany: company._id,
    }).sort("-createdAt");

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================================
 * BUYER: RANDOM PRODUCTS
 * ================================
 */
export const getRandomProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;

    const products = await Product.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } },
    ]);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================================
 * BUYER: PRODUCTS BY CATEGORY
 * ================================
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category,
      isActive: true,
    }).populate("sellerCompany", "companyName address.city");

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================================
 * BUYER: FILTER & SEARCH PRODUCTS
 * ================================
 */
export const filterProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      tags,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (keyword) {
      query.$text = { $search: keyword };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("sellerCompany", "companyName address.city");

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================================
 * BUYER: REDIRECT TO SELLER STORE
 * ================================
 */
export const redirectToSeller = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "sellerCompany",
      "subdomain"
    );

    if (!product || !product.sellerCompany) {
      return res.status(404).json({
        success: false,
        message: "Product or seller not found",
      });
    }

    const redirectUrl = `https://${product.sellerCompany.subdomain}.yourapp.com/product/${product._id}`;
    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * ================================
 * ADMIN / INTERNAL: GET PRODUCTS BY OWNER ID
 * ================================
 * @route   GET /api/v1/products/owner/:ownerId
 * @access  Protected (Admin or Internal use)
 */
export const getProductsByOwner  = async (req, res) => {
  try {
    // 🔑 comes from JWT
    const {subdomain} = req.params;

    if (!subdomain) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: owner not found",
      });
    }

    const products = await Product.find({
      subDomain: subdomain,
      isActive: true,
    }).sort("-createdAt");

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * ================================
 * GET PRODUCT DETAILS BY PRODUCT ID
 * ================================
 * @route   GET /api/v1/products/:productId
 * @access  Protected (Admin / Internal)
 */
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

