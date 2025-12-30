
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createCompany } from "../services/auth.api";

export default function BecomeSeller() {
  const navigate = useNavigate();
  const { token, user, login,logout } = useAuth();

  const [company, setCompany] = useState({
    companyName: "",
    businessType: "",
    description: "",
    gstNumber: "",
    establishedYear: "",
    subDomain: "",
    address: {
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in company.address) {
      setCompany({
        ...company,
        address: {
          ...company.address,
          [name]: value,
        },
      });
    } else {
      setCompany({
        ...company,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!company.companyName.trim())
      newErrors.companyName = "Company name is required";

    if (!company.businessType.trim())
      newErrors.businessType = "Business type is required";

    if (!company.address.city.trim())
      newErrors.city = "City is required";

    if (!company.address.state.trim())
      newErrors.state = "State is required";

    if (company.establishedYear && !/^\d{4}$/.test(company.establishedYear)) {
      newErrors.establishedYear = "Enter a valid year";
    }

    // Subdomain validation
    if (company.subdomain && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(company.subdomain)) {
      newErrors.subdomain =
        "Subdomain must contain only lowercase letters, numbers, and hyphens (no spaces or dots)";
    }


    setErrors(newErrors); // if (company.website && !/^https?:\/\/.+\..+/.test(company.website)) {
    //   newErrors.website = "Invalid website URL";
    // }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      await createCompany(company);

      login({
        token,
        user: { ...user, role: "seller" },
      });
      logout();
      navigate("/login");

    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to submit company details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 mt-[-6rem]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-1">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Company Details
            </span>
          </h2>
          <p className="text-gray-600 text-sm">Complete your seller profile</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Company Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <input
                name="companyName"
                placeholder="Enter company name"
                className="w-full border-2 border-gray-300 pl-9 pr-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                onChange={handleChange}
              />
            </div>
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Business Type *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                name="businessType"
                placeholder="e.g., Manufacturer, Distributor"
                className="w-full border-2 border-gray-300 pl-9 pr-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                onChange={handleChange}
              />
            </div>
            {errors.businessType && (
              <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Company Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description of your business"
              className="w-full border-2 border-gray-300 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors resize-none"
              rows="3"
              onChange={handleChange}
            />
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              GST Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <input
                name="gstNumber"
                placeholder="GST registration number"
                className="w-full border-2 border-gray-300 pl-9 pr-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Established Year & Website */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Established Year
              </label>
              <input
                name="establishedYear"
                placeholder="YYYY"
                className="w-full border-2 border-gray-300 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                onChange={handleChange}
              />
              {errors.establishedYear && (
                <p className="text-red-500 text-xs mt-1">{errors.establishedYear}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sub Domain
              </label>
              <input
                name="subDomain"
                placeholder="https://..."
                className="w-full border-2 border-gray-300 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                onChange={handleChange}
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website}</p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-3 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Business Address
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    name="city"
                    placeholder="City"
                    className="w-full border-2 border-gray-300 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    onChange={handleChange}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    name="state"
                    placeholder="State"
                    className="w-full border-2 border-gray-300 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    onChange={handleChange}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  name="pincode"
                  placeholder="Enter pincode"
                  className="w-full border-2 border-gray-300 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Submitting...</span>
              </>
            ) : (
              <>
                <span className="text-sm">Submit Company Details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
