
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGeminiProductDetails } from "../services/gemini.api";
import { Link } from "react-router-dom";

import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Star,
    Share2,
} from "lucide-react";
import { getProductById } from "../services/api";
import EnquiryModal from "../components/EnquiryModal";

export default function ProductDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [openEnquiry, setOpenEnquiry] = useState(false);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    console.log("Product ID:", product)



    /**
     * 🤖 Gemini-enriched data (you will fill later)
     */
    const [aiData, setAiData] = useState({
        highlights: [],
        specifications: {},
        longDescription: "",
    });

    /* ================= FETCH PRODUCT ================= */

    useEffect(() => {
        let isMounted = true; // 👈 prevents memory leaks

        const fetchProduct = async () => {
            try {
                setLoading(true);

                // 1️⃣ Fetch product
                const response = await getProductById(id);
                const productData = response.data.data;

                if (!isMounted) return;

                setProduct(productData);
                setLoading(false);

                // 2️⃣ Fetch Gemini in background
                getGeminiProductDetails({ _id: productData._id })
                    .then((aiRes) => {
                        if (
                            isMounted &&
                            aiRes?.data?.success &&
                            aiRes.data.data
                        ) {
                            setAiData(aiRes.data.data);
                        }
                    })
                    .catch((err) => {
                        if (isMounted) {
                            console.error("Gemini fetch failed", err);
                        }
                    });

            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching product:", error);
                    setProduct(null);
                    setLoading(false);
                }
            }
        };

        fetchProduct();

        // 🧹 Cleanup
        return () => {
            isMounted = false;
        };
    }, [id]);



    /* ================= IMAGE NAV ================= */
    const nextImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    /* ================= SHARE ================= */
    const handleShare = () => {
        if (!product) return;

        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Check out ${product.name}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}

            <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm"
                >
                    <ChevronLeft size={18} />
                    Back
                </button>
                <button onClick={handleShare}>
                    <Share2 size={18} />
                </button>
            </div>
            {/* </div> */}

            <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">
                {/* ================= IMAGES ================= */}
                <div>
                    <div className="bg-white p-4 rounded relative">
                        <img
                            src={product.images?.[currentImageIndex]?.url}
                            alt={product.images?.[currentImageIndex]?.alt || product.name}
                            className="w-full h-96 object-contain"
                        />

                        {product.images?.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 bg-white p-2 rounded"
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 bg-white p-2 rounded"
                                >
                                    <ChevronRight />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-5 gap-2 mt-3">
                        {product.images?.map((img, idx) => (
                            <button
                                key={img._id}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`border rounded p-1 ${idx === currentImageIndex
                                    ? "border-blue-600"
                                    : "border-gray-200"
                                    }`}
                            >
                                <img
                                    src={img.url}
                                    alt={img.alt}
                                    className="h-16 object-contain"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ================= PRODUCT INFO ================= */}
                <div className="bg-white p-6 rounded">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded">
                        {product.category}
                    </span>

                    <h1 className="text-2xl font-bold mt-3">{product.name}</h1>

                    <div className="mt-3 text-3xl font-bold">
                        ₹{product.price.toLocaleString()}
                    </div>

                    <div className="mt-1 text-sm">
                        {product.stock > 0 ? (
                            <span className="text-green-600">
                                In Stock ({product.stock})
                            </span>
                        ) : (
                            <span className="text-red-600">Out of Stock</span>
                        )}
                    </div>

                    {/* 🔮 Gemini Highlights */}
                    {aiData.highlights.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Key Features</h3>
                            <ul className="space-y-1">
                                {aiData.highlights.map((h, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                        <span className="text-green-600">✓</span>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setOpenEnquiry(true)}
                            className="flex-1 bg-blue-600 text-white py-3 rounded"
                        >
                            Send Enquiry
                        </button>
                        <button
                            onClick={() => navigate(`/compare/${product._id}`)}
                            className="flex-1 border border-blue-600 text-blue-600 py-3 rounded"
                        >
                            Compare
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= DESCRIPTION + SPECS ================= */}
            <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded">
                    <h2 className="font-bold mb-3">Description</h2>
                    <p>
                        {aiData.longDescription || product.description}
                    </p>
                </div>

                {Object.keys(aiData.specifications).length > 0 && (
                    <div className="bg-white p-6 rounded">
                        <h2 className="font-bold mb-3">Specifications</h2>
                        {Object.entries(aiData.specifications).map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b py-2">
                                <span>{k}</span>
                                <span>{v}</span>
                            </div>
                        ))}
                    </div>
                )}
                {/* <Link
                    to={`${import.meta.env.VITE_LINK}/store/${product.subDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline mt-2"
                >
                    More products from this seller
                    <ExternalLink size={16} />
                </Link> */}
                <a
                    href={`${import.meta.env.VITE_LINK}/store/${product.subDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline mt-2"
                >
                    More products from this seller
                    <ExternalLink size={16} />
                </a>

            </div>

            {/* Enquiry Modal */}
            <EnquiryModal
                open={openEnquiry}
                onClose={() => setOpenEnquiry(false)}
                productName={product.name}
                productId={product._id}
            />
        </div>
    );
}



