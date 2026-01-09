import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrashAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HeaderBookStore from "./Header";

function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [shipping, setShipping] = useState(5);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fixImg = (img) =>
    img ? `http://localhost:3000/uploads/${img}` : "/no-image.png";

  /* =========================
     LOAD CART + MERGE PENDING ITEMS
  ========================== */
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("product")) || [];
    const pending = JSON.parse(localStorage.getItem("pendingItem")) || [];

    let mergedCart = [...savedCart];

    pending.forEach((p) => {
      const existing = mergedCart.find((c) => c._id === p._id);
      if (!existing) {
        mergedCart.push(p);
      } else {
        // Update quantity if already exists
        mergedCart = mergedCart.map((c) =>
          c._id === p._id ? { ...c, quantity: c.quantity + p.quantity } : c
        );
      }
    });

    setCartItems(mergedCart);
    localStorage.setItem("product", JSON.stringify(mergedCart));
    localStorage.removeItem("pendingItem");
  }, []);

  /* =========================
     FETCH CUSTOMER
  ========================== */
  useEffect(() => {
    const email = localStorage.getItem("customerEmail");

    if (!email) {
      setCustomer(null);
      setCustomerLoading(false);
      return;
    }

    fetch(
      `http://localhost:3000/api/customers/get/${encodeURIComponent(email)}`
    )
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch(() => setCustomer(null))
      .finally(() => setCustomerLoading(false));
  }, []);

  /* =========================
     UPDATE TOTAL
  ========================== */
  useEffect(() => {
    localStorage.setItem("product", JSON.stringify(cartItems));
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalCost(itemsTotal + shipping);
  }, [cartItems, shipping]);

  /* =========================
     CART ACTIONS
  ========================== */
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  /* =========================
     CHECKOUT
  ========================== */
  const handleCheckout = async () => {
    if (!customer) {
      toast.info("Fadlan same login si aad u checkout-gareyso");
      localStorage.setItem("pendingItem", JSON.stringify(cartItems));
      navigate("/CustomerLogin");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart waa madhan yahay");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        products: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        totalAmount: totalCost,
      };

      const res = await fetch("http://localhost:3000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order successfully placed!");
        setCartItems([]);
        localStorage.removeItem("product");
        localStorage.removeItem("pendingItem");
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

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <HeaderBookStore />

      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">
            Shopping Cart ({cartItems.length})
          </h2>

          <div className="bg-white shadow-xl rounded-xl p-6 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                Cart waa madhan yahay
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-6 gap-4 items-center border-b pb-4"
                >
                  <div className="col-span-2 flex gap-4">
                    <img
                      src={fixImg(item.prImg)}
                      className="w-24 h-24 rounded-lg"
                      alt={item.name}
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.category}</p>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 flex gap-2 justify-center">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      <FaMinus />
                    </button>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 font-bold rounded-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="col-span-1 text-center">${item.price}</div>
                  <div className="col-span-1 text-center font-bold">
                    ${item.price * item.quantity}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white shadow-xl rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="flex justify-between">
            <span>Items</span>
            <span>${itemsTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <select
              value={shipping}
              onChange={(e) => setShipping(Number(e.target.value))}
            >
              <option value={5}>Standard - $5</option>
              <option value={10}>Express - $10</option>
            </select>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${totalCost}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-purple-700 text-white py-3 rounded-xl"
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Checkout"}
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h3 className="text-xl font-bold mb-4">Order Completed 🎉</h3>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
