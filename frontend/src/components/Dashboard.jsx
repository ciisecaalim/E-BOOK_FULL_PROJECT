import { useState, useEffect, useRef } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- StatCard ---
function StatCard({ title, value, change, positive }) {
  if (!title || value == null) return null;

  return (
    <div className="rounded-2xl bg-blue-900 shadow-lg p-6 cursor-pointer group transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <p className="text-gray-200 text-sm">{title}</p>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {change != null && (
          <span
            className={`text-sm flex items-center gap-1 ${
              positive ? "text-green-400" : "text-red-400"
            }`}
          >
            {positive ? <FaArrowUp /> : <FaArrowDown />} {change}
          </span>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs text-gray-400">
        Updated recently
      </div>
    </div>
  );
}

// --- Progress ---
function Progress({ percent, color }) {
  const safePercent = Math.min(Math.max(percent || 0, 0), 100);
  return (
    <div className="h-2 w-full rounded-full bg-purple-800/40">
      <div
        className="h-2 rounded-full transition-all duration-1000 ease-in-out"
        style={{ width: `${safePercent}%`, backgroundColor: color }}
      />
    </div>
  );
}

// --- Donut ---
function Donut({ percent, color }) {
  const safePercent = Math.min(Math.max(percent || 0, 0), 100);
  return (
    <div
      className="w-28 h-28 rounded-full grid place-items-center"
      style={{ backgroundColor: "#6b21a8" }}
    >
      <div className="w-20 h-20 rounded-full bg-purple-800 grid place-items-center shadow-inner">
        <span className="text-white font-semibold">{safePercent}%</span>
      </div>
    </div>
  );
}

// --- Mini Bar Chart ---
function MiniBarChart({ values }) {
  if (!values || !values.length) return null;
  const max = Math.max(...values, 1);
  const colors = ["#d8b4fe", "#c084fc", "#a855f7", "#7e22ce"];
  const [animatedHeights, setAnimatedHeights] = useState(values.map(() => 0));
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    values.forEach((v, i) => {
      setTimeout(() => {
        setAnimatedHeights((prev) => {
          const newHeights = [...prev];
          newHeights[i] = (v / max) * 100;
          return newHeights;
        });
      }, i * 150);
    });
  }, [values, max]);

  return (
    <div className="flex items-end gap-2 h-24 mt-2 justify-between">
      {animatedHeights.map((h, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
          className={`w-4 rounded transition-all duration-500 ease-in-out ${
            hoverIndex === i ? "scale-110" : ""
          }`}
          style={{ height: `${h}%`, background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}

// --- Dashboard ---
function Dashboard() {
  const alertSound = useRef(null);

  // --- Static Products & Customers ---
  const [products, setProducts] = useState([
    { name: "Product A", quantity: 10, category: "Electronics" },
    { name: "Product B", quantity: 3, category: "Electronics" },
    { name: "Product C", quantity: 0, category: "Furniture" },
    { name: "Product D", quantity: 5, category: "Furniture" },
    { name: "Product E", quantity: 2, category: "Groceries" },
  ]);

  const totalIncome = 12000;
  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const dayTotals = [50, 25, 75, 50, 100, 50, 50];

  const [incomeData, setIncomeData] = useState(
    days.map((day) => ({ day, income: Math.floor(Math.random() * 2000 + 1000) }))
  );

  const stockData = products.map((p) => ({ name: p.name, stock: p.quantity }));

  // --- Auto Refresh Every 1 Minute ---
  useEffect(() => {
    const refreshData = () => {
      // Simulate new income
      setIncomeData(days.map((day) => ({ day, income: Math.floor(Math.random() * 2000 + 1000) })));

      // If products were dynamic from API, refresh them here
      setProducts((prev) =>
        prev.map((p) => ({ ...p, quantity: Math.max(0, p.quantity + Math.floor(Math.random() * 3 - 1)) }))
      );
    };

    refreshData(); // initial refresh
    const interval = setInterval(refreshData, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // --- Low Stock & Out of Stock ---
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 5).length;

  // Play alert sound if lowStock exists
  useEffect(() => {
    if (lowStock > 0 && alertSound.current) {
      alertSound.current.play();
      alert(`Warning! ${lowStock} product(s) have low stock.`);
    }
  }, [lowStock]);

  // --- Categories ---
  const categoryToCount = products.reduce((acc, p) => {
    const key = p.category || "Uncategorized";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryToCount);

  return (
    <div className="min-h-screen bg-purple-700 p-8 space-y-8 text-white">
      <audio ref={alertSound} src="/alert.mp3" preload="auto" />

      <h1 className="text-4xl font-bold mb-6">Welcome back, Admin!</h1>

      {/* Top Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Balance" value={`$${(totalIncome * 1.85).toLocaleString()}`} change="12.1%" positive />
        <StatCard title="Income" value={`$${totalIncome.toLocaleString()}`} change="6.3%" positive />
        <StatCard title="Expense" value="$6,222" change="2.4%" />
        <StatCard title="Total Savings" value="$32,913" change="12.1%" positive />
      </div>

      {/* Analytics */}
      <div className="rounded-2xl bg-purple-800 p-6">
        <p className="font-semibold text-lg mb-4">Daily Analytics</p>
        <div className="flex justify-between text-xs text-gray-300">
          {days.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <MiniBarChart values={dayTotals} />
      </div>

      {/* Income Trend */}
      <div className="rounded-2xl bg-purple-800 p-6">
        <p className="font-semibold mb-4">Income Trend (Live)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={incomeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <Tooltip contentStyle={{ backgroundColor: "#6b21a8", borderRadius: 5 }} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#d8b4fe" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Levels */}
      <div className="rounded-2xl bg-purple-800 p-6">
        <p className="font-semibold mb-4">Stock Levels</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stockData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <Tooltip contentStyle={{ backgroundColor: "#6b21a8", borderRadius: 5 }} />
            <Bar dataKey="stock" fill="#d8b4fe" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Overview */}
      <div className="rounded-2xl bg-purple-800 p-6 grid grid-cols-3 text-center">
        <div>
          <p className="text-gray-300 text-sm">Total items</p>
          <p className="text-2xl font-bold">{totalStock}</p>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Low stock</p>
          <p className="text-2xl font-bold text-amber-400">{lowStock}</p>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Out of stock</p>
          <p className="text-2xl font-bold text-red-400">{outOfStock}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-2xl bg-purple-800 p-6">
        <p className="font-semibold mb-4">Categories</p>
        {categories.length === 0 ? (
          <div className="text-gray-400">No categories found</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(([cat, count]) => (
              <div
                key={cat}
                className="rounded-lg border border-purple-900 p-3 flex items-center justify-between hover:bg-purple-900/40 transition"
              >
                <span className="truncate">{cat}</span>
                <span className="text-sm text-gray-300">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
