import { useState } from "react";

function AddOrder() {
  const [custName, setCustName] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");
  const [book, setBook] = useState("");

  console.log(status);

  return (
    <form
      action="/submit-book"
      method="POST"
      encType="multipart/form-data"
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
        Register an Order
      </h2>

      {/* Customer Name */}
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={custName}
          onChange={(e) => setCustName(e.target.value)}
          name="custName"
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      {/* Address */}
      <div>
        <label className="block mb-1 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      {/* Number */}
      <div>
        <label className="block mb-1 font-medium">Number</label>
        <input
          type="text"
          name="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      {/* Status */}
      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Select status</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {/* Book */}
      <div>
        <label className="block mb-1 font-medium">Book</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          required
        >
          <option value="">Choose book</option>
          <option value="History">History</option>
          <option value="Science">Science</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
      >
        Register Order
      </button>
    </form>
  );
}

export default AddOrder;
