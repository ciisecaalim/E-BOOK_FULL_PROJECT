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
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`http://localhost:3000/api/products/read/product`);
      setBooks(res.data);
    } catch (err) {
      setError("⚠️ Failed to load books. Check server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Toast notifications for low/out-of-stock
  useEffect(() => {
    books.forEach((book) => {
      if (book.quantity === 0) {
        toast.error(`❌ "${book.name}" is Out of Stock!`);
      } else if (book.quantity > 0 && book.quantity < 5) {
        toast.warn(`⚠️ "${book.name}" is Low on Stock (${book.quantity} left)`);
      }
    });
  }, [books]);

  // Stats
  const totalStock = books.reduce((s, b) => s + Number(b.quantity || 0), 0);
  const lowStock = books.filter((b) => b.quantity > 0 && b.quantity < 5).length;
  const outStock = books.filter((b) => b.quantity === 0).length;
  const totalValue = books.reduce((s, b) => s + Number(b.quantity || 0) * Number(b.price || 0), 0);
  const highestPrice = Math.max(...books.map((b) => Number(b.price || 0)), 0);
  const lowestStockBook = books.reduce((min, b) => b.quantity < min.quantity ? b : min, books[0] || { quantity: 0 });

  // Categories
  const categoryCounts = books.reduce((acc, b) => {
    const k = b.category || "Uncategorized";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(categoryCounts);

  // Filter
  let filteredBooks = books;
  if (filterCategories.length) {
    filteredBooks = filteredBooks.filter((b) => filterCategories.includes(b.category || "Uncategorized"));
  }
  if (lowStockOnly) {
    filteredBooks = filteredBooks.filter((b) => b.quantity > 0 && b.quantity < 5);
  }

  // Sort
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key] || "";
    const bVal = b[sortConfig.key] || "";
    if (sortConfig.direction === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedBooks.length / limit);
  const start = page * limit;
  const currentBooks = sortedBooks.slice(start, start + limit);

  // Search
  const searchData = (e) => {
    const key = e.target.value.toLowerCase();
    if (!key) return fetchBooks();
    setBooks((prev) =>
      prev.filter((b) =>
        [b.name, b.category, String(b.quantity), String(b.price)]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(key))
      )
    );
  };

  // Delete
  const deleteProduct = (id) => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/api/products/delete/product/${id}`)
      .then(() => {
        setConfirmDelete(null);
        toast.success("✅ Book deleted successfully!");
        fetchBooks();
      })
      .catch(() => toast.error("❌ Error deleting product"))
      .finally(() => setLoading(false));
  };

  // Bulk Delete
  const bulkDelete = () => {
    if (!selectedBooks.length) return;
    setLoading(true);
    Promise.all(selectedBooks.map((id) =>
      axios.delete(`http://localhost:3000/api/products/delete/product/${id}`)
    ))
      .then(() => {
        setSelectedBooks([]);
        toast.success("✅ Selected books deleted!");
        fetchBooks();
      })
      .finally(() => setLoading(false));
  };

  // Export CSV
  const exportCSV = () => {
    const csvRows = [
      ["Name", "Category", "Quantity", "Price"],
      ...books.map(b => [b.name, b.category, b.quantity, b.price])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "books.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("📄 CSV exported successfully!");
  };

  // Handle Sorting
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc" });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Loading */}
      {loading && <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>}

      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl shadow text-white">
        <h2 className="text-3xl font-bold">📚 Book Management</h2>
        <div className="flex gap-3 flex-wrap">
          <input onChange={searchData} placeholder="🔍 Search..." className="px-4 py-2 rounded-lg text-gray-800 outline-none focus:ring-2 ring-indigo-400"/>
          <button onClick={exportCSV} className="px-3 py-2 bg-green-500 rounded-lg flex items-center gap-2 hover:bg-green-600">
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Stock", value: totalStock, color: "text-blue-700" },
          { label: "Low Stock", value: lowStock, color: "text-amber-600" },
          { label: "Out of Stock", value: outStock, color: "text-red-600" },
          { label: "Total Value", value: `$${totalValue.toFixed(2)}`, color: "text-green-600" },
          { label: "Highest Price", value: `$${highestPrice}`, color: "text-purple-700" },
          { label: "Lowest Stock Book", value: lowestStockBook?.name || "N/A", color: "text-pink-600" },
          { label: "Total Categories", value: categories.length, color: "text-teal-600" },
          { label: "Out of Stock %", value: books.length ? `${((outStock / books.length) * 100).toFixed(1)}%` : "0%", color: "text-red-500" },
        ].map(item => (
          <div key={item.label} className="rounded-2xl bg-white shadow-md p-6 hover:scale-[1.03] transition-transform border-l-4 border-blue-600">
            <p className="text-gray-500">{item.label}</p>
            <p className={`text-2xl font-bold mt-2 ${item.color}`}><CountUp end={typeof item.value === 'number' ? item.value : 0} duration={1} /> {typeof item.value === 'string' ? item.value : ''}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap items-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                if (filterCategories.includes(cat)) {
                  setFilterCategories(filterCategories.filter(c => c !== cat));
                } else {
                  setFilterCategories([...filterCategories, cat]);
                }
              }}
              className={`px-3 py-1 rounded-full border text-sm ${filterCategories.includes(cat) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              {cat} {filterCategories.includes(cat) && "x"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lowStockOnly} onChange={()=>setLowStockOnly(!lowStockOnly)} />
          Show Low Stock Only
        </label>
        {selectedBooks.length > 0 && <button onClick={bulkDelete} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"><FaTrash /> Delete Selected</button>}
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-sm sticky top-0 z-10">
            <tr>
              <th className="p-3">
                <input type="checkbox" checked={selectedBooks.length===currentBooks.length && currentBooks.length>0} onChange={(e)=> {
                  if(e.target.checked) setSelectedBooks(currentBooks.map(b=>b._id));
                  else setSelectedBooks([]);
                }} />
              </th>
              {["Image","Name","Qty","Price","Category","Status","Actions"].map((head,key)=>(
                <th key={key} className="p-3 cursor-pointer" onClick={()=>handleSort(head.toLowerCase())}>
                  <div className="flex items-center justify-center gap-1">
                    {head}
                    {sortConfig.key===head.toLowerCase() ? sortConfig.direction==='asc'?<FaSortUp/>:<FaSortDown/>:<FaSort/>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentBooks.length ? currentBooks.map((book,i)=>(
              <tr key={book._id} className={`border-t transition-all duration-200 hover:bg-gray-50 ${book.quantity<5?'bg-amber-50 animate-pulse':book.quantity===0?'bg-red-50 animate-pulse':''}`}>
                <td><input type="checkbox" checked={selectedBooks.includes(book._id)} onChange={(e)=>{
                  if(e.target.checked) setSelectedBooks(prev=>[...prev,book._id]);
                  else setSelectedBooks(prev=>prev.filter(id=>id!==book._id));
                }} /></td>
                <td><img onClick={()=>setViewImage(`http://localhost:3000/allImg/${book.prImg}`)} src={`http://localhost:3000/allImg/${book.prImg}`} alt={book.name} className="w-14 h-14 mx-auto rounded-lg cursor-pointer hover:scale-105 transition-transform"/></td>
                <td>{book.name}</td>
                <td>{book.quantity}</td>
                <td>${book.price}</td>
                <td>{book.category}</td>
                <td className="flex justify-center items-center gap-2">
                  {book.quantity===0?<FaTimesCircle className="text-red-600"/>:book.quantity<5?<FaExclamationTriangle className="text-amber-500"/>:<FaCheckCircle className="text-green-600"/>}
                </td>
                <td className="space-x-3">
                  <Link to={`/update/book/${book._id}`}><i className="fa-solid fa-pen-to-square text-blue-600 cursor-pointer"></i></Link>
                  <i onClick={()=>setConfirmDelete(book._id)} className="fa-solid fa-trash text-red-600 cursor-pointer"></i>
                </td>
              </tr>
            )) : <tr><td colSpan="8" className="p-10 text-gray-500">No books found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2">
          <label>Books per page:</label>
          <select value={limit} onChange={(e)=>{setLimit(Number(e.target.value)); setPage(0);}} className="border px-2 py-1 rounded-lg">
            {[10,20,50,100].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} className={`px-3 py-1 rounded ${page===0?'bg-gray-300':'bg-blue-600 text-white'}`}>Prev</button>
          <span>Page {page+1} of {totalPages || 1}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} className={`px-3 py-1 rounded ${page>=totalPages-1?'bg-gray-300':'bg-blue-600 text-white'}`}>Next</button>
        </div>
      </div>

      {/* Add Button */}
      <Link to="/add/book" className="fixed bottom-10 right-10 bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl hover:scale-110 transition">+</Link>

      {/* Image Modal */}
      {viewImage && <div onClick={()=>setViewImage(null)} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><img src={viewImage} alt="preview" className="w-96 h-auto rounded-lg shadow-lg border-4 border-white"/></div>}

      {/* Confirm Delete */}
      {confirmDelete && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4 w-80">
          <h3>Are you sure you want to delete this book?</h3>
          <div className="flex justify-center gap-4">
            <button onClick={()=>setConfirmDelete(null)} className="px-5 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
            <button onClick={()=>deleteProduct(confirmDelete)} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default BookTable;
