import { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaChevronDown, FaChevronUp, FaFileCsv, FaPrint } from "react-icons/fa";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Pagination & filters
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Checkbox selection
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/orders/read");
        setOrders(res.data.orders || []); // <-- ensure it's an array
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter & Search
  const filteredOrders = orders
    .filter((o) => !statusFilter || o.status === statusFilter)
    .filter((o) => {
      if (!searchKey) return true;
      const key = searchKey.toLowerCase();
      return (
        (o.customer && o.customer.toLowerCase().includes(key)) ||
        (o.email && o.email.toLowerCase().includes(key)) ||
        o.products?.some((p) => (p.productId?.name || p.name || "").toLowerCase().includes(key))
      );
    });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / limit);
  const start = page * limit;
  const currentOrders = filteredOrders.slice(start, start + limit);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  // Checkbox handlers
  const toggleSelectOrder = (id) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o._id));
    }
  };

  // Export CSV
  const exportCSV = () => {
    const dataToExport = selectedOrders.length
      ? filteredOrders.filter(o => selectedOrders.includes(o._id))
      : filteredOrders;
    if (!dataToExport.length) return alert("No orders to export!");

    const header = ["Customer", "Email", "Phone", "Address", "Status", "Date", "Products", "Total Amount"];
    const rows = dataToExport.map(o => [
      o.customer || "Guest",
      o.email || "N/A",
      o.phone || "N/A",
      o.address || "N/A",
      o.status || "Processing",
      new Date(o.createdAt).toLocaleString(),
      o.products.map(p => `${p.productId?.name || p.name || "Unknown Product"} (x${p.quantity || 0})`).join("; "),
      (o.totalAmount || 0).toFixed(2),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `orders_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Orders
  const printOrders = () => {
    const dataToPrint = selectedOrders.length
      ? filteredOrders.filter(o => selectedOrders.includes(o._id))
      : filteredOrders;
    if (!dataToPrint.length) return alert("No orders to print!");

    const printWindow = window.open("", "_blank");
    const htmlContent = `
      <html>
      <head>
        <title>Print Orders</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>Orders Report</h2>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Customer</th><th>Email</th><th>Status</th><th>Date</th><th>Products</th><th>Total (£)</th>
            </tr>
          </thead>
          <tbody>
            ${dataToPrint.map((o, i) => `
              <tr>
                <td>${i+1}</td>
                <td>${o.customer || "Guest"}</td>
                <td>${o.email || "N/A"}</td>
                <td>${o.status || "Processing"}</td>
                <td>${new Date(o.createdAt).toLocaleString()}</td>
                <td>${o.products.map(p => `${p.productId?.name || p.name || "Unknown Product"} (x${p.quantity || 0})`).join("; ")}</td>
                <td>£${(o.totalAmount || 0).toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white rounded-2xl shadow-lg p-6 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold tracking-wide">🧾 Orders Management</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="🔍 Search orders..."
            className="px-3 py-2 rounded-lg text-gray-800 outline-none focus:ring-2 ring-indigo-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-lg outline-none focus:ring-2 ring-indigo-400"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
          >
            <FaFileCsv /> Export CSV
          </button>
          <button
            onClick={printOrders}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            <FaPrint /> Print Orders
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[ 
          { label: "Total Orders", value: orders.length, color: "text-indigo-600", bg: "bg-indigo-100" },
          { label: "Total Revenue", value: `£${totalRevenue.toFixed(2)}`, color: "text-green-600", bg: "bg-green-100" },
          { label: "Pending Orders", value: orders.filter(o => o.status==="Pending").length, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Completed Orders", value: orders.filter(o => o.status==="Completed").length, color: "text-emerald-600", bg: "bg-emerald-100" }
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-2xl shadow-md p-6 hover:scale-[1.03] transition-all duration-200 border-l-4 border-indigo-600`}>
            <p className="text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <FaSpinner className="animate-spin mr-2" /> Loading orders...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 font-medium">{error}</div>
        ) : currentOrders.length===0 ? (
          <div className="py-20 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3"><input type="checkbox" checked={selectedOrders.length===filteredOrders.length && filteredOrders.length>0} onChange={toggleSelectAll} /></th>
                <th className="p-3">#</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total (£)</th>
                <th className="p-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, idx) => (
                <>
                  <tr key={order._id} className={`${idx%2===0?'bg-gray-50':'bg-white'} ${order.status==='Pending'?'bg-yellow-50':''}`}>
                    <td className="p-3"><input type="checkbox" checked={selectedOrders.includes(order._id)} onChange={()=>toggleSelectOrder(order._id)} /></td>
                    <td className="p-3">{start+idx+1}</td>
                    <td className="p-3 font-medium">{order.customer || "Guest"}</td>
                    <td className="p-3">{order.status || "Processing"}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-semibold">£{(order.totalAmount||0).toFixed(2)}</td>
                    <td className="p-3 cursor-pointer text-indigo-600" onClick={()=>setExpandedOrder(expandedOrder===order._id?null:order._id)}>
                      {expandedOrder===order._id?<FaChevronUp />:<FaChevronDown />}
                    </td>
                  </tr>
                  {expandedOrder===order._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="p-4">
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-xl shadow-sm border">
                            <h4 className="font-semibold text-indigo-700 mb-2">📦 Products</h4>
                            {order.products?.map((p, i)=>(
                              <div key={i} className="flex justify-between text-sm mb-1">
                                <span>{p.productId?.name || p.name || "Unknown Product"}</span>
                                <span>Qty: {p.quantity || 0}</span>
                                <span>£{(p.total || (p.price && p.quantity ? p.price*p.quantity : 0)).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-white p-3 rounded-xl shadow-sm border">
                            <h4 className="font-semibold text-indigo-700 mb-2">👤 Customer Info</h4>
                            <p><span className="font-medium">Name:</span> {order.customer || "Guest"}</p>
                            <p><span className="font-medium">Email:</span> {order.email || "N/A"}</p>
                            <p><span className="font-medium">Phone:</span> {order.phone || "N/A"}</p>
                            <p><span className="font-medium">Address:</span> {order.address || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 text-sm font-medium">Orders per page:</label>
          <select value={limit} onChange={e=>{setLimit(Number(e.target.value)); setPage(0);}} className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 ring-blue-500">
            {[10,20,50,100].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} className={`px-6 py-2 rounded-lg text-white ${page===0?"bg-gray-400 cursor-not-allowed":"bg-indigo-600 hover:bg-indigo-700"}`}>
            ← Prev
          </button>
          <span className="text-gray-700 font-medium">Page {page+1} of {totalPages||1}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} className={`px-6 py-2 rounded-lg text-white ${page>=totalPages-1?"bg-gray-400 cursor-not-allowed":"bg-indigo-600 hover:bg-indigo-700"}`}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
