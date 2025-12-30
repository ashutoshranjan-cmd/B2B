import { Link } from "react-router-dom";

export default function PriceTable({ sellers, originalPrice }) {
  if (!sellers || sellers.length === 0) return null;

  const lowestPrice = Math.min(...sellers.map((s) => s.price));

  return (
    <div className="space-y-4">
      {/* ================= MOBILE VIEW (CARDS) ================= */}
      <div className="grid gap-4 md:hidden">
        {sellers.map((item) => {
          const isLowest = item.price === lowestPrice;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 shadow-sm ${
                isLowest ? "border-green-400 bg-green-50" : "bg-white"
              }`}
            >
              {/* Seller */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.seller.companyName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {item.seller.businessType}
                  </p>

                  {item.seller.isVerified && (
                    <span className="inline-block mt-1 text-xs font-semibold text-green-600">
                      ✔ Verified Seller
                    </span>
                  )}
                </div>

                {isLowest && (
                  <span className="text-xs font-semibold text-green-700">
                    Lowest Price
                  </span>
                )}
              </div>

              {/* Location */}
              <p className="mt-2 text-sm text-gray-600">
                 {item.seller.address?.city},{" "}
                {item.seller.address?.state}
              </p>

              {/* Price */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{item.price}
                  </p>

                  {item.priceDifference === 0 && (
                    <p className="text-xs text-gray-500">
                      Same as original
                    </p>
                  )}

                  {item.priceDifference > 0 && (
                    <p className="text-xs text-red-600">
                      ₹{item.priceDifference} higher
                    </p>
                  )}
                </div>

                <div className="text-right text-sm">
                  <p>MOQ: <span className="font-medium">{item.minOrderQty}</span></p>
                  <p
                    className={`font-medium ${
                      item.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>

              {/* Action */}
              <Link
                to={`/seller/${item.seller._id}`}
                className="mt-4 block w-full text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                View Store
              </Link>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP VIEW (TABLE) ================= */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-500 text-white vert">
            <tr>
              <th className="p-4 text-left">Seller</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">MOQ</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((item) => {
              const isLowest = item.price === lowestPrice;

              return (
                <tr
                  key={item.id}
                  className={`border-t transition ${
                    isLowest ? "bg-green-50" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  {/* Seller */}
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {item.seller.companyName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.seller.businessType}
                    </div>

                    {item.seller.isVerified && (
                      <span className="inline-block mt-1 text-xs font-semibold text-green-600">
                        ✔ Verified Seller
                      </span>
                    )}
                  </td>

                  {/* Location */}
                  <td className="p-4 text-gray-600">
                    {item.seller.address?.city},{" "}
                    {item.seller.address?.state}
                  </td>

                  {/* Price */}
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">
                      ₹{item.price}
                    </div>

                    {item.priceDifference === 0 && (
                      <div className="text-xs text-gray-500">
                        Same as original
                      </div>
                    )}

                    {item.priceDifference > 0 && (
                      <div className="text-xs text-red-600">
                        ₹{item.priceDifference} higher
                      </div>
                    )}

                    {isLowest && (
                      <div className="text-xs font-semibold text-green-600">
                        Lowest Price
                      </div>
                    )}
                  </td>

                  {/* MOQ */}
                  <td className="p-4">{item.minOrderQty}</td>

                  {/* Stock */}
                  <td className="p-4">
                    <span
                      className={`font-medium ${
                        item.stock > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-4">
                    <Link
                      to={`/seller/${item.seller._id}`}
                      className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      View Store
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
