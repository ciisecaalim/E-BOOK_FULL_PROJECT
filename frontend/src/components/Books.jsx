import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTrash,
  FaFileCsv,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import CountUp from "react-countup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===================== AXIOS INSTANCE ===================== */
const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add JWT automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store your JWT on login
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ===================== COMPONENT ===================== */
function BookTable() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filterCategories, setFilterCategories] = useState([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  /* ===================== FETCH BOOKS ===================== */
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products/read");
      setBooks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch books", err);
      toast.error("Failed to fetch books. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ===================== STOCK ALERTS ===================== */
  useEffect(() => {
    books.forEach((book) => {
      if (book.quantity === 0) {
        toast.error(`❌ "${book.name}" is Out of Stock!`);
      } else if (book.quantity < 5) {
        toast.warn(`⚠️ "${book.name}" is Low Stock (${book.quantity} left)`);
      }
    });
  }, [books]);

  /* ===================== STATS ===================== */
  const totalStock = books.reduce((s, b) => s + Number(b.quantity || 0), 0);
  const lowStock = books.filter((b) => b.quantity < 5 && b.quantity > 0).length;
  const outStock = books.filter((b) => b.quantity === 0).length;
  const totalValue = books.reduce(
    (s, b) => s + Number(b.quantity || 0) * Number(b.price || 0),
    0
  );
  const highestPrice = Math.max(...books.map((b) => Number(b.price || 0)), 0);
  const lowestStockBook =
    books.reduce((min, b) => (b.quantity < min.quantity ? b : min), books[0] || { quantity: 0 });

  /* ===================== CATEGORIES ===================== */
  const categoryCounts = books.reduce((acc, b) => {
    const c = b.category || "Uncategorized";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(categoryCounts);

  /* ===================== FILTERING ===================== */
  let filteredBooks = books;
  if (filterCategories.length) {
    filteredBooks = filteredBooks.filter((b) =>
      filterCategories.includes(b.category || "Uncategorized")
    );
  }
  if (lowStockOnly) {
    filteredBooks = filteredBooks.filter((b) => b.quantity < 5 && b.quantity > 0);
  }

  /* ===================== SORTING ===================== */
  const sortFields = { name: "name", qty: "quantity", price: "price", category: "category", status: "quantity" };
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const field = sortFields[sortConfig.key];
    const aVal = a[field] || "";
    const bVal = b[field] || "";
    if (sortConfig.direction === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  /* ===================== PAGINATION ===================== */
  const totalPages = Math.ceil(sortedBooks.length / limit);
  const currentBooks = sortedBooks.slice(page * limit, page * limit + limit);

  /* ===================== SEARCH ===================== */
  const searchData = async (e) => {
    const key = e.target.value.toLowerCase();
    if (!key) return fetchBooks();
    setBooks((prev) =>
      prev.filter((b) =>
        [b.name, b.category, b.quantity, b.price].map(String).some((v) => v.toLowerCase().includes(key))
      )
    );
  };

  /* ===================== DELETE ===================== */
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/products/delete/${id}`);
      toast.success("Deleted!");
      fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete book.");
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  /* ===================== BULK DELETE ===================== */
  const bulkDelete = async () => {
    if (!selectedBooks.length) return;
    setLoading(true);
    try {
      await Promise.all(selectedBooks.map((id) => API.delete(`/products/delete/${id}`)));
      toast.success("Selected books deleted!");
      fetchBooks();
      setSelectedBooks([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete selected books.");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== EXPORT CSV ===================== */
  const exportCSV = () => {
    const rows = [["Name", "Category", "Quantity", "Price"], ...books.map((b) => [b.name, b.category, b.quantity, b.price])];
    const csv = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "books.csv";
    a.click();
    toast.success("CSV exported!");
  };

  /* ===================== SORT BUTTON ===================== */
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc" });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="space-y-8 relative">
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center p-6 bg-blue-700 text-white rounded-2xl shadow">
        <h2 className="text-3xl font-bold">📚 Book Management</h2>
        <div className="flex gap-3">
          <input onChange={searchData} placeholder="Search..." className="px-4 py-2 rounded-lg text-gray-800" />
          <button onClick={exportCSV} className="px-3 py-2 bg-green-500 rounded-lg flex items-center gap-2">
            <FaFileCsv /> CSV
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          ["Total Stock", totalStock],
          ["Low Stock", lowStock],
          ["Out of Stock", outStock],
          ["Total Value", `$${totalValue.toFixed(2)}`],
          ["Highest Price", `$${highestPrice}`],
          ["Lowest Stock Book", lowestStockBook?.name],
          ["Categories", categories.length],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-600">
            <p className="text-gray-500">{label}</p>
            <p className="text-2xl font-bold mt-2">{typeof value === "number" ? <CountUp end={value} /> : value}</p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setFilterCategories((prev) =>
                prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
              )
            }
            className={`px-3 py-1 rounded-full text-sm ${
              filterCategories.includes(cat) ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lowStockOnly} onChange={() => setLowStockOnly(!lowStockOnly)} />
          Low Stock Only
        </label>

        {selectedBooks.length > 0 && (
          <button onClick={bulkDelete} className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
            <FaTrash /> Delete Selected
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-2xl overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={currentBooks.length && selectedBooks.length === currentBooks.length}
                  onChange={(e) =>
                    setSelectedBooks(e.target.checked ? currentBooks.map((b) => b._id) : [])
                  }
                />
              </th>
              {[
                ["Image", ""],
                ["Name", "name"],
                ["Qty", "qty"],
                ["Price", "price"],
                ["Category", "category"],
                ["Status", "status"],
                ["Actions", ""],
              ].map(([label, key]) => (
                <th key={label} className="p-3 cursor-pointer" onClick={() => key && handleSort(key)}>
                  <div className="flex items-center justify-center gap-1">
                    {label}
                    {sortConfig.key === key ? (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />) : key && <FaSort />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentBooks.length ? (
              currentBooks.map((book) => (
                <tr
                  key={book._id}
                  className={`border-t ${
                    book.quantity === 0 ? "bg-red-50" : book.quantity < 5 ? "bg-amber-50" : ""
                  }`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book._id)}
                      onChange={(e) =>
                        setSelectedBooks((prev) =>
                          e.target.checked ? [...prev, book._id] : prev.filter((id) => id !== book._id)
                        )
                      }
                    />
                  </td>

                  <td>
                    <img
                      onClick={() => setViewImage(`http://localhost:3000/uploads/${book.prImg}`)}
                      src={`http://localhost:3000/uploads/${book.prImg}`}
                      className="w-14 h-14 rounded-lg mx-auto cursor-pointer"
                    />
                  </td>

                  <td>{book.name}</td>
                  <td>{book.quantity}</td>
                  <td>${book.price}</td>
                  <td>{book.category}</td>

                  <td>
                    {book.quantity === 0 ? (
                      <FaTimesCircle className="text-red-600" />
                    ) : book.quantity < 5 ? (
                      <FaExclamationTriangle className="text-amber-600" />
                    ) : (
                      <FaCheckCircle className="text-green-600" />
                    )}
                  </td>

                  <td className="space-x-3">
                    <Link to={`/update/book/${book._id}`}>
                      <i className="fa-solid fa-pen-to-square text-blue-600"></i>
                    </Link>
                    <i
                      onClick={() => setConfirmDelete(book._id)}
                      className="fa-solid fa-trash text-red-600 cursor-pointer"
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-10 text-gray-500">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2">
          <label>Books per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(0);
            }}
            className="border px-2 py-1 rounded"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${page === 0 ? "bg-gray-300" : "bg-blue-600 text-white"}`}
          >
            Prev
          </button>

          <span>
            Page {page + 1} of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${page >= totalPages - 1 ? "bg-gray-300" : "bg-blue-600 text-white"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* FAB */}
      <Link
        to="/add/book"
        className="fixed bottom-10 right-10 bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl hover:scale-110"
      >
        +
      </Link>

      {/* IMAGE VIEW */}
      {viewImage && (
        <div
          onClick={() => setViewImage(null)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <img src={viewImage} className="w-96 rounded-xl shadow-lg border-4 border-white" />
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-80">
            <h3>Delete this book?</h3>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 rounded border">
                Cancel
              </button>
              <button onClick={() => deleteProduct(confirmDelete)} className="px-5 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default BookTable;
