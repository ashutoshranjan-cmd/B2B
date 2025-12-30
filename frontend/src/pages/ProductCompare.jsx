import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PriceTable from "../components/PriceTable";
import { comparedProductsPrice } from "../services/api";
import { HiOutlineCube, HiOutlineLocationMarker } from "react-icons/hi";
import { FaBoxes } from "react-icons/fa";


export default function ProductCompare() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGallery, setShowGallery] = useState(false);


  useEffect(() => {
    let mounted = true;

    const fetchComparison = async () => {
      try {
        const res = await comparedProductsPrice(id);
        if (mounted) setData(res.data.data);
      } catch (err) {
        if (mounted) setError("Failed to load comparison data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchComparison();
    return () => (mounted = false);
  }, [id]);

  /* ===================== STATES ===================== */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 mt-10 animate-pulse">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="h-64 bg-gray-200 rounded" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-600 font-medium">
        {error}
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-center mt-20 text-gray-500">
        No comparison data available.
      </p>
    );
  }

  console.log("Comparison Data:", data);

  const {
    originalProduct,
    alternatives,
    totalAlternatives,
    priceRange,
  } = data;

  /* ===================== UI ===================== */

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* ================= PRODUCT CARD ================= */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* IMAGE */}

          <div
            className="flex justify-center items-center bg-gray-50 rounded-xl p-6 cursor-pointer group"
            onClick={() => setShowGallery(true)}
          >
            <img
              src={originalProduct.images?.[0]?.url || "/placeholder.png"}
              alt={originalProduct.name}
              className="w-64 h-64 object-contain mix-blend-multiply transition-transform group-hover:scale-105"
            />
          </div>
          
          {showGallery && (
            <div
              className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
              onClick={() => setShowGallery(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-4xl w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* CLOSE */}
                <button
                  className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
                  onClick={() => setShowGallery(false)}
                >
                  ✕
                </button>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Images
                </h3>

                {/* IMAGES GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {originalProduct.images?.map((img, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 flex justify-center items-center"
                    >
                      <img
                        src={img.url}
                        alt={`${originalProduct.name} ${index + 1}`}
                        className="w-full h-40 object-contain mix-blend-multiply hover:scale-105 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



          {/* DETAILS */}
          <div className="md:col-span-2 flex flex-col justify-between gap-8">

            {/* TOP INFO */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {originalProduct.name}
              </h1>

              <p className="text-sm text-gray-500">
                Category ·{" "}
                <span className="font-medium text-gray-700">
                  {originalProduct.category}
                </span>
              </p>

              {/* PRICE */}
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-green-600">
                  ₹{originalProduct.price}
                </p>

                <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Best Price
                </span>
              </div>

              {/* SELLER */}
              <p className="text-gray-600">
                Sold by{" "}
                <span className="font-semibold text-gray-900">
                  {originalProduct.seller.companyName}
                </span>
              </p>

              {/* META */}
              <div className="flex flex-wrap gap-8 text-sm text-gray-600 pt-2">

                <div className="flex items-center gap-2">
                  <HiOutlineCube className="text-xl text-blue-500" />
                  <span>
                    Stock: <strong>{originalProduct.stock}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaBoxes className="text-xl text-purple-500" />
                  <span>
                    MOQ: <strong>{originalProduct.minOrderQty}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <HiOutlineLocationMarker className="text-xl text-red-500" />
                  <span>
                    {originalProduct.seller.address?.city || "Location not available"}
                  </span>
                </div>

              </div>
            </div>

            {/* HIGHLIGHTS */}
            {originalProduct.highlights?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Highlights
                </h3>

                <div className="flex flex-wrap gap-2">
                  {originalProduct.highlights.map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            {originalProduct.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  Product Description
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {originalProduct.description}
                </p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white px-8 py-3 rounded-xl font-semibold shadow-md">
                Contact Seller
              </button>

              <button className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition px-8 py-3 rounded-xl font-semibold text-gray-800">
                Add to Inquiry
              </button>
            </div>

          </div>
        </div>
      </div>



      {/* ================= PRICE SUMMARY ================= */}
      {priceRange?.lowest !== undefined && priceRange?.highest !== undefined && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{totalAlternatives}</span> sellers found
            offering this product.
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Price Range:{" "}
            <span className="font-semibold text-green-700">
              ₹{priceRange.lowest} – ₹{priceRange.highest}
            </span>
          </p>
        </div>
      )}

      {/* ================= COMPARISON TABLE ================= */}
      {totalAlternatives > 0 ? (
        <PriceTable
          sellers={alternatives}
          originalPrice={originalProduct.price}
          priceRange={priceRange}
        />
      ) : (
        <p className="text-center text-gray-500">
          No other sellers found for this product.
        </p>
      )}
    </div>
  );
}
