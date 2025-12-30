import { useEffect, useState } from "react";
import API from "../../services/api";
import InquiryDrawer from "../../pages/dashboard/InquiryDrawer";

export default function RecentInquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await API.get("/inquiries/seller", {
          params: { search, status },
        });
        setEnquiries(res.data.data || []);
      } catch (err) {
        console.error("Failed to load inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [search, status]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold">Buyer Inquiries</h3>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search buyer / product"
            className="border rounded-lg px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 py-10">
          Loading inquiries...
        </p>
      )}

      {/* Scrollable Table */}
      {!loading && enquiries.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left">Buyer</th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {enquiries.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {item.name}
                    </td>

                    <td className="p-3 text-gray-600">
                      {item.product?.name || "-"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full capitalize ${
                          item.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : item.status === "contacted"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedInquiry(item);
                          setOpenDrawer(true);
                        }}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && enquiries.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No inquiries found
        </p>
      )}

      {/* Drawer */}
      <InquiryDrawer
        open={openDrawer}
        inquiry={selectedInquiry}
        onClose={() => setOpenDrawer(false)}
      />
    </div>
  );
}
