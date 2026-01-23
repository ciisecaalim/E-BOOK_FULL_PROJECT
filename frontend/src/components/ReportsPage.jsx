import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

/* ---------------- CONFIG ---------------- */
const API_SALES = "/api/sales"; // API endpoint for full paid sales history
const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EF4444", "#8B5CF6", "#D946EF"];
const money = (v) =>
  `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

/* ---------------- MAIN COMPONENT ---------------- */
export default function ReportsPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${API_SALES}/read`); // API should return full paid history
        setSales(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load sales history", err);
        setSales([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ---------------- CALCULATIONS ---------------- */
  const report = useMemo(() => {
    if (!Array.isArray(sales))
      return {
        totalOriginal: 0,
        totalSelling: 0,
        totalDiscount: 0,
        totalProfit: 0,
        totalQty: 0,
        totalSalesCount: 0,
      };

    let totalOriginal = 0;
    let totalSelling = 0;
    let totalDiscount = 0;
    let totalQty = 0;

    sales.forEach((sale) => {
      const qty = sale.quantity || 0;
      const original = sale.product?.originalPrice ?? 0;
      const selling = sale.sellingPrice ?? 0;

      totalQty += qty;
      totalOriginal += original * qty;
      totalSelling += selling * qty;
      totalDiscount += (original - selling) * qty;
    });

    return {
      totalOriginal,
      totalSelling,
      totalDiscount,
      totalProfit: totalSelling - totalOriginal,
      totalQty,
      totalSalesCount: sales.length,
    };
  }, [sales]);

  /* ---------------- CHART DATA ---------------- */
  const barChartData = useMemo(() => {
    const map = {};
    sales.forEach((sale) => {
      const name = sale.product?.name || "Unknown";
      map[name] = (map[name] || 0) + (sale.sellingPrice ?? 0) * (sale.quantity ?? 0);
    });
    return Object.entries(map).map(([name, amount]) => ({ name, amount }));
  }, [sales]);

  const pieChartData = useMemo(() => {
    const map = {};
    sales.forEach((sale) => {
      const cat = sale.product?.category || "Other";
      map[cat] = (map[cat] || 0) + (sale.sellingPrice ?? 0) * (sale.quantity ?? 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [sales]);

  /* ---------------- EXPORT FUNCTIONS ---------------- */
  const exportChartsAsImage = async () => {
    for (const ref of [barChartRef, pieChartRef]) {
      if (ref.current) {
        const dataUrl = await toPng(ref.current);
        const link = document.createElement("a");
        link.download = "chart.png";
        link.href = dataUrl;
        link.click();
      }
    }
  };

  const exportExcel = (data, filename = "sales_history.xlsx") => {
    const ws = XLSX.utils.json_to_sheet(data.map((s) => ({
      Name: s.product?.name,
      Category: s.product?.category,
      OriginalPrice: s.product?.originalPrice,
      SellingPrice: s.sellingPrice,
      Discount: s.product?.originalPrice - s.sellingPrice,
      Quantity: s.quantity,
      Total: (s.sellingPrice ?? 0) * (s.quantity ?? 0),
      Created: new Date(s.createdAt).toLocaleDateString(),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales History Reports", 14, 16);
    const tableColumn = ["Name", "Category", "Original", "Selling", "Discount", "Qty", "Total", "Created"];
    const tableRows = sales.map((s) => {
      const original = s.product?.originalPrice ?? 0;
      const selling = s.sellingPrice ?? 0;
      const discount = original - selling;
      const total = selling * (s.quantity ?? 0);
      return [
        s.product?.name,
        s.product?.category || "-",
        money(original),
        money(selling),
        discount > 0 ? money(discount) : "-",
        s.quantity ?? 0,
        money(total),
        new Date(s.createdAt).toLocaleDateString(),
      ];
    });
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("sales_history_report.pdf");
  };

  if (loading) return <p className="p-6">Loading sales history...</p>;

  return (
    <div className="bg-white p-6 space-y-10 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Sales & Product Reports</h1>
        <p className="text-gray-500 text-sm">Full sales history with financial analytics</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
        <Stat title="Total Sales" value={report.totalSalesCount} />
        <Stat title="Total Quantity" value={report.totalQty} />
        <Stat title="Original Value" value={money(report.totalOriginal)} />
        <Stat title="Total Sales Value" value={money(report.totalSelling)} />
        <Stat title="Total Discount" value={money(report.totalDiscount)} />
      </div>

      {/* CHARTS */}
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow" ref={barChartRef}>
          <h3 className="font-semibold mb-4">Sales by Product</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => money(v)} />
              <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow" ref={pieChartRef}>
          <h3 className="font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieChartData} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={5}>
                {pieChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => money(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FULL SALES TABLE */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <h3 className="font-semibold mb-4">Full Sales History</h3>
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
            {sales.map((s) => {
              const original = s.product?.originalPrice ?? 0;
              const selling = s.sellingPrice ?? 0;
              const discount = original - selling;
              const total = selling * (s.quantity ?? 0);
              return (
                <tr key={s._id} className="border-t">
                  <TD>{s.product?.name}</TD>
                  <TD>{s.product?.category || "-"}</TD>
                  <TD>{money(original)}</TD>
                  <TD>{money(selling)}</TD>
                  <TD className="text-red-500">{discount > 0 ? money(discount) : "-"}</TD>
                  <TD>{s.quantity ?? 0}</TD>
                  <TD className="font-semibold">{money(total)}</TD>
                  <TD>{new Date(s.createdAt).toLocaleDateString()}</TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* EXPORT BUTTONS */}
      <div className="flex gap-3">
        <button onClick={exportChartsAsImage} className="px-4 py-2 bg-yellow-500 text-white rounded-xl">Download Charts</button>
        <button onClick={() => exportExcel(sales)} className="px-4 py-2 bg-green-600 text-white rounded-xl">Export Excel</button>
        <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-xl">Export PDF</button>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */
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
