import axios from "axios";
import { useEffect, useState } from "react";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [deleted, setDeleted] = useState([]);

  const API = "http://localhost:3000/api/categories";

  useEffect(() => {
    const load = async () => {
      const active = await axios.get(`${API}/read`);
      const del = await axios.get(`${API}/deleted`);
      setCategories(active.data);
      setDeleted(del.data);
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-orange-600">All Categories</h2>

      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c._id} className="p-3 bg-orange-50 rounded border">
            {c.name}
          </li>
        ))}
      </ul>

      
    </div>
  );
}

export default CategoryList;
