import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function BookForm() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem("admin")); // expects { token, user: {role,...} }
  const token = adminData?.token || null;
  const role = adminData?.user?.role || null;

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    if (role !== "admin") return; // only admin can fetch categories

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/categories/read", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data); // expects array of { _id, name }
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [role, token]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = "Name is required";
    else if (!/^[A-Za-z ]+$/.test(name)) err.name = "Letters only";

    if (!quantity || quantity <= 0) err.quantity = "Quantity must be greater than 0";
    if (!price || price <= 0) err.price = "Price must be greater than 0";
    if (!category) err.category = "Select a category";
    if (!img) err.img = "Image is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= IMAGE CHANGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    setImg(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role !== "admin") {
      toast.error("Unauthorized! Only admin can add products.");
      return;
    }

    if (!validate()) return toast.error("Fix form errors");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("category", category); 
    formData.append("img", img);

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product added successfully");
      navigate("/dash");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Unauthorized! Please login as admin.");
      } else {
        toast.error("Error creating product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-xl font-semibold text-gray-700">Add New Product</h2>

        {/* NAME */}
        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        {/* QUANTITY */}
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 w-full rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}

        {/* PRICE */}
        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}

        {/* CATEGORY */}
        <select
          className="border p-2 w-full rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500">{errors.category}</p>}

        {/* IMAGE */}
        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 object-cover rounded mt-2"
          />
        )}
        {errors.img && <p className="text-red-500">{errors.img}</p>}

        {/* SUBMIT */}
        <button
          disabled={loading || role !== "admin"}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default BookForm;
