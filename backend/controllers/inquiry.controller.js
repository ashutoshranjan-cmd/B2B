import Enquiry from "../models/inquiry.model.js";
import Product from "../models/product.model.js";
import Company from "../models/seller.model.js";

/* ================= BUYER: CREATE ENQUIRY ================= */
export const createEnquiry = async (req, res) => {
    try {
        console.log("🔥 Enquiry API HIT");
        console.log("BODY:", req.body);
        const buyerId = req.user.id;
        console.log("Buyer ID:", buyerId);
        const { productId, name, email, mobile, message } = req.body;

        if (!productId || !name || !email || !mobile) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing",
            });
        }

        const product = await Product.findById(productId).populate("sellerCompany");
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Prevent duplicate enquiry (optional but recommended)
        const alreadyExists = await Enquiry.findOne({
            buyer: buyerId,
            product: productId,
        });

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "You have already enquired about this product",
            });
        }

        const enquiry = await Enquiry.create({
              buyer: buyerId,
            sellerCompany: product.sellerCompany,
            product: product._id,
            name,
            email,
            mobile,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully",
            data: enquiry,
        });
    } catch (error) {
        console.error("Create Enquiry Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= SELLER: VIEW ENQUIRIES ================= */
export const getSellerEnquiries = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const company = await Company.findOne({ owner: sellerId });
        if (!company) {
            return res.status(403).json({
                success: false,
                message: "Seller company not found",
            });
        }

        const enquiries = await Enquiry.find({
            sellerCompany: company._id,
        })
            .populate("product", "name price")
            .populate("buyer", "name email phone")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: enquiries.length,
            data: enquiries,
        });
    } catch (error) {
        console.error("Get Enquiries Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ================= SELLER: UPDATE ENQUIRY STATUS ================= */
export const updateEnquiryStatus = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { status } = req.body;

        const allowedStatus = ["new", "contacted", "closed"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const company = await Company.findOne({ owner: sellerId });
        if (!company) {
            return res.status(403).json({
                success: false,
                message: "Seller company not found",
            });
        }

        const enquiry = await Enquiry.findOneAndUpdate(
            {
                _id: req.params.id,
                sellerCompany: company._id, // 🔒 ownership check
            },
            { status },
            { new: true }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found or unauthorized",
            });
        }

        res.json({
            success: true,
            message: "Enquiry updated",
            data: enquiry,
        });
    } catch (error) {
        console.error("Update Enquiry Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
