import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HeaderBookStore from "./Header";

function CustomerRegistrationForm() {
  const [customerName, setCustomerName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const validate = () => {
    if (!/^[A-Za-z ]{3,}$/.test(customerName.trim())) { toast.error("Name must be at least 3 letters"); return false; }
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(gmail)) { toast.error("Invalid email"); return false; }
    if (!/^\d{8,}$/.test(phone.trim())) { toast.error("Phone must be >= 8 digits"); return false; }
    if (address.trim().length < 5) { toast.error("Address must be >=5 chars"); return false; }
    if (password.length < 8) { toast.error("Password must >=8 chars"); return false; }
    return true;
  };

  const handleInsert = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { name: customerName, email: gmail, phone, address, password };

    try {
      const res = await axios.post("http://localhost:3000/api/customers/create", payload);

      // ✅ Kaydi xogta customer localStorage
      localStorage.setItem("customerEmail", res.data.email);
      localStorage.setItem("customerData", JSON.stringify(res.data));

      toast.success("Customer registered successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div>
      <HeaderBookStore />
      <form onSubmit={handleInsert} className="max-w-md mx-auto p-6 mt-28 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">Customer Registration</h2>
        <div>
          <label>Name</label>
          <input ref={nameRef} type="text" value={customerName} onChange={(e)=>setCustomerName(e.target.value)}
            className="w-full border p-2 rounded" required/>
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={gmail} onChange={(e)=>setGmail(e.target.value)}
            className="w-full border p-2 rounded" required/>
        </div>
        <div>
          <label>Phone</label>
          <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)}
            className="w-full border p-2 rounded" required/>
        </div>
        <div>
          <label>Address</label>
          <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)}
            className="w-full border p-2 rounded" required/>
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
            className="w-full border p-2 rounded" required/>
        </div>
        <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default CustomerRegistrationForm;
