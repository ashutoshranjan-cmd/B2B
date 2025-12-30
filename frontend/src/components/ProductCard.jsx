
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import EnquiryModal from "./EnquiryModal";
import { AuthContext } from "../context/AuthContext";
import {
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding
} from "react-icons/hi";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const { user } = useContext(AuthContext);

  console.log("ProductID in ProductCard:", product.Id);
  const buyerId = user?.id || null;

  const handleEnquiryClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setOpenEnquiry(true);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/compare/${product._id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <>
      {/* CARD */}
      <div
        // onClick={handleCardClick}
        className="
          bg-white rounded-2xl border border-gray-200
          shadow-sm hover:shadow-md
          transition-all duration-300
          flex flex-col overflow-hidden
        "
        onClick={handleCardClick}
      >
        <div className="" onClick={handleCardClick}>
          {/* IMAGE */}
          <div className="relative h-40 bg-gray-50 flex items-center justify-center">
            <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.productName}
              className="
              max-h-full max-w-full object-contain
              transition-transform duration-300
              group-hover:scale-105
            "
            />
          </div>

          {/* CONTENT */}
          <div className="p-4 flex flex-col flex-1">
            {/* PRODUCT NAME */}
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {product.productName}
            </h3>

            {/* DESCRIPTION */}
            {product.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* RATING */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-600 text-white text-[11px] px-2 py-0.5 rounded">
                  {product.rating} ★
                </span>
                <span className="text-xs text-gray-500">
                  ({product.reviews || 0})
                </span>
              </div>
            )}

            {/* SELLER + LOCATION */}
            <div className="text-xs text-gray-500 space-y-1 mb-3">
              {product.seller && (
                <div className="flex items-center gap-1">
                  <HiOutlineOfficeBuilding className="text-gray-400" />
                  <span className="truncate">{product.seller}</span>
                </div>
              )}
              {product.location?.city && (
                <div className="flex items-center gap-1">
                  <HiOutlineLocationMarker className="text-gray-400" />
                  <span>{product.location.city}</span>
                </div>
              )}
            </div>

            {/* PRICE */}
            {product.price && (
              <div className="mt-auto mb-3">
                <p className="text-sm font-semibold text-gray-900">
                  ₹{product.price}
                  {product.moq && (
                    <span className="text-xs text-gray-500 font-normal">
                      {" "} / MOQ {product.moq}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* ACTIONS */}
        <div className=" border-t-gray-100 bg-gray-100 p-3 flex gap-2">
          <button
            onClick={() => setOpenEnquiry(true)}
            className="
              flex-1 border border-blue-600 text-blue-600
              py-2 rounded-md text-sm font-medium
              hover:bg-blue-50 transition
            "
          >
            Enquiry
          </button>

          <button
            onClick={() => navigate(`/compare/${product._id}`)}
            className="
              flex-1 bg-blue-600 text-white
              py-2 rounded-md text-sm font-medium
              hover:bg-blue-700 transition
            "
          >
            Compare
          </button>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
        productId={product._id}
        buyerId={buyerId}
      />
    </>
  );
}

