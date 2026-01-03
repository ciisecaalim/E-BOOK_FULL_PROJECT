import React, { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function BookCard() {
  const navigate = useNavigate();
  const cartIconRef = useRef(null);

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [flyItem, setFlyItem] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // --- FIX IMAGE PATH ---
  const fixImg = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:3000/uploads/${img}`;
  };

  // --- LOAD CART AND PENDING ITEMS ---
  useEffect(() => {
    let savedCart = JSON.parse(localStorage.getItem("product"));
    let pendingItem = JSON.parse(localStorage.getItem("pendingItem"));

    // Ensure they are arrays
    if (!Array.isArray(savedCart)) savedCart = [];
    if (!Array.isArray(pendingItem)) pendingItem = [];

    let initialCart = [...savedCart];

    const customer = JSON.parse(localStorage.getItem("customer"));
    if (customer && pendingItem.length > 0) {
      pendingItem.forEach((item) => {
        if (!initialCart.find((c) => c._id === item._id)) {
          initialCart.push({ ...item, quantity: item.quantity || 1 });
        }
      });
      localStorage.removeItem("pendingItem");
    }

    setCartItems(initialCart);
    setCartCount(initialCart.length);
    localStorage.setItem("product", JSON.stringify(initialCart));
  }, []);

  // --- FETCH CATEGORIES ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products/categories/read");
      setCategories(["All", ...res.data.map((c) => c.name)]);
    } catch (error) {
      console.error("Category error", error);
      toast.error("Failed to load categories");
    }
  };

  // --- FETCH PRODUCTS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const q = category ? `?category=${category}` : "";
      const res = await axios.get(`http://localhost:3000/api/products/read${q}`);
      let products = res.data;

      if (search.trim()) {
        const key = search.toLowerCase();
        products = products.filter((item) =>
          item.name.toLowerCase().includes(key)
        );
      }

      setData(products);
    } catch (error) {
      console.error("Product error", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  // --- REFETCH WHEN CATEGORY OR SEARCH ---
  useEffect(() => {
    fetchData();
  }, [category, search]);

  // --- ADD TO CART ---
  const handleAddToCart = (item, e) => {
    const customer = JSON.parse(localStorage.getItem("customer"));

    // Not logged in -> save pending
    if (!customer) {
      let pending = JSON.parse(localStorage.getItem("pendingItem")) || [];
      if (!pending.find((p) => p._id === item._id)) {
        pending.push({ ...item, quantity: 1 });
        localStorage.setItem("pendingItem", JSON.stringify(pending));
      }
      toast.info("Please login first to add this item to your cart");
      navigate("/CustomerLogin");
      return;
    }

    if (cartItems.find((c) => c._id === item._id)) {
      toast.error("🚫 Already in cart");
      return;
    }

    const updatedCart = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCart);
    localStorage.setItem("product", JSON.stringify(updatedCart));

    // Trigger header/cart refresh
    window.dispatchEvent(new Event("cartUpdated"));
    setCartCount(updatedCart.length);

    // --- FLY TO CART ANIMATION ---
    const rectButton = e.currentTarget.getBoundingClientRect();
    const rectCart = cartIconRef.current?.getBoundingClientRect() || {
      left: window.innerWidth - 60,
      top: 20,
    };

    setFlyItem({
      x: rectButton.left,
      y: rectButton.top,
      targetX: rectCart.left,
      targetY: rectCart.top,
      img: fixImg(item.prImg),
      id: item._id,
    });

    setTimeout(() => setFlyItem(null), 800);

    toast.success("Added to cart!");
  };

  return (
    <div className="px-6 md:px-16 py-10 bg-gray-50 min-h-screen mt-20 relative">
      {/* Fly-to-cart animation */}
      <AnimatePresence>
        {flyItem && (
          <motion.img
            src={flyItem.img}
            initial={{ x: flyItem.x, y: flyItem.y, scale: 1 }}
            animate={{ x: flyItem.targetX, y: flyItem.targetY, scale: 0.2 }}
            transition={{ duration: 0.8 }}
            className="fixed w-16 h-20 rounded-lg z-50"
          />
        )}
      </AnimatePresence>

      {/* Categories & Search */}
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

      {/* Products Grid */}
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
                  onError={(e) => (e.target.src = "/no-image.png")}
                  alt={item.name}
                  className="h-52 w-full object-cover rounded-lg"
                />

                <h2 className="font-semibold text-gray-800 mt-2">{item.name}</h2>

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
                  <span className="text-yellow-600 font-bold">${item.price}</span>

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
