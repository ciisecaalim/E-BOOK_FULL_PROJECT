import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";

function CustomerUpdateForm() {
  const [customerName, setCustomerName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  function getAll() {
    axios
      .get(`http://localhost:5000/read/customer/${params.id}`)
      .then((res) => {
        const data = res.data[0];
        setCustomerName(data.customerName);
        setGmail(data.gmail);
        setPhone(data.phone);
        setAddress(data.address);
      })
      .catch((err) => {
        console.error("Failed to load customer", err);
        toast.error("Failed to load customer data");
      });
  }

  function updateCustomer () {
  axios.put(`http://localhost:5000/update/customer/${params.id}`,{
    "customerName":customerName,
    "gmail":gmail,
    "phone":phone,
    "address":address
  }).then(() => {
    navigate("/dash/customers")
    toast.update("updated successfully")
    
  })
  }

  useEffect(() => {
    getAll();
  }, []);

  function handleUpdate(e) {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/update/customer/${params.id}`, {
        customerName,
        gmail,
        phone,
        address,
      })
      .then(() => {
        toast.success("Customer updated successfully");
        navigate("/");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update customer");
      });
  }

  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
        Update Customer
      </h2>

      <div>
        <label className="block mb-1 font-medium">Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Gmail</label>
        <input
          type="email"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Address</label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <button
        type="submit"
        onClick={handleUpdate}
        className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
      >
        Update Customer
      </button>
    </form>
  );
}

export default CustomerUpdateForm;
