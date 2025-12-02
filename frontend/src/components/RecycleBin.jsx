import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi"; // Icons

function RecycleBin() {
  const [deletedBooks, setDeletedBooks] = useState([]);

  // Fetch all soft-deleted books
  const fetchDeletedBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products/deleted/products");
      setDeletedBooks(res.data);
    } catch (error) {
      toast.error("Failed to fetch deleted books");
    }
  };

  useEffect(() => {
    fetchDeletedBooks();
  }, []);

  // Restore a deleted book
  const handleRestore = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/products/restore/product/${id}`);
      toast.success("Book restored successfully");
      fetchDeletedBooks();
    } catch (error) {
      toast.error("Restore failed");
    }
  };

  // Permanently delete a book
  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this book?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/permanent/product/${id}`);
      toast.success("Book permanently deleted");
      fetchDeletedBooks();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-white/90 to-blue-50 rounded-2xl shadow-xl space-y-6 border border-blue-200">
      <h2 className="text-3xl font-extrabold text-blue-600 text-center tracking-wide">
        📦 Recycle Bin - Deleted Books
      </h2>

      {deletedBooks.length === 0 ? (
        <p className="text-center text-gray-400 mt-4">No deleted books</p>
      ) : (
        <ul className="space-y-3">
          {deletedBooks.map((book) => (
            <li
              key={book._id}
              className="flex justify-between items-center p-3 bg-white rounded-xl shadow hover:shadow-lg transition border border-blue-100"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`http://localhost:3000/allImg/${book.prImg}`}
                  alt={book.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <span className="font-medium text-blue-700">{book.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(book._id)}
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 hover:scale-105 transition transform"
                >
                  <FiRefreshCw />
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(book._id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 hover:scale-105 transition transform"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecycleBin;
