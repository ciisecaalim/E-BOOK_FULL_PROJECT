import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrashAlt, FaSpinner } from "react-icons/fa";
import CountUp from "react-countup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HeaderBookStore from "./Header";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [shipping, setShipping] = useState(5);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // <-- modal state

  const navigate = useNavigate();

  const fixImg = (img) => img ? `http://localhost:3000/uploads/${img}` : "/no-image.png";

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("product")) || [];
    setCartItems(items);

    if (items.length > 0 && !localStorage.getItem("customerEmail")) {
      localStorage.setItem("pendingItem", JSON.stringify(items));
    } else {
      localStorage.removeItem("pendingItem");
    }
  }, []);

  useEffect(() => {
    const fetchCustomer = async () => {
      const email = localStorage.getItem("customerEmail");
      if (!email) {
        setCustomer(null);
        setCustomerLoading(false);
        return;
      }

      try {
        setCustomerLoading(true);
        const res = await fetch(`http://localhost:3000/api/customers/get/${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setCustomer(data);

          const pending = JSON.parse(localStorage.getItem("pendingItem")) || [];
          if (pending.length > 0) {
            setCartItems(prev => [...prev, ...pending]);
            localStorage.removeItem("pendingItem");
          }
        } else {
          setCustomer(null);
        }
      } catch {
        setCustomer(null);
      } finally {
        setCustomerLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  useEffect(() => {
    localStorage.setItem("product", JSON.stringify(cartItems));
    const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(itemsTotal + shipping);
  }, [cartItems, shipping]);

  const updateQuantity = (id, delta) =>
    setCartItems(prev =>
      prev.map(item => item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    );

  const removeItem = (id) => setCartItems(prev => prev.filter(item => item._id !== id));

  const handleCheckout = async () => {
    if (!customer) {
      toast.info("Please login before checkout");
      localStorage.setItem("pendingItem", JSON.stringify(cartItems));
      navigate("/CustomerLogin");
      return;
    }

    if (cartItems.length === 0) return toast.error("Cart is empty!");
    setLoading(true);

    try {
      const orderData = {
        customer: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        products: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        totalAmount: totalCost,
      };

      const response = await fetch("http://localhost:3000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok && data._id) {
        toast.success("Order placed successfully!");
        setCartItems([]);
        localStorage.removeItem("product");
        localStorage.removeItem("pendingItem");
        setTotalCost(0);

        // show modal instead of window.confirm
        setShowModal(true);
      } else {
        toast.error(data.message || "Checkout failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <HeaderBookStore />

      {/* Main Cart Page */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6 flex justify-between items-center">
            Shopping Cart{" "}
            <span className="text-gray-500 text-xl">
              <CountUp end={cartItems.length} duration={0.5} /> Items
            </span>
          </h2>

          <div className="bg-white shadow-xl rounded-xl p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <img src="/empty-cart.png" alt="Empty cart" className="mx-auto w-40 h-40 mb-4 opacity-70" />
                <p className="text-gray-500 text-lg">Your cart is empty.</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item._id} className="grid grid-cols-6 gap-4 items-center border-b pb-4 hover:shadow-md rounded-lg transition-all">
                  <div className="col-span-2 flex items-center gap-4">
                    <img src={fixImg(item.prImg)} alt={item.name} className="w-24 h-24 object-cover rounded-lg" onError={e => (e.target.src = "/no-image.png")} />
                    <div>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.category}</p>
                      <button className="text-red-500 text-sm mt-2 flex items-center gap-1" onClick={() => removeItem(item._id)}>
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center gap-2 justify-center">
                    <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => updateQuantity(item._id, -1)} disabled={item.quantity <= 1}><FaMinus /></button>
                    <span className="bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-lg"><CountUp end={item.quantity} duration={0.3} /></span>
                    <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => updateQuantity(item._id, 1)}><FaPlus /></button>
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
            <span><CountUp end={itemsTotal} duration={0.5} decimals={2} prefix="$" /></span>
          </div>

          <div className="flex justify-between items-center">
            <span>Shipping</span>
            <select className="border rounded px-2 py-1" value={shipping} onChange={e => setShipping(Number(e.target.value))}>
              <option value={5}>Standard Delivery - $5</option>
              <option value={10}>Express Delivery - $10</option>
            </select>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Total Cost</span>
            <span><CountUp end={totalCost} duration={0.5} decimals={2} prefix="$" separator="," /></span>
          </div>

          {customerLoading ? (
            <button className="w-full bg-gray-300 text-white py-3 rounded-xl font-bold text-lg flex justify-center items-center" disabled>
              <FaSpinner className="animate-spin mr-2" /> Loading customer...
            </button>
          ) : (
            <button className={`w-full bg-purple-700 text-white py-3 rounded-xl font-bold text-lg ${loading || cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={cartItems.length === 0 || loading}
              onClick={handleCheckout}
            >
              {loading ? (<><FaSpinner className="animate-spin mr-2" /> Processing...</>) : "Checkout"}
            </button>
          )}
        </div>
      </div>

      {/* --- Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Order Placed!</h3>
            <p className="mb-6">Do you want to go to the Home page?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-purple-700 text-white rounded-lg font-bold"
                onClick={() => navigate("/")}
              >
                Yes
              </button>
              <button
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-bold"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
