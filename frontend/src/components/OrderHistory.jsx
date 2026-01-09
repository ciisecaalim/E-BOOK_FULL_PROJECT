import { useEffect, useState } from "react";
import HeaderBookStore from "./Header";
import { toast } from "react-toastify";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("customerEmail");
    if (!email) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/orders/user/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch(() => toast.error("Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, []);

  const handlePayment = async (orderId, method) => {
    try {
      // Fake payment simulation, in real case integrate Stripe/PayPal SDK
      const res = await fetch(`http://localhost:3000/api/orders/update-payment/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Paid" }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: "Paid" } : o))
        );
        toast.success(`Payment successful via ${method}`);
      } else {
        toast.error("Payment failed");
      }
    } catch {
      toast.error("Payment error");
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  if (!orders.length)
    return (
      <>
        <HeaderBookStore />
        <div className="max-w-6xl mx-auto py-10 px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">My Orders</h2>
          <p className="text-gray-500">You have no orders yet.</p>
        </div>
      </>
    );

  return (
    <>
      <HeaderBookStore />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6">My Orders</h2>

        {orders.map((o) => (
          <div key={o._id} className="bg-white shadow p-5 rounded-xl mb-4">
            <p>
              <b>Total:</b> ${o.totalAmount.toFixed(2)}
            </p>
            <p>
              <b>Status:</b> {o.paymentStatus}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {/* Download Invoice */}
              <a
                href={`http://localhost:3000/api/invoice/${o._id}`}
                target="_blank"
                rel="noreferrer"
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                🧾 Download Invoice
              </a>

              {/* Stripe Payment */}
              {o.paymentStatus === "Unpaid" && (
                <button
                  onClick={() => handlePayment(o._id, "Stripe")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  💳 Pay with Stripe
                </button>
              )}

              {/* PayPal Payment */}
              {o.paymentStatus === "Unpaid" && (
                <button
                  onClick={() => handlePayment(o._id, "PayPal")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  💳 Pay with PayPal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default OrderHistory;
