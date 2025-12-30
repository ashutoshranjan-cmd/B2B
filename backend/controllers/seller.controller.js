import Company from '../models/seller.model.js';
import User from '../models/user.model.js';

/**
 * 🏢 CREATE / UPDATE COMPANY (SELLER ONBOARDING)
 * POST /api/v1/company
 */
export const upsertCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    

    const {
      companyName,
      businessType,
      description,
      gstNumber,
      address,
      establishedYear,
      subDomain,
      logo,
    } = req.body;

    if (!companyName || !businessType || !address?.city || !address?.state) {
      return res.status(400).json({
        message: 'Company name, business type and address are required',
      });
    }
      await User.findByIdAndUpdate(userId, {
      role: "seller",
      isSeller: true,
      onboardingCompleted: true,
    });


    const company = await Company.findOneAndUpdate(
      { owner: userId },
      {
        owner: userId,
        companyName,
        businessType,
        description,
        gstNumber,
        address,
        establishedYear,
        subDomain,
        logo,
      },
      {
        new: true,
        upsert: true, // create if not exists
      }
    );

    res.status(200).json({
      message: 'Company details saved successfully',
      company,
    });
  } catch (err) {
    console.error('COMPANY UPSERT ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * 📄 GET LOGGED-IN SELLER COMPANY
 * GET /api/v1/company/me
 */
export const getMyCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId }).populate(
      "owner",
      "name email role"
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // ✅ FIX: wrap company
    res.status(200).json({
      company,
    });
  } catch (err) {
    console.error("GET COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✏️ UPDATE COMPANY DETAILS
 * PUT /api/v1/company/me
 */
export const updateCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOneAndUpdate(
      { owner: userId },
      req.body,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Company updated successfully',
      company,
    });
  } catch (err) {
    console.error('UPDATE COMPANY ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
