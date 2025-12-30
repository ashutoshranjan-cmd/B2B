import { useParams } from "react-router-dom";
import { sellers } from "../mocks/sellers";
import { products } from "../mocks/products";
import ProductCard from "../components/ProductCard";

export default function SellerPage() {
  const { slug } = useParams();

  const seller = sellers.find(s => s.sellerSlug === slug);

  if (!seller) {
    return <p className="text-center mt-10">Seller not found</p>;
  }

  const sellerProducts = products.filter(p =>
    seller.products.includes(p._id)
  );

  return (
    <div className="px-6 mt-10 max-w-7xl mx-auto">
      
      <div className="bg-blue-600 text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold">{seller.sellerName}</h1>
        <p className="text-sm">Auto-generated seller website</p>
      </div>

      <h2 className="text-xl font-semibold mb-6">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sellerProducts.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
