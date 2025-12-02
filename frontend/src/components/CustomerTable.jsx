import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaPen, FaUserAlt } from "react-icons/fa";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const readAll = () => {
    axios
      .get("http://localhost:3000/api/customers/read")
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Failed to fetch customers"));
  };

  const deleteCustomer = (id) => {
    axios
      .delete(`http://localhost:3000/api/customers/delete/${id}`)
      .then(() => {
        toast.success("Customer deleted successfully");
        readAll();
      })
      .catch(() => toast.error("Error deleting customer"));
  };

  useEffect(() => {
    readAll();
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-orange-600 flex items-center gap-2">
          <FaUserAlt /> Customer List
        </h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 mt-3 md:mt-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left required:">Name</th>
              <th className="p-3 text-left required:">Email</th>
              <th className="p-3 text-left required:">Phone</th>
              <th className="p-3 text-left required:">Address</th>
              <th className="p-3 text-left required:">Created</th>
              <th className="p-3 text-center required:">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((customer, index) => (
                <tr
                  key={customer._id}
                  className="border-b hover:bg-orange-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold text-gray-800">
                    {customer.name}
                  </td>
                  <td className="p-3">{customer.email}</td>
                  <td className="p-3">{customer.phone}</td>
                  <td className="p-3">{customer.address}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center flex justify-center gap-4">
                    <Link
                      to={`/update/customer/${customer._id}`}
                      
                    >
                       
                    </Link>
                    <button
                      onClick={() => deleteCustomer(customer._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerTable;
