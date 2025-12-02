import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import axios from "axios";
import HeaderBookStore from "./Header";
import Footer from "./Footer";

function CategoryPage() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("product")) || [];
    setCartItems(stored);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products/categories");
      setCategories(["All", ...res.data, "Other"]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:3000/api/products/read/product", { category });
      let products = res.data || [];
      if (search.trim()) {
        const key = search.toLowerCase();
        products = products.filter((b) =>
          [b.name, b.category, String(b.price), String(b.status)]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(key))
        );
      }
      setData(products);
    } catch {
      setError("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      await fetchCategories();
      await fetchData();
    };
    loadInitial();
  }, []);

  useEffect(() => {
    const loadFiltered = async () => {
      await fetchData();
    };
    loadFiltered();
  }, [category, search]);

  const handleAddToCart = (item) => {
    if (cartItems.find((p) => p._id === item._id)) return;
    const newCart = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(newCart);
    localStorage.setItem("product", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md animate-pulse p-4 flex flex-col">
      <div className="h-56 w-full bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="flex justify-between mt-auto">
        <div className="h-4 bg-gray-200 w-12 rounded"></div>
        <div className="h-8 bg-gray-200 w-20 rounded-full"></div>
      </div>
    </div>
  );

  return ( <> 

  <HeaderBookStore />
    <div className="px-6 md:px-16 py-10 bg-gray-50 min-h-screen mt-20">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Choose <span className="text-yellow-500">Books</span> You Like 📚
        </h1>
        <p className="text-gray-500 text-sm">
          Discover your next favorite read or find something new that inspires you.
        </p>
      </div>

      {/* Filter section */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-wrap gap-2 justify-center w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                category === (cat === "All" ? "" : cat)
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-gray-100 hover:bg-yellow-100 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:ring-2 ring-yellow-400 outline-none"
          />
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-20">{error}</p>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item) => {
            const inCart = cartItems.some((p) => p._id === item._id);
            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 p-4 flex flex-col"
              >
                <div className="h-56 w-full overflow-hidden rounded-lg mb-4">
                  <img
                    src={`http://localhost:3000/allImg/${item.prImg}`}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <h2 className="font-semibold text-base text-gray-800 line-clamp-2 mb-1">
                  {item.name}
                </h2>
                <p
                  className={`text-xs font-medium mb-2 ${
                    item.status === "available" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.status === "available" ? "Available" : "Out of stock"}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-yellow-600 font-bold text-sm">${item.price}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={inCart || item.status !== "available"}
                    className={`px-3 py-2 text-xs rounded-full flex items-center gap-1 font-medium transition ${
                      inCart
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    <FaShoppingCart className="text-xs" />
                    {inCart ? "In Cart" : "Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500 py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
            alt="No Data"
            className="w-28 mb-4 opacity-70"
          />
          <h2 className="text-lg font-semibold">No Books Found 😕</h2>
          <p className="text-sm text-gray-400">
            Try selecting a different category or search keyword.
          </p>
        </div>
      )}
    </div>

    <Footer />
    </>
  );
  
}

export default CategoryPage;
