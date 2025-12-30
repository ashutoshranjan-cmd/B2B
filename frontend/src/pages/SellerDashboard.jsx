import { useState, useEffect } from "react";
import DashboardHome from "./dashboard/DashboardHome";
import AddProduct from "./dashboard/AddProduct";
import MyProducts from "./dashboard/MyProducts";

export default function SellerDashboard() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [active]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <h2 className="text-xl font-bold text-center py-6 text-blue-600">
          Seller Panel
        </h2>

        <nav className="flex flex-col">
          {[
            { key: "home", label: "Dashboard" },
            { key: "add", label: "Add Product" },
            { key: "products", label: "My Products" }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`px-6 py-3 text-left hover:bg-blue-50 ${
                active === item.key ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8">
        {active === "home" && <DashboardHome onQuickAction={setActive} />}
        {active === "add" && <AddProduct />}
        {active === "products" && <MyProducts />}
      </main>
    </div>
  );
}
