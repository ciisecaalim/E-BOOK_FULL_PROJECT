import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function BookForm() {
  const [name, setName] = useState("");
  const [img, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/categories/all");
        const catNames = res.data.map((c) =>
          typeof c === "string" ? c : c.name
        );
        setCategories(catNames);
      } catch {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Validation
  useEffect(() => {
    const newErrors = {};
    if (!/^[A-Za-z ]+$/.test(name)) newErrors.name = "Letters only";
    if (quantity <= 0) newErrors.quantity = "Must be greater than 0";
    if (price <= 0) newErrors.price = "Must be greater than 0";
    if (!category || !categories.includes(category))
      newErrors.category = "Invalid category selected";

    if (!img) newErrors.img = "Image required";
    else {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(img.type)) newErrors.img = "Only JPG, JPEG, PNG";
      if (img.size > 2 * 1024 * 1024) newErrors.img = "Max size 2MB";
    }

    setErrors(newErrors);
  }, [name, quantity, price, category, img, categories]);

  const handleImage = (file) => {
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      toast.error("Fix validation errors first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("img", img);

    try {
      await axios.post(
        "http://localhost:3000/api/products/create/product",
        formData
      );
      toast.success("Success register");
      navigate("/dash/books");
    } catch {
      toast.error("Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full border rounded p-2 ${
      errors[key] ? "border-red-500" : "border-green-500"
    }`;

  return (
    <form
      onSubmit={handlePost}
      encType="multipart/form-data"
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
        Register a Book
      </h2>

      {/* NAME */}
      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      {/* QUANTITY */}
      <div>
        <label className="block mb-1 font-medium">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={inputClass("quantity")}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity}</p>
        )}
      </div>

      {/* PRICE */}
      <div>
        <label className="block mb-1 font-medium">Price ($)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass("price")}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price}</p>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block mb-2 font-semibold text-purple-700 text-lg">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputClass("category")} rounded-lg`}
        >
          <option value="">Select category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}
      </div>

      {/* IMAGE */}
      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
          className={inputClass("img")}
        />
        {errors.img && <p className="text-red-500 text-sm">{errors.img}</p>}
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="preview"
            className="w-32 h-32 object-cover rounded shadow"
          />
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading || Object.keys(errors).length > 0}
        className={`w-full text-white p-2 rounded ${
          loading || Object.keys(errors).length > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {loading ? "Processing..." : "Register product"}
      </button>
    </form>
  );
}

export default BookForm;
