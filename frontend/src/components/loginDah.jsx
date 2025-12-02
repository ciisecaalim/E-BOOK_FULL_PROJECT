import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function LoginDash() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter email and password",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/admin/login", { email, password });

      const user = res.data.user;
      if (!user) throw new Error("No user returned from backend");

      if (user.role === "admin") {
        localStorage.setItem("admin", JSON.stringify({ token: res.data.token, user }));
        navigate("/dash");
      } else {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Not allowed 👎",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.error || err.message || "Email or password is incorrect ❌",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-lg shadow-lg space-y-6 w-96">
        <h2 className="text-2xl font-bold text-center text-green-600">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginDash;
