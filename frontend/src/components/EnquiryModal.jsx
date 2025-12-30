import { useState } from "react";
import { submitInquiry } from "../services/api";
import { X } from "lucide-react";

export default function EnquiryModal({ open, onClose, productId }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const validateMobile = (v) => /^[6-9]\d{9}$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      mobile,
      message: form.message.value.trim(),
      productId,

    };
      console.log("payload:", payload);

    if (!validateMobile(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await submitInquiry(payload);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Product Enquiry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          <input
            name="name"
            required
            placeholder="Your Name"
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, ""))
            }
            maxLength={10}
            placeholder="Mobile Number"
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="message"
            rows="3"
            placeholder="Requirement details (optional)"
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button
            disabled={loading || !validateMobile(mobile)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2.5 rounded-lg font-medium transition"
          >
            {loading ? "Sending..." : "Send Enquiry"}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 border-t text-xs text-gray-500 text-center">
          Your details are safe. Seller will contact you shortly.
        </div>
      </div>
    </div>
  );
}
