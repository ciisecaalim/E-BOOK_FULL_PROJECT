import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- API BASE ---------------- */
const API = "/api/products";

/* ---------------- MONEY FORMAT ---------------- */
const money = (v) =>
  `$${Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${API}/read`);
        // Ensure products is always an array
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ---------------- CALCULATIONS ---------------- */
  const report = useMemo(() => {
    if (!Array.isArray(products)) return {
      totalOriginal: 0,
      totalSelling: 0,
      totalDiscount: 0,
      totalProfit: 0,
      totalQty: 0,
      totalProducts: 0,
    };

    let totalOriginal = 0;
    let totalSelling = 0;
    let totalDiscount = 0;
    let totalQty = 0;

    products.forEach((p) => {
      const qty = p.quantity || 0;
      const original = p.originalPrice ?? p.price ?? 0;
      const selling = p.sellingPrice ?? p.price ?? 0;

      totalQty += qty;
      totalOriginal += original * qty;
      totalSelling += selling * qty;
      totalDiscount += (original - selling) * qty;
    });

    return {
      totalOriginal,
      totalSelling,
      totalDiscount,
      totalProfit: totalSelling - totalOriginal + totalDiscount,
      totalQty,
      totalProducts: products.length,
    };
  }, [products]);

  /* ---------------- CHART DATA ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.map((p) => ({
      name: p.name,
      amount: (p.sellingPrice ?? p.price ?? 0) * (p.quantity ?? 0),
    }));
  }, [products]);

  if (loading) return <p className="p-6">Loading reports...</p>;

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Sales & Product Reports</h1>
        <p className="text-gray-500 text-sm">
          Full product financial & inventory analytics
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
        <Stat title="Total Products" value={report.totalProducts} />
        <Stat title="Total Quantity" value={report.totalQty} />
        <Stat title="Original Value" value={money(report.totalOriginal)} />
        <Stat title="Total Sales" value={money(report.totalSelling)} />
        <Stat title="Total Discount" value={money(report.totalDiscount)} />
      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Sales by Product</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => money(v)} />
            <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= FULL PRODUCT TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <h3 className="font-semibold mb-4">Full Product Financial Details</h3>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <TH>Name</TH>
              <TH>Category</TH>
              <TH>Original Price</TH>
              <TH>Selling Price</TH>
              <TH>Discount</TH>
              <TH>Quantity</TH>
              <TH>Total Amount</TH>
              <TH>Created</TH>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const original = p.originalPrice ?? p.price ?? 0;
              const selling = p.sellingPrice ?? p.price ?? 0;
              const discount = original - selling;
              const total = selling * (p.quantity ?? 0);

              return (
                <tr key={p._id} className="border-t">
                  <TD>{p.name}</TD>
                  <TD>{p.category?.name || p.category || "-"}</TD>
                  <TD>{money(original)}</TD>
                  <TD>{money(selling)}</TD>
                  <TD className="text-red-500">
                    {discount > 0 ? money(discount) : "-"}
                  </TD>
                  <TD>{p.quantity ?? 0}</TD>
                  <TD className="font-semibold">{money(total)}</TD>
                  <TD>{new Date(p.createdAt).toLocaleDateString()}</TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */
function Stat({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function TH({ children }) {
  return <th className="px-3 py-2 text-left">{children}</th>;
}

function TD({ children }) {
  return <td className="px-3 py-2">{children}</td>;
}
