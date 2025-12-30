import Company from "../models/seller.model.js";

export const detectSubdomain = async (req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split(".")[0];

  if (subdomain === "www" || subdomain === "yourapp") {
    req.company = null;
    return next();
  }

  const company = await Company.findOne({ subdomain });

  if (!company) {
    return res.status(404).json({ message: "Seller site not found" });
  }

  req.company = company;
  next();
};
