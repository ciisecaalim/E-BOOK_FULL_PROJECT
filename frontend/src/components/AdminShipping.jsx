import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function AdminShipping() {
  const [shippingList, setShippingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ type: "", price: "" });

  // Get token & user from localStorage
  const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
  const token = adminData.token;
  const user = adminData.user;

  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      toast.error("Fadlan login samee sida admin");
    } else {
      loadShipping();
    }
  }, [token, user]);

  const loadShipping = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3000/api/shipping/read", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setShippingList(data);
    } catch {
      toast.error("Error loading shipping options");
    }
  };

  // Add new shipping option
  const handleAddNew = async () => {
    if (!newType.trim() || newPrice === "") {
      toast.error("Fadlan buuxi Type iyo Price");
      return;
    }
    if (Number(newPrice) < 0) {
      toast.error("Price waa inuu noqdaa ≥ 0");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/shipping/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: newType, price: Number(newPrice) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Added successfully");
        setShippingList(prev => [...prev, data]);
        setNewType("");
        setNewPrice("");
      } else {
        toast.error(data.error || "Add failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Delete shipping
  const handleDelete = async (id) => {
    if (!window.confirm("Ma hubtaa inaad tirtirto shipping option-ka?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/shipping/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        setShippingList(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // Start editing
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditValues({ type: item.type, price: item.price });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ type: "", price: "" });
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editValues.type.trim()) {
      toast.error("Type waa inaysan madhnayn");
      return;
    }
    if (Number(editValues.price) < 0 || isNaN(Number(editValues.price))) {
      toast.error("Price waa inuu noqdaa number ≥ 0");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/shipping/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: editValues.type, price: Number(editValues.price) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Updated successfully");
        setShippingList(prev => prev.map(item => (item._id === id ? data : item)));
        cancelEdit();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-xl font-bold">Add New Shipping Option</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Type e.g. Standard"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border px-2 py-1 rounded w-32"
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="border px-2 py-1 rounded w-20"
        />
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      <h2 className="text-xl font-bold">Shipping Options</h2>
      <ul className="space-y-2">
        {shippingList.map((s) => (
          <li key={s._id} className="flex justify-between items-center border-b py-2">
            {editingId === s._id ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={editValues.type}
                  onChange={(e) => setEditValues(prev => ({ ...prev, type: e.target.value }))}
                  className="border px-2 py-1 rounded w-32"
                />
                <input
                  type="number"
                  value={editValues.price}
                  onChange={(e) => setEditValues(prev => ({ ...prev, price: e.target.value }))}
                  className="border px-2 py-1 rounded w-20"
                />
                <button
                  onClick={() => saveEdit(s._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>{s.type} - ${s.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(s)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminShipping;
