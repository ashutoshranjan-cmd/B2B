export default function InquiryDrawer({ open, onClose, inquiry }) {
  if (!open || !inquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Inquiry Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <p><strong>Buyer:</strong> {inquiry.name}</p>
          <p><strong>Email:</strong> {inquiry.email || "N/A"}</p>
          <p><strong>Mobile:</strong> {inquiry.mobile || "N/A"}</p>
          <p><strong>Product:</strong> {inquiry.product?.name}</p>

          <p className="pt-2">
            <strong>Message:</strong>
            <br />
            <span className="text-gray-600">
              {inquiry.message || "No message"}
            </span>
          </p>

          <p className="text-xs text-gray-400 pt-2">
            Received on {new Date(inquiry.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <a
            href={`tel:${inquiry.mobile}`}
            className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Call
          </a>

          <a
            href={`mailto:${inquiry.email}`}
            className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
