import Product from "../models/product.model.js";
import Company from "../models/seller.model.js";

/**
 * GET DASHBOARD SUMMARY FOR SELLER
 * GET /api/v1/seller/dashboard/summary
 */
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get seller's company
    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Company not found. Complete company onboarding first.",
      });
    }

    // Get all products for this seller
    const products = await Product.find({ sellerCompany: company._id });

    // Calculate comprehensive statistics
    const stats = {
      // Product Statistics
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      inactiveProducts: products.filter(p => !p.isActive).length,
      inStockProducts: products.filter(p => p.stock > 0).length,
      outOfStockProducts: products.filter(p => p.stock === 0).length,

      // Financial Statistics
      totalInventoryValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      averageProductPrice: products.length > 0
        ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
        : 0,

      // Category Statistics
      categoriesCount: new Set(products.map(p => p.category)).size,
      categoryBreakdown: products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {}),

      // Revenue Statistics (placeholder - would need orders/sales data)
      monthlyRevenue: 0, // TODO: Implement when orders are added
      totalRevenue: 0, // TODO: Implement when orders are added

      // Inquiry Statistics (placeholder - would need inquiry model)
      totalInquiries: 0, // TODO: Implement when inquiries are added
      pendingInquiries: 0, // TODO: Implement when inquiries are added

      // Analytics (placeholder - would need analytics tracking)
      viewsToday: 0, // TODO: Implement when analytics are added
      viewsThisMonth: 0, // TODO: Implement when analytics are added

      // Recent Activity
      recentProducts: products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(p => ({
          id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        })),

      // Top Performing Products (by stock value)
      topProducts: products
        .map(p => ({
          id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          value: p.price * p.stock,
          isActive: p.isActive
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
    };

    res.json({
      success: true,
      data: stats,
      message: "Dashboard summary retrieved successfully"
    });

  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard summary",
    });
  }
};

/**
 * GET DASHBOARD ANALYTICS
 * GET /api/v1/seller/dashboard/analytics
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query; // 7d, 30d, 90d

    // Get seller's company
    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Company not found. Complete company onboarding first.",
      });
    }

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get products created in the period
    const productsInPeriod = await Product.find({
      sellerCompany: company._id,
      createdAt: { $gte: startDate }
    });

    // Analytics data (placeholder structure for future implementation)
    const analytics = {
      period,
      startDate,
      endDate: now,

      // Product creation trends
      productsCreated: productsInPeriod.length,
      productsByDay: [], // TODO: Implement daily breakdown

      // Revenue trends (placeholder)
      revenueByDay: [], // TODO: Implement when orders exist
      totalRevenue: 0,

      // Category performance
      categoryPerformance: productsInPeriod.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            count: 0,
            totalValue: 0
          };
        }
        acc[product.category].count += 1;
        acc[product.category].totalValue += product.price * product.stock;
        return acc;
      }, {}),

      // Stock levels over time (placeholder)
      stockTrends: [], // TODO: Implement stock tracking

      // Top categories
      topCategories: Object.entries(
        productsInPeriod.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {})
      )
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))
    };

    res.json({
      success: true,
      data: analytics,
      message: "Dashboard analytics retrieved successfully"
    });

  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard analytics",
    });
  }
};

/**
 * GET DASHBOARD RECENT ACTIVITY
 * GET /api/v1/seller/dashboard/activity
 */
export const getDashboardActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    // Get seller's company
    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Company not found. Complete company onboarding first.",
      });
    }

    // Get recent products
    const recentProducts = await Product.find({ sellerCompany: company._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('name category price stock isActive createdAt updatedAt');

    // Format activity feed
    const activities = recentProducts.map(product => ({
      id: product._id,
      type: 'product_created',
      message: `New product "${product.name}" was added`,
      timestamp: product.createdAt,
      data: {
        productId: product._id,
        productName: product.name,
        category: product.category,
        price: product.price
      }
    }));

    // Add any recent updates (products modified in last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentlyUpdated = await Product.find({
      sellerCompany: company._id,
      updatedAt: { $gte: yesterday },
      createdAt: { $lt: yesterday } // Exclude newly created products
    })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select('name updatedAt');

    recentlyUpdated.forEach(product => {
      activities.push({
        id: `update_${product._id}`,
        type: 'product_updated',
        message: `Product "${product.name}" was updated`,
        timestamp: product.updatedAt,
        data: {
          productId: product._id,
          productName: product.name
        }
      });
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: activities.slice(0, parseInt(limit)),
      message: "Dashboard activity retrieved successfully"
    });

  } catch (error) {
    console.error("Dashboard activity error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard activity",
    });
  }
};