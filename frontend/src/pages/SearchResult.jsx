import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../mocks/products";

export default function SearchResult() {
  const [params] = useSearchParams();
  const query = params.get("q")?.toLowerCase();

  const filtered = products.filter(p =>
    p.productName.toLowerCase().includes(query)
  );

  return (
    <div className="px-6 mt-10">
      <h2 className="text-2xl font-semibold mb-6">
        Search results for "{query}"
      </h2>

      {filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
