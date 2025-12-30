import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const search = () => {
    if (query.trim())
      navigate(`/search?q=${query}`);
  };

  return (
    <div className="flex bg-white rounded overflow-hidden">
      <input
        className="flex-1 p-3 outline-none text-black"
        placeholder="Search for a product..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={search}
        className="bg-blue-600 px-6 text-white font-semibold hover:bg-blue-800"
      >
        Search
      </button>
    </div>
  );
}
