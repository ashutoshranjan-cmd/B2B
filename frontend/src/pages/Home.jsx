import SearchBar from "../components/SearchBar";
import HeroCarousel from "../components/HeroCarousel";
import FeaturedProducts from "./FeaturedProducts";

export default function Home() {

  return (
    <div className="px-10">
      
      {/* Hero Section */}
      <section
  className="relative text-center py-24 rounded-lg mt-6 overflow-hidden"
  style={{
    backgroundImage: "url('/hero/h1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content */}
  <div className="relative z-10 text-white px-6">
    <h1 className="text-4xl font-bold mb-4">
      Compare Prices from Multiple Sellers
    </h1>
    <p className="text-lg mb-6 ">
      Search once. Choose the best deal.
    </p>

    <div className="max-w-xl mx-auto ">
      <SearchBar />
    </div>
  </div>
</section>


          <HeroCarousel/>

      {/* Categories */}
  
    <section className="mt-15 mb-10">
      <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {[
      { name: "Mobiles", img: "/categories/phone.webp" },
      { name: "Laptops", img: "/categories/laptop.webp" },
      { name: "Electronics", img: "/categories/electronic.webp" },
      { name: "Fashion", img: "/categories/fashion.webp" },
    ].map(cat => (
      <div
        key={cat.name}
        className=" p-1 rounded-lg text-center hover:shadow-2xl hover:bg-white cursor-pointer"
      >
        {/* Image */}
        <img
          src={cat.img}
          alt={cat.name}
          className="w-20 h-20 mx-auto mb-1 object-contain"
        />

        {/* Title */}
        <h3 className="font-medium">{cat.name}</h3>
      </div>
    ))}
  </div>
</section>

      <FeaturedProducts />

  
    </div>
  );
}


