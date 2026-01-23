import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import axios from "axios";
import HeaderBookStore from "./Header";
import Footer from "./Footer";
import { toast } from "react-toastify";

function CategoryPage() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([{ _id: "all", name: "All" }]);
  const [category, setCategory] = useState("all"); // store _id
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  /* Load Cart */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("product")) || [];
    setCartItems(stored);
  }, []);

  /* Fetch Categories */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/products/categories/read"
      );
      // Add "All" at the beginning
      setCategories([{ _id: "all", name: "All" }, ...res.data]);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  /* Fetch Products */
  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        "http://localhost:3000/api/products/read",
        {
          params: category !== "all" ? { category } : {}
        }
      );

      let products = res.data || [];

      if (search.trim()) {
        const key = search.toLowerCase();
        products = products.filter((b) =>
          [b.name, b.category, String(b.price), b.status]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(key))
        );
      }

      setData(products);
    } catch {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  /* Initial Load */
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [category, search]);

  const fixImg = (img) =>
    img ? `http://localhost:3000/uploads/${img}` : "/no-image.png";

  const handleAddToCart = (item) => {
    if (cartItems.some((p) => p._id === item._id)) {
      toast.info("Already in cart");
      return;
    }

    if (item.status !== "available") {
      toast.error("Out of stock");
      return;
    }

    const newCart = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(newCart);
    localStorage.setItem("product", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
    toast.success("Added to cart");
  };

  return (
    <>
      <HeaderBookStore />

      <div className="px-6 md:px-16 py-10 bg-gray-50 min-h-screen mt-20">
        <h1 className="text-3xl font-bold text-center mb-6">
          Choose <span className="text-yellow-500">Books</span>
        </h1>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 py-2 border rounded-full"
            />
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : data.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {data.map((item) => {
              const inCart = cartItems.some((p) => p._id === item._id);

              return (
                <div key={item._id} className="bg-white p-4 rounded-xl shadow">
                  <img
                    src={fixImg(item.prImg)}
                    alt={item.name}
                    className="h-48 w-full object-cover rounded"
                  />
                  <h2 className="mt-2 font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="font-bold text-yellow-600">${item.price}</p>

                  <button
                    disabled={inCart || item.status !== "available"}
                    onClick={() => handleAddToCart(item)}
                    className={`mt-2 w-full py-2 rounded-full text-sm ${
                      inCart ? "bg-gray-300" : "bg-yellow-500 text-white"
                    }`}
                  >
                    <FaShoppingCart className="inline mr-1" />
                    {inCart ? "In Cart" : "Add to Cart"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center">No Books Found</p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default CategoryPage;
