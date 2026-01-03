import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function HeaderBookStore() {
  const GetCustomer = localStorage.getItem("customer");
  const customer = GetCustomer ? JSON.parse(GetCustomer) : null;

  const [cartCount, setCartCount] = useState(
    JSON.parse(localStorage.getItem("product"))?.length || 0
  );

  const location = useLocation();

  useEffect(() => {
    const updateCart = () => {
      const stored = JSON.parse(localStorage.getItem("product")) || [];
      setCartCount(stored.length);
    };

    // update on page load
    updateCart();

    // Listen for cart updates from BookCard
    window.addEventListener("cartUpdated", updateCart);

    // Listen for storage changes (other tabs)
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("admin");
    window.location.reload();
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-3xl font-extrabold text-green-600">📚</div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Book<span className="text-green-600">Mart</span>
          </h1>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {[
            { name: "Home", link: "/" },
            { name: "Categories", link: "/CategoryPage" },
            { name: "About", link: "/AboutUs" },
            { name: "Contact", link: "/ContactUs" },
          ].map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className={`relative transition ${
                location.pathname === item.link
                  ? "text-green-600 font-semibold"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              {item.name}
              {location.pathname === item.link && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-green-600 rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {customer ? (
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">
                {customer?.name ? customer.name[0].toUpperCase() : "U"}
              </div>
              <button
                onClick={handleLogOut}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-green-500 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link to="/CustomerLogin">
                <button className="hidden md:flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition">
                  <FaUser /> Login
                </button>
              </Link>
              <Link to="/register">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-green-500 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition">
                  Register
                </button>
              </Link>
            </div>
          )}

          <Link to="/CartPage">
            <button className="relative flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-green-700 transition">
              <FaShoppingCart />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HeaderBookStore;
