import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBookForm() {
  const [name, setName] = useState("");
  const [img, setImage] = useState(null); // string (existing) or File (new)
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  // Fetch single product
  const fetchSingleProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/products/single/${params.id}`);
      const product = res.data;

      if (!product) throw new Error("Product not found");

      setName(product.name || "");
      setQuantity(product.quantity || 0);
      setPrice(product.price || 0);
      setCategory(product.category || "");
      setImage(product.prImg || null);
    } catch (err) {
      console.error(err);
      alert("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("category", category);

      if (img && typeof img !== "string") formData.append("img", img);

      const token = JSON.parse(localStorage.getItem("admin"))?.token;

      await axios.put(
        `http://localhost:3000/api/products/update/${params.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product updated successfully!");
      navigate("/dash/books");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (img && typeof img !== "string") URL.revokeObjectURL(img);
    };
  }, [img]);

  useEffect(() => {
    fetchSingleProduct();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10">
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/dash/books")}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-white shadow-sm rounded-full border hover:bg-gray-100 transition"
      >
        <span className="text-xl">←</span>
        <span className="font-medium text-gray-700">Back</span>
      </button>

      <form
        onSubmit={handleUpdate}
        className="p-6 bg-white rounded-2xl shadow-xl space-y-4 border"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
          Update Book
        </h2>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg p-2"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {img && typeof img === "string" && (
            <img
              src={`http://localhost:3000/allImg/${img}`}
              alt="Preview"
              className="w-40 mt-3 rounded-xl shadow"
            />
          )}

          {img && typeof img !== "string" && (
            <img
              src={URL.createObjectURL(img)}
              alt="Preview"
              className="w-40 mt-3 rounded-xl shadow"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 font-semibold"
        >
          Update Book
        </button>
      </form>
    </div>
  );
}

export default UpdateBookForm;
