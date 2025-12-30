import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { getRandomProducts } from "../services/api";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getRandomProducts();
        setFeaturedProducts(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="relative py-16 mt-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* 🔷 Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Popular products selected for better price comparison
            </p>
          </div>

          <span className="mt-4 md:mt-0 text-sm text-blue-600 font-medium">
            Updated daily
          </span>
        </div>

        {/* ⏳ Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ❌ Empty */}
        {!loading && featuredProducts.length === 0 && (
          <p className="text-center text-gray-500">
            No featured products available
          </p>
        )}

        {/* ✅ Featured Grid */}
        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div
                key={product._id}
                className="
                  relative rounded-xl
                  border border-gray-200
                  hover:border-blue-400
                  hover:shadow-xl
                  transition-all duration-300
                  bg-gradient-to-b from-white to-gray-50
                "
              >
                {/* Featured Tag */}
                <div className="absolute -top-3 z-10 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  FEATURED
                </div>

                {/* Card */}
                <div className="p-2 bg-gray-100">
                  <ProductCard
                    product={{
                      ...product,
                      productName: product.name,
                      image: product.images?.[0]?.url,
                      price: product.price,
                      // productId: product._id,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
