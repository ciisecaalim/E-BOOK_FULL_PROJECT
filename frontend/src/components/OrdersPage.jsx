import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaSpinner, FaChevronDown, FaChevronUp, FaFileCsv, FaPrint } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import CountUp from "react-countup";
import 'react-toastify/dist/ReactToastify.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // today, week, month
  const [selectedOrders, setSelectedOrders] = useState([]);
  const intervalRef = useRef(null);

  // ===================== FETCH ORDERS =====================
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/orders/read");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to fetch orders!");
    } finally {
      setLoading(false);
    }
  };

  // ===================== FETCH PRODUCTS =====================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products/read");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ===================== FETCH CUSTOMERS =====================
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/customers/read");
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  // ===================== AUTO REFRESH =====================
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
    intervalRef.current = setInterval(() => {
      fetchOrders();
      fetchProducts();
      fetchCustomers();
    }, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // ===================== UPDATE PAYMENT STATUS =====================
  const updatePaymentStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/update-payment/${id}`, { paymentStatus: status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, paymentStatus: status } : o));
      toast.success(`Payment status updated to ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment status!");
    }
  };

  // ===================== LOW STOCK ALERT =====================
  useEffect(() => {
    const lowStock = products.filter(p => p.quantity <= (p.minQuantity || 5));
    if (lowStock.length > 0) {
      lowStock.forEach(p => toast.warn(`⚠️ Low Stock: ${p.name} (${p.quantity})`));
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
      audio.play();
    }
  }, [products]);

  // ===================== UNPAID ORDERS ALERT =====================
  useEffect(() => {
    const unpaid = orders.filter(o => o.paymentStatus !== "Paid");
    if (unpaid.length > 0) {
      toast.info(`💳 ${unpaid.length} unpaid orders!`);
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
      audio.play();
    }
  }, [orders]);

  // ===================== FILTER & SEARCH =====================
  let filteredOrders = orders
    .filter(o => !statusFilter || o.status === statusFilter)
    .filter(o => {
      if (!searchKey) return true;
      const key = searchKey.toLowerCase();
      return (
        o.customer?.toLowerCase().includes(key) ||
        o.email?.toLowerCase().includes(key) ||
        o.products?.some(p => (p.productId?.name || p.name || "").toLowerCase().includes(key))
      );
    })
    .filter(o => {
      const now = new Date();
      const created = new Date(o.createdAt);
      if(dateFilter==="today") return created.toDateString()===now.toDateString();
      if(dateFilter==="week") {
        const weekAgo = new Date(); weekAgo.setDate(now.getDate()-7);
        return created >= weekAgo;
      }
      if(dateFilter==="month") return created.getMonth()===now.getMonth() && created.getFullYear()===now.getFullYear();
      return true;
    });

  // ===================== PAGINATION =====================
  const totalPages = Math.ceil(filteredOrders.length / limit);
  const start = page * limit;
  const currentOrders = filteredOrders.slice(start, start + limit);
  const totalRevenue = orders.reduce((s,o)=>s+(o.totalAmount||0),0);

  // ===================== CHECKBOX =====================
  const toggleSelectOrder = id => setSelectedOrders(prev => prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const toggleSelectAll = () => setSelectedOrders(selectedOrders.length===filteredOrders.length?[]:filteredOrders.map(o=>o._id));

  // ===================== CSV EXPORT =====================
  const exportCSV = () => {
    const data = selectedOrders.length ? filteredOrders.filter(o=>selectedOrders.includes(o._id)) : filteredOrders;
    if(!data.length) return toast.error("No orders to export!");
    const header = ["Customer","Email","Status","Payment","Date","Products","Total"];
    const rows = data.map(o=>[
      o.customer||"Guest",
      o.email||"N/A",
      o.status||"Processing",
      o.paymentStatus||"Unpaid",
      new Date(o.createdAt).toLocaleString(),
      o.products.map(p=>`${p.productId?.name || p.name || "Unknown"} (x${p.quantity})`).join("; "),
      (o.totalAmount||0).toFixed(2)
    ]);
    const csv = "data:text/csv;charset=utf-8,"+[header.join(","),...rows.map(r=>r.join(","))].join("\n");
    const link = document.createElement("a"); link.href=encodeURI(csv); link.download=`orders_${new Date().toISOString()}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
    toast.success("CSV exported!");
  };

  // ===================== PRINT =====================
  const printOrders = () => {
    const data = selectedOrders.length ? filteredOrders.filter(o=>selectedOrders.includes(o._id)) : filteredOrders;
    if(!data.length) return toast.error("No orders to print!");
    const html = `<html><head><title>Orders</title><style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #333;padding:8px;}th{background:#f0f0f0;}</style></head><body><h2>Orders Report</h2><table><thead><tr><th>#</th><th>Customer</th><th>Status</th><th>Payment</th><th>Date</th><th>Products</th><th>Total</th></tr></thead><tbody>${data.map((o,i)=>`<tr><td>${i+1}</td><td>${o.customer||"Guest"}</td><td>${o.status}</td><td>${o.paymentStatus}</td><td>${new Date(o.createdAt).toLocaleString()}</td><td>${o.products.map(p=>`${p.productId?.name||p.name||"Unknown"} (x${p.quantity})`).join("; ")}</td><td>£${(o.totalAmount||0).toFixed(2)}</td></tr>`).join("")}</tbody></table></body></html>`;
    const w = window.open(); w.document.write(html); w.document.close(); w.print();
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={4000} newestOnTop />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white rounded-2xl shadow-lg p-6 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold tracking-wide">🧾 Orders Dashboard</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input type="text" placeholder="🔍 Search..." className="px-3 py-2 rounded-lg text-gray-800 focus:ring-2 ring-indigo-400" value={searchKey} onChange={e=>setSearchKey(e.target.value)} />
          <select className="px-3 py-2 rounded-lg focus:ring-2 ring-indigo-400 text-black" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value); setPage(0)}}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
          <select className="px-3 py-2 rounded-lg focus:ring-2 ring-indigo-400 text-black" value={dateFilter} onChange={e=>setDateFilter(e.target.value)}>
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
          <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg"><FaFileCsv /> Export</button>
          <button onClick={printOrders} className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"><FaPrint /> Print</button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {label:"Total Orders",value:orders.length,color:"text-indigo-600",bg:"bg-indigo-100"},
          {label:"Revenue",value:totalRevenue,color:"text-green-600",bg:"bg-green-100"},
          {label:"Pending Orders",value:orders.filter(o=>o.status==="Pending").length,color:"text-amber-600",bg:"bg-amber-100"},
          {label:"Completed Orders",value:orders.filter(o=>o.status==="Completed").length,color:"text-emerald-600",bg:"bg-emerald-100"},
        ].map(c=>(
          <div key={c.label} className={`${c.bg} rounded-2xl shadow-md p-6 hover:scale-[1.05] transition-all duration-300 border-l-4 border-indigo-600`}>
            <p className="text-gray-500">{c.label}</p>
            <p className={`text-2xl font-bold mt-2 ${c.color}`}><CountUp end={c.value} duration={1.2} /></p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {loading ? <div className="flex justify-center py-20 text-gray-500"><FaSpinner className="animate-spin mr-2"/> Loading...</div>
        : error ? <div className="text-center py-16 text-red-500 font-medium">{error}</div>
        : currentOrders.length===0 ? <div className="py-20 text-center text-gray-500">No orders found.</div>
        : (
          <table className="min-w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3"><input type="checkbox" checked={selectedOrders.length===filteredOrders.length && filteredOrders.length>0} onChange={toggleSelectAll}/></th>
                <th className="p-3">#</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((o,i)=>(
                <>
                  <tr key={o._id} className={`${i%2===0?'bg-gray-50':'bg-white'} ${o.paymentStatus!=="Paid"?"bg-red-50":""} hover:bg-gray-100`}>
                    <td className="p-3"><input type="checkbox" checked={selectedOrders.includes(o._id)} onChange={()=>toggleSelectOrder(o._id)}/></td>
                    <td className="p-3">{start+i+1}</td>
                    <td className="p-3 font-medium">{o.customer||"Guest"}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-white text-sm ${o.status==="Pending"?"bg-amber-500":o.status==="Processing"?"bg-blue-500":"bg-green-500"}`}>{o.status}</span></td>
                    <td className="p-3">
                      <select value={o.paymentStatus||"Unpaid"} onChange={e=>updatePaymentStatus(o._id,e.target.value)} className={`px-2 py-1 rounded-lg text-sm ${(o.paymentStatus==="Paid"?"bg-green-100 text-green-700":"bg-red-100 text-red-700")}`}>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </td>
                    <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-semibold">£{(o.totalAmount||0).toFixed(2)}</td>
                    <td className="p-3 cursor-pointer text-indigo-600" onClick={()=>setExpandedOrder(expandedOrder===o._id?null:o._id)}>{expandedOrder===o._id?<FaChevronUp/>:<FaChevronDown/>}</td>
                  </tr>
                  {expandedOrder===o._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="p-4">
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-xl shadow-sm border">
                            <h4 className="font-semibold text-indigo-700 mb-2">👤 Customer Info</h4>
                            <p><span className="font-medium">Name:</span> {o.customer||"Guest"}</p>
                            <p><span className="font-medium">Email:</span> {o.email||"N/A"}</p>
                            <p><span className="font-medium">Phone:</span> {o.phone||"N/A"}</p>
                            <p><span className="font-medium">Address:</span> {o.address||"N/A"}</p>
                          </div>
                          <div className="bg-white p-3 rounded-xl shadow-sm border">
                            <h4 className="font-semibold text-indigo-700 mb-2">📦 Products</h4>
                            {o.products?.map((p,j)=>(
                              <div key={j} className="flex justify-between items-center text-sm mb-1">
                                <span>{p.productId?.name || p.name || "Unknown"}</span>
                                <span>Qty: {p.quantity}</span>
                                <span>£{(p.total||(p.price&&p.quantity?p.price*p.quantity:0)).toFixed(2)}</span>
                              </div>
                            ))}
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
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} className={`px-6 py-2 rounded-lg text-white ${page===0?"bg-gray-400 cursor-not-allowed":"bg-indigo-600 hover:bg-indigo-700"}`}>← Prev</button>
          <span className="text-gray-700 font-medium">Page {page+1} of {totalPages||1}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} className={`px-6 py-2 rounded-lg text-white ${page>=totalPages-1?"bg-gray-400 cursor-not-allowed":"bg-indigo-600 hover:bg-indigo-700"}`}>Next →</button>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
