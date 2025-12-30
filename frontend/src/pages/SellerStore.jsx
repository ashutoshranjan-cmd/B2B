
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, MapPin, Package, Filter, ChevronDown, Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { getStoreProducts } from "../services/auth.api";
import { useParams } from "react-router-dom";

export default function SellerStore() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const productsPerPage = 12;
  const { subdomain } = useParams();

  if (!token) {
    navigate('/login');
  }
  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const storeIndex = pathSegments.indexOf('store');
    if (storeIndex !== -1 && pathSegments[storeIndex + 1]) {
      const name = pathSegments[storeIndex + 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCompanyName(name);
    }
  }, []);

  useEffect(() => {
    if (!subdomain) return;

    const fetchProducts = async () => {
      try {
        const res = await getStoreProducts(subdomain);
        // console.log("Fetched products:", res.data);
        if (Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (res.data.data) {
          setProducts([res.data.data]);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % Math.min(5, products.length));
    }, 4000);
    return () => clearInterval(timer);
  }, [products.length]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setQuantity(product.minOrderQty || 1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleQuantityChange = (newQty) => {
    const minQty = selectedProduct?.minOrderQty || 1;
    if (newQty >= minQty && newQty <= selectedProduct?.stock) {
      setQuantity(newQty);
    }
  };

  const handleOrder = () => {
    alert(`Order placed for ${quantity} units of ${selectedProduct?.name}`);
    closeModal();
  };

  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesStock = stockFilter === "all" ||
      (stockFilter === "instock" && p.stock > 0) ||
      (stockFilter === "outofstock" && p.stock === 0);
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const topProducts = products.slice(0, 5);

  const reviews = [
    { name: "Shivam Mandal", rating: 5, text: "Excellent quality products and fast delivery. Highly recommended!", location: "Mumbai" },
    { name: "Rupendra Kumar", rating: 5, text: "Great service and very professional. Will definitely order again.", location: "Delhi" },
    { name: "Ashutosh Ranjan", rating: 4, text: "Good products at competitive prices. Customer support is helpful.", location: "Ahmedabad" },
    { name: "Sneha Reddy", rating: 5, text: "Outstanding experience! Products exactly as described.", location: "Bangalore" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {companyName || "Store"}
              </h1>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button className="hidden md:flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl cursor-pointer">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">Cart</span>
              <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                0
              </span>
            </button>

            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      {topProducts.length > 0 && (
        <div className="relative bg-gradient-to-r from-blue-600 to-black overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="relative">
              <h2 className="text-4xl font-bold text-white text-center mb-8">Featured Products</h2>

              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                {topProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ${idx === carouselIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                      }`}
                  >
                    <div className="grid md:grid-cols-2 gap-8 h-full bg-white p-8 rounded-2xl">
                      <div className="flex items-center justify-center">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="max-h-80 w-auto object-contain rounded-xl shadow-lg"
                          />
                        ) : (
                          <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center">
                            <Package className="w-24 h-24 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold w-fit">
                          {product.category || "Featured"}
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900">{product.name}</h3>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-gray-600">(4.8)</span>
                        </div>
                        <p className="text-gray-600 line-clamp-3">{product.description}</p>
                        <div className="flex items-baseline space-x-3">
                          <span className="text-4xl font-bold text-blue-600">
                            ₹{product.price?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xl text-gray-400 line-through">
                            ₹{(product.price * 1.3)?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          onClick={() => openProductModal(product)}
                          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl font-semibold text-lg w-fit"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* <button
                onClick={() => setCarouselIndex((prev) => (prev - 1 + topProducts.length) % topProducts.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => setCarouselIndex((prev) => (prev + 1) % topProducts.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button> */}

              <div className="flex justify-center space-x-2 mt-6">
                {topProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${idx === carouselIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-sm text-gray-600">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-900">{companyName || "Store"}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <span>Filters</span>
              </h3>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="capitalize text-gray-700 group-hover:text-blue-600 transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Price Range</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      value="all"
                      checked={stockFilter === "all"}
                      onChange={() => setStockFilter("all")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">All Products</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      value="instock"
                      checked={stockFilter === "instock"}
                      onChange={() => setStockFilter("instock")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">In Stock</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      value="outofstock"
                      checked={stockFilter === "outofstock"}
                      onChange={() => setStockFilter("outofstock")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Out of Stock</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="h-full overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Category</h4>
                      <div className="space-y-2">
                        {categories.map(cat => (
                          <label key={cat} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="category-mobile"
                              value={cat}
                              checked={selectedCategory === cat}
                              onChange={() => setSelectedCategory(cat)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="capitalize text-gray-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Price Range</h4>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Availability</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="stock-mobile"
                            value="all"
                            checked={stockFilter === "all"}
                            onChange={() => setStockFilter("all")}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">All Products</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="stock-mobile"
                            value="instock"
                            checked={stockFilter === "instock"}
                            onChange={() => setStockFilter("instock")}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">In Stock</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="stock-mobile"
                            value="outofstock"
                            checked={stockFilter === "outofstock"}
                            onChange={() => setStockFilter("outofstock")}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">Out of Stock</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm px-4 py-2 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  {filteredProducts.length} Products
                </h2>
                <span className="text-xs text-gray-500">
                  Page {currentPage} / {totalPages || 1}
                </span>
              </div>

              <button
                className="lg:hidden flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition-all"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>


            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange([0, 100000]);
                    setStockFilter("all");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => openProductModal(p)}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-300 transform hover:-translate-y-1"
                    >
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        {p.images && p.images.length > 0 && p.images[0] ? (
                          <img
                            src={p.images[0]?.url}
                            alt={p.name}
                            className="w-auto h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-20 h-20 text-gray-300" />
                          </div>
                        )}

                        {p.stock > 0 ? (
                          <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                            In Stock
                          </span>
                        ) : (
                          <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        {p.category && (
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                            {p.category}
                          </span>
                        )}

                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </h3>

                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">(4.2)</span>
                        </div>

                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{p.price?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{(p.price * 1.3)?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            23% off
                          </span>
                        </div>

                        {p.minOrderQty > 1 && (
                          <p className="text-sm text-gray-600">
                            MOQ: <span className="font-semibold">{p.minOrderQty} units</span>
                          </p>
                        )}

                        {p.location?.city && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{p.location.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'border-2 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="text-gray-400">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">What Our Customers Say</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <div className="flex space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{review.text}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{review.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center p-6 bg-gray-900 rounded-xl text-white">
            <div className="text-5xl font-bold mb-2">4.7</div>
            <div className="flex justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-6 h-6 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
            <p className="text-lg">Based on 1,247 reviews</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {companyName || "Store"}
              </h3>
              <p className="text-gray-400">
                Your trusted partner for quality products and excellent service.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Track Order</li>
                <li className="hover:text-white cursor-pointer transition-colors">Returns</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Press</li>
                <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Shipping Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Refund Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 {companyName || "Store"}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-6">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                  {selectedProduct.images && selectedProduct.images.length > 0 && selectedProduct.images[selectedImageIndex] ? (
                    <img
                      src={selectedProduct.images[selectedImageIndex]?.url}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-32 h-32 text-gray-300" />
                    </div>
                  )}
                </div>

                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedProduct.images.slice(0, 4).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-blue-600 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300'
                          }`}
                      >
                        <img
                          src={img?.url}
                          alt={`${selectedProduct.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  {selectedProduct.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {selectedProduct.category}
                    </span>
                  )}
                  {selectedProduct.stock > 0 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center space-x-1">
                      <span>✓</span>
                      <span>In Stock ({selectedProduct.stock} units)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h2>

                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">(4.2 rating)</span>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{selectedProduct.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{(selectedProduct.price * 1.3)?.toLocaleString('en-IN')}
                    </span>
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                      23% off
                    </span>
                  </div>
                  {selectedProduct.minOrderQty && selectedProduct.minOrderQty > 1 && (
                    <p className="mt-2 text-gray-600">
                      Minimum Order: <span className="font-semibold">{selectedProduct.minOrderQty} units</span>
                    </p>
                  )}
                </div>

                {selectedProduct.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About this product</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                )}

                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.location && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedProduct.location.city}, {selectedProduct.location.state}
                      </p>
                      <p className="text-gray-600 text-sm">{selectedProduct.location.country}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Select Quantity</h4>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= (selectedProduct.minOrderQty || 1)}
                      className="w-12 h-12 rounded-xl border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || (selectedProduct.minOrderQty || 1))}
                      min={selectedProduct.minOrderQty || 1}
                      max={selectedProduct.stock}
                      className="w-24 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= selectedProduct.stock}
                      className="w-12 h-12 rounded-xl border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Total Amount</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={selectedProduct.stock === 0}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-gray-900 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {selectedProduct.stock === 0 ? 'Out of Stock' : 'Contact Seller'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}