import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiRefreshCw, FiTrash2, FiPlus } from "react-icons/fi";

function AddCategory() {
  const [tab, setTab] = useState("add"); // "add" or "recycle"
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [deleted, setDeleted] = useState([]);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3000/api/categories/all");
    setCategories(res.data);
  };

  const fetchDeleted = async () => {
    const res = await axios.get("http://localhost:3000/api/categories/deleted");
    setDeleted(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchDeleted();
  }, []);

  // Add new category
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name required");
    try {
      await axios.post("http://localhost:3000/api/categories/create", { name });
      toast.success("Category added");
      setName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  // Move to recycle bin
  const handleDelete = async (id) => {
    if (!window.confirm("Move to recycle bin?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/categories/delete/${id}`);
      toast.success("Moved to recycle bin");
      fetchCategories();
      fetchDeleted();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Restore from recycle bin
  const handleRestore = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/categories/restore/${id}`);
      toast.success("Category restored");
      fetchCategories();
      fetchDeleted();
    } catch {
      toast.error("Restore failed");
    }
  };

  // Permanent delete
  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this category?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/categories/permanent/${id}`);
      toast.success("Category permanently deleted");
      fetchDeleted();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-white/90 to-orange-50 rounded-2xl shadow-xl space-y-6 border border-orange-200">
      <h2 className="text-3xl font-extrabold text-orange-600 text-center tracking-wide">
        Category Manager
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setTab("add")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            tab === "add"
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-white text-orange-600 border border-orange-300 hover:bg-orange-100"
          }`}
        >
          <FiPlus className="inline mr-1" />
          Add
        </button>
        <button
          onClick={() => setTab("recycle")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            tab === "recycle"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-white text-green-600 border border-green-300 hover:bg-green-100"
          }`}
        >
          <FiRefreshCw className="inline mr-1" />
          Recycle Bin
        </button>
      </div>

      {/* Add Category Tab */}
      {tab === "add" && (
        <div className="space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category"
              className="flex-1 p-2 border rounded shadow-sm"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-1"
            >
              <FiPlus /> Add
            </button>
          </form>

          <ul className="space-y-3">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center p-3 bg-white rounded-xl shadow hover:shadow-lg transition border border-orange-100"
              >
                <span className="font-medium text-orange-700">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 hover:scale-105 transition transform"
                >
                  <FiTrash2 /> Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recycle Bin Tab */}
      {tab === "recycle" && (
        <div className="space-y-3">
          {deleted.length === 0 && (
            <p className="text-center text-gray-400 mt-4">No deleted categories</p>
          )}
          <ul className="space-y-3">
            {deleted.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center p-3 bg-white rounded-xl shadow hover:shadow-lg transition border border-green-100"
              >
                <span className="font-medium text-green-700">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(cat._id)}
                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 hover:scale-105 transition transform"
                  >
                    <FiRefreshCw /> Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(cat._id)}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 hover:scale-105 transition transform"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddCategory;
