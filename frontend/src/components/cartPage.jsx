import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import CountUp from "react-countup";
import HeaderBookStore from "./Header";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [shipping, setShipping] = useState(5);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart items from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("product")) || [];
    setCartItems(stored);
  }, []);

  // Update localStorage and totalCost when cartItems or shipping change
  useEffect(() => {
    localStorage.setItem("product", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage"));
    const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(itemsTotal + shipping);
  }, [cartItems, shipping]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = id => setCartItems(prev => prev.filter(item => item._id !== id));

  // Checkout handler
  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");
    setLoading(true);

    try {
      const orderData = {
        customer: "John Doe", // replace with real user info
        products: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalAmount: totalCost
      };

    const response = await fetch("http://localhost:3000/api/orders/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(orderData)
});



      const data = await response.json();

      if (data.success) {
        alert("Checkout successful!");
        setCartItems([]);
        localStorage.removeItem("product");
        setTotalCost(0);
        window.dispatchEvent(new Event("storage"));
      } else {
        alert("Checkout failed, try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <HeaderBookStore />

      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shopping Cart */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6 flex justify-between items-center">
            Shopping Cart
            <span className="text-gray-500 text-xl">
              <CountUp end={cartItems.length} duration={0.5} /> Items
            </span>
          </h2>

          <div className="bg-white shadow-xl rounded-xl p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <img
                  src="/empty-cart.png"
                  alt="Empty cart"
                  className="mx-auto w-40 h-40 mb-4 opacity-70"
                />
                <p className="text-gray-500 text-lg">Your cart is empty.</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item._id}
                  className="grid grid-cols-6 gap-4 items-center border-b pb-4 hover:shadow-md rounded-lg transition-all duration-200"
                >
                  <div className="col-span-2 flex items-center gap-4">
                    <img
                      src={`http://localhost:3000/allImg/${item.prImg}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg transform hover:scale-105 transition-all duration-200"
                    />
                    <div>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.category}</p>
                      <button
                        className="text-red-500 text-sm mt-2 flex items-center gap-1 hover:underline"
                        onClick={() => removeItem(item._id)}
                      >
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center gap-2 justify-center">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-all"
                      onClick={() => updateQuantity(item._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-lg">
                      <CountUp end={item.quantity} duration={0.3} />
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-all"
                      onClick={() => updateQuantity(item._id, 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="col-span-1 font-medium text-center">${item.price.toFixed(2)}</div>
                  <div className="col-span-1 font-semibold text-center">
                    <CountUp end={item.price * item.quantity} duration={0.5} decimals={2} prefix="$" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-xl rounded-xl p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between text-gray-700 font-medium">
            <span>Items</span>
            <span><CountUp end={itemsTotal} duration={0.5} decimals={2} prefix="$"/></span>
          </div>

          <div className="flex justify-between items-center">
            <span>Shipping</span>
            <select
              className="border rounded px-2 py-1"
              value={shipping}
              onChange={e => setShipping(Number(e.target.value))}
            >
              <option value={5}>Standard Delivery - $5</option>
              <option value={10}>Express Delivery - $10</option>
            </select>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Total Cost</span>
            <span>
              <CountUp end={totalCost} duration={0.5} decimals={2} prefix="$" separator="," />
            </span>
          </div>

          <button
            className={`w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={cartItems.length === 0 || loading}
            onClick={handleCheckout}
          >
            {loading ? "Processing..." : "Checkout"}
          </button>

          {cartItems.length > 0 && (
            <p className="text-gray-500 text-sm mt-2 text-center">
              Tip: Review your items and shipping before checkout.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default CartPage;
