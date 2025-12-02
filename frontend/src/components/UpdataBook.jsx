import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBookForm() {
    const [name, setName] = useState('');
    const [img, setImage] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

    const params = useParams();
    const navigate = useNavigate();

    const handleSingleData = () => {
        axios.get(`http://localhost:3000/api/products/read/singleproduct/${params.id}`)
            .then((res) => {
                setName(res.data.name);
                setQuantity(res.data.quantity);
                setPrice(res.data.price);
                setCategory(res.data.category);
                setImage(res.data.prImg);
            });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("category", category);
        if (img) {
            formData.append("img", img);
        }

        axios.put(`http://localhost:3000/api/products/update/product/${params.id}`, formData)
            .then(() => {
                alert("Successfully updated");
                navigate("/dash/books");
            })
            .catch((error) => {
                console.error("Error updating product:", error);
                alert("Failed to update product");
            });
    };

    useEffect(() => {
        handleSingleData();
    }, []);

    return (
        <div className="max-w-lg mx-auto mt-10">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate("/dash/books")}
                className="flex items-center gap-2 mb-6 px-4 py-2 
                bg-white shadow-sm rounded-full border 
                hover:bg-gray-100 transition"
            >
                <span className="text-xl">←</span>
                <span className="font-medium text-gray-700">Back</span>
            </button>

            <form className="p-6 bg-white rounded-2xl shadow-xl space-y-4 border">
                <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
                    Update Book
                </h2>

                {/* NAME */}
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* QUANTITY */}
                <div>
                    <label className="block mb-1 font-medium">Quantity</label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                {/* PRICE */}
                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                {/* CATEGORY */}
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                {/* IMAGE */}
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
                            className="w-40 mt-3 rounded-xl shadow"
                            src={`http://localhost:3000/allImg/${img}`}
                            alt="Preview"
                        />
                    )}
                </div>

                {/* UPDATE BTN */}
                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 font-semibold"
                    onClick={handleUpdate}
                >
                    Update Book
                </button>
            </form>
        </div>
    );
}

export default UpdateBookForm;
