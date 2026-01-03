import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiRefreshCw, FiTrash2, FiPlus } from "react-icons/fi";

function AddCategory() {
  const [tab, setTab] = useState("add");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [deleted, setDeleted] = useState([]);

  const API = "http://localhost:3000/api/categories";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/read`);
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchDeleted = async () => {
    try {
      const res = await axios.get(`${API}/deleted`);
      setDeleted(res.data);
    } catch {
      toast.error("Failed to load deleted categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDeleted();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name required");

    try {
      await axios.post(`${API}/create`, { name });
      toast.success("Category added");
      setName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Move to recycle bin?")) return;

    try {
      await axios.delete(`${API}/delete/${id}`);
      toast.success("Moved to recycle bin");
      fetchCategories();
      fetchDeleted();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`${API}/restore/${id}`);
      toast.success("Category restored");
      fetchCategories();
      fetchDeleted();
    } catch {
      toast.error("Restore failed");
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("DELETE forever?")) return;

    try {
      await axios.delete(`${API}/permanent/${id}`);
      toast.success("Category deleted forever");
      fetchDeleted();
    } catch {
      toast.error("Permanent delete failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-orange-50 rounded-xl shadow space-y-6">
      <h2 className="text-3xl font-bold text-orange-600 text-center">
        Category Manager
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setTab("add")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "add"
              ? "bg-orange-500 text-white"
              : "bg-white border border-orange-300"
          }`}
        >
          <FiPlus className="inline mr-1" />
          Add
        </button>

        <button
          onClick={() => setTab("recycle")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "recycle"
              ? "bg-green-500 text-white"
              : "bg-white border border-green-300"
          }`}
        >
          <FiRefreshCw className="inline mr-1" />
          Recycle Bin
        </button>
      </div>

      {/* Add Category */}
      {tab === "add" && (
        <div className="space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category"
              className="flex-1 p-2 border rounded"
            />

            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-1">
              <FiPlus /> Add
            </button>
          </form>

          <ul className="space-y-3">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center p-3 bg-white rounded-xl border"
              >
                <span className="font-medium">{cat.name}</span>

                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <FiTrash2 /> Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recycle Bin */}
      {tab === "recycle" && (
        <div className="space-y-3">
          {deleted.length === 0 && (
            <p className="text-center text-gray-500">No deleted categories</p>
          )}

          {deleted.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-center p-3 bg-white rounded-xl border"
            >
              <span className="font-medium text-green-700">{cat.name}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(cat._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <FiRefreshCw /> Restore
                </button>

                <button
                  onClick={() => handlePermanentDelete(cat._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </li>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddCategory;
