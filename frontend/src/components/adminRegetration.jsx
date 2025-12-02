import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminRegister() {
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/admin/register", {
        name: adminName,
        email,
        password,
      });

      toast.success("Admin registered successfully!");
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      navigate("/loginDash");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-green-600">
          Admin Registration
        </h2>

        <input
          placeholder="Name"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="w-full border p-3 rounded"
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Register Admin
        </button>
      </form>
    </div>
  );
}

export default AdminRegister;
