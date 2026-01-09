import React, { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function BookCard() {
  const cartIconRef = useRef(null);

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [flyItem, setFlyItem] = useState(null);

  /* ================= IMAGE FIX ================= */
  const fixImg = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:3000/uploads/${img}`;
  };

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("product")) || [];
    setCartItems(savedCart);
  }, []);

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/products/categories/read"
      );
      setCategories(["All", ...res.data]);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const q = category ? `?category=${category}` : "";
      const res = await axios.get(
        `http://localhost:3000/api/products/read${q}`
      );

      let products = res.data || [];

      if (search.trim()) {
        const key = search.toLowerCase();
        products = products.filter((p) =>
          p.name.toLowerCase().includes(key)
        );
      }

      setData(products);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  /* ================= RELOAD ON FILTER ================= */
  useEffect(() => {
    fetchData();
  }, [category, search]);

  /* ================= ADD TO CART (NO LOGIN) ================= */
  const handleAddToCart = (item, e) => {
    if (cartItems.find((c) => c._id === item._id)) {
      toast.info("Already in cart");
      return;
    }

    if (item.status !== "available") {
      toast.error("Out of stock");
      return;
    }

    const updatedCart = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCart);
    localStorage.setItem("product", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    /* ===== Fly to cart animation ===== */
    const rectBtn = e.currentTarget.getBoundingClientRect();
    const rectCart = cartIconRef.current?.getBoundingClientRect() || {
      left: window.innerWidth - 60,
      top: 20,
    };

    setFlyItem({
      x: rectBtn.left,
      y: rectBtn.top,
      targetX: rectCart.left,
      targetY: rectCart.top,
      img: fixImg(item.prImg),
      id: item._id,
    });

    setTimeout(() => setFlyItem(null), 800);
    toast.success("Added to cart");
  };

  return (
    <div className="px-6 md:px-16 py-10 bg-gray-50 min-h-screen mt-20 relative">
      {/* Fly animation */}
      <AnimatePresence>
        {flyItem && (
          <motion.img
            src={flyItem.img}
            initial={{ x: flyItem.x, y: flyItem.y, scale: 1 }}
            animate={{
              x: flyItem.targetX,
              y: flyItem.targetY,
              scale: 0.2,
            }}
            transition={{ duration: 0.8 }}
            className="fixed w-16 h-20 rounded-lg z-50"
          />
        )}
      </AnimatePresence>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === "All" ? "" : c)}
            className={`px-4 py-2 rounded-full ${
              category === c ? "bg-yellow-500 text-white" : "bg-gray-100"
            }`}
          >
            {c}
          </button>
        ))}

        <div className="relative ml-auto">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="pl-10 pr-3 py-2 rounded-full border"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* PRODUCTS */}
      {!loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item) => {
            const inCart = cartItems.find((c) => c._id === item._id);

            return (
              <div
                key={item._id}
                className="bg-white shadow rounded-xl p-4 hover:-translate-y-1 transition"
              >
                <img
                  src={fixImg(item.prImg)}
                  alt={item.name}
                  onError={(e) => (e.target.src = "/no-image.png")}
                  className="h-52 w-full object-cover rounded-lg"
                />

                <h2 className="font-semibold mt-2">{item.name}</h2>

                <p
                  className={`text-sm ${
                    item.status === "available"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-yellow-600 font-bold">
                    ${item.price}
                  </span>

                  <button
                    disabled={inCart}
                    onClick={(e) => handleAddToCart(item, e)}
                    className={`px-5 py-3 text-sm rounded-full ${
                      inCart
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {inCart ? "In Cart" : "Add To Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center py-20">Loading...</p>
      )}
    </div>
  );
}

export default BookCard;
