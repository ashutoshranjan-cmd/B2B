import Product from "../models/product.model.js";
import Company from "../models/seller.model.js";

// /*
//  * Compares a specific product from different sellers based on price.
//  * Finds products with the same name from different seller companies.
//  */
// export const compareProductPrices = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     // Find the original product
//     const originalProduct = await Product.findById(productId).populate('sellerCompany', 'companyName');
//     if (!originalProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found.",
//       });
//     }

//     // Find all products with the same name from different sellers
//     const comparedProducts = await Product.find({
//       name: originalProduct.name,
//       _id: { $ne: productId }, 
//       isActive: true, 
//     })
//     .populate('sellerCompany', 'companyName businessType address.city address.state isVerified')
//     .sort({ price: 1 }); 

//     // 📊 Prepare comparison data
//     const comparisonData = {
//       originalProduct: {
//         id: originalProduct._id,
//         name: originalProduct.name,
//         price: originalProduct.price,
//         category: originalProduct.category,
//         seller: originalProduct.sellerCompany,
//         images: originalProduct.images,
//         stock: originalProduct.stock,
//         minOrderQty: originalProduct.minOrderQty,
//       },
//       alternatives: comparedProducts.map(product => ({
//         id: product._id,
//         price: product.price,
//         seller: product.sellerCompany,
//         images: product.images,
//         stock: product.stock,
//         minOrderQty: product.minOrderQty,
//         priceDifference: product.price - originalProduct.price,
//       })),
//       totalAlternatives: comparedProducts.length,
//       priceRange: comparedProducts.length > 0 ? {
//         lowest: Math.min(...comparedProducts.map(p => p.price)),
//         highest: Math.max(...comparedProducts.map(p => p.price)),
//       } : null,
//     };

//     res.status(200).json({
//       success: true,
//       message: "Product comparison retrieved successfully.",
//       data: comparisonData,
//     });

//   } catch (error) {
//     console.error("Error in compareProductPrices:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

export const compareProductPrices = async (req, res) => {
  try {
    const { productId } = req.params;

    const originalProduct = await Product.findById(productId)
      .populate("sellerCompany", "companyName");

    if (!originalProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // IMPORTANT: exclude same seller
    const comparedProducts = await Product.find({
      name: originalProduct.name,
      category: originalProduct.category,
      sellerCompany: { $ne: originalProduct.sellerCompany._id },
      isActive: true,
    })
      .populate(
        "sellerCompany",
        "companyName businessType address.city address.state isVerified"
      )
      .sort({ price: 1 });

    const comparisonData = {
      originalProduct: {
        id: originalProduct._id,
        name: originalProduct.name,
        price: originalProduct.price,
        category: originalProduct.category,
        description: originalProduct.description,
        seller: originalProduct.sellerCompany,
        images: originalProduct.images,
        stock: originalProduct.stock,
        minOrderQty: originalProduct.minOrderQty,
      },

      alternatives: comparedProducts.map((product) => ({
        id: product._id,
        price: product.price,
        seller: product.sellerCompany,
        images: product.images,
        stock: product.stock,
        minOrderQty: product.minOrderQty,
        priceDifference: product.price - originalProduct.price,
      })),

      totalAlternatives: comparedProducts.length,

      priceRange:
        comparedProducts.length > 0
          ? {
              lowest: comparedProducts[0].price,
              highest: comparedProducts[comparedProducts.length - 1].price,
            }
          : null,
    };

    res.status(200).json({
      success: true,
      message: "Product comparison retrieved successfully",
      data: comparisonData,
    });
  } catch (error) {
    console.error("compareProductPrices error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
