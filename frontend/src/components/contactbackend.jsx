import React, { useEffect, useState } from "react";
import { FaTrash, FaEye, FaUndo, FaArrowDown, FaArrowUp } from "react-icons/fa";

function ContactsDashboard() {
  const [contacts, setContacts] = useState([]);
  const [recycleBin, setRecycleBin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("inbox");
  const [animatingId, setAnimatingId] = useState(null);

  const perPage = 5;

  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/contact/all");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data.filter(c => !c.deleted));
      setLoading(false);
    } catch {
      setError("Network error");
    }
  };

  const fetchRecycleBin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/contact/recyclebin");
      const data = await res.json();
      setRecycleBin(data);
    } catch {}
  };

  useEffect(() => {
    fetchContacts();
    fetchRecycleBin();
  }, []);

  const filteredContacts = (view === "inbox" ? contacts : recycleBin).filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * perPage;
  const pageData = filteredContacts.slice(start, start + perPage);
  const pages = Math.ceil(filteredContacts.length / perPage);

  const toggleStatus = async (id, newStatus) => {
    setAnimatingId(id);
    await fetch(`http://localhost:3000/api/contact/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchContacts();
    setTimeout(() => setAnimatingId(null), 700);
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`http://localhost:3000/api/contact/${id}`, { method: "DELETE" });
    fetchContacts();
    fetchRecycleBin();
  };

  const restoreContact = async (id) => {
    await fetch(`http://localhost:3000/api/contact/restore/${id}`, { method: "PUT" });
    fetchContacts();
    fetchRecycleBin();
  };

  if (loading) return <p className="text-center mt-10 text-purple-600 font-semibold animate-pulse">Loading messages...</p>;
  if (error) return <p className="text-center mt-10 text-red-600 font-semibold">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">

      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-purple-700 drop-shadow-lg animate-fadeIn">
        {view === "inbox" ? "Contact Messages" : "Recycle Bin"}
      </h1>

      {/* Search + Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 w-full">
        <input
          type="text"
          placeholder="Search messages..."
          className="border border-purple-300 p-2 rounded-lg w-full md:w-72 shadow-sm focus:ring-2 focus:ring-purple-400 transition duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-3 w-full md:w-auto justify-center md:justify-start">
          <button
            className={`px-5 py-2 rounded-lg transition-all font-semibold ${
              view === "inbox" ? "bg-purple-700 text-white shadow-md scale-105" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setView("inbox")}
          >
            Inbox ({contacts.length})
          </button>
          <button
            className={`px-5 py-2 rounded-lg transition-all font-semibold ${
              view === "recycle" ? "bg-purple-700 text-white shadow-md scale-105" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setView("recycle")}
          >
            Recycle Bin ({recycleBin.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-xl rounded-xl border border-purple-300 max-h-[600px]">
        <table className="w-full min-w-[900px] table-auto bg-white">
          <thead className="bg-purple-700 text-white text-sm uppercase tracking-wide sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left w-[15%]">Name</th>
              <th className="p-3 text-left w-[20%]">Email</th>
              <th className="p-3 text-left w-[15%]">Subject</th>
              <th className="p-3 text-left w-[25%]">Message</th>
              <th className="p-3 text-left w-[10%]">Date</th>
              {view === "inbox" && <th className="p-3 text-left w-[10%]">Status</th>}
              <th className="p-3 text-center w-[15%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((c, index) => (
              <tr
                key={c._id}
                className={`border-b transition-all hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 animate-fadeIn`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="p-3 font-semibold text-purple-700">{c.firstName} {c.lastName}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3 font-medium">{c.subject}</td>
                <td className="p-3 truncate max-w-[250px]">{c.message}</td>
                <td className="p-3 text-sm text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</td>

                {/* Status */}
                {view === "inbox" && (
                  <td className="p-3 flex items-center gap-2">
                    {c.status === "read" && <span className="text-green-600 font-bold text-lg">✅</span>}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        c.status === "unread"
                          ? "bg-purple-100 text-purple-700 border border-purple-300"
                          : "bg-green-100 text-green-700 border border-green-300"
                      }`}
                    >
                      {c.status}
                    </span>
                    <select
                      className={`ml-2 px-2 py-1 border rounded-lg shadow-sm cursor-pointer transition-all duration-500 transform ${
                        animatingId === c._id ? "bg-yellow-200 scale-105 shadow-lg" : "bg-white scale-100"
                      }`}
                      value={c.status}
                      onChange={(e) => toggleStatus(c._id, e.target.value)}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                  </td>
                )}

                {/* Actions */}
                <td className="p-3 flex gap-2 items-center justify-center">
                  <button
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md hover:scale-110 w-10 h-10 flex items-center justify-center"
                    onClick={() => setSelected(c)}
                  >
                    <FaEye />
                  </button>

                  {view === "inbox" ? (
                    <button
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md hover:scale-110 w-10 h-10 flex items-center justify-center"
                      onClick={() => deleteContact(c._id)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <>
                      <button
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:scale-110 w-10 h-10 flex items-center justify-center"
                        onClick={() => restoreContact(c._id)}
                      >
                        <FaUndo />
                      </button>
                      <button
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md hover:scale-110 w-10 h-10 flex items-center justify-center"
                        onClick={() => deleteContact(c._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-200 transition"
        >
          <FaArrowUp />
        </button>
        <span className="px-4 py-1 text-purple-700 font-semibold">{page} / {pages}</span>
        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-200 transition"
        >
          <FaArrowDown />
        </button>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto animate-fadeIn">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Message Details</h2>
            <p><strong>Name:</strong> {selected.firstName} {selected.lastName}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Subject:</strong> {selected.subject}</p>
            <p className="mt-2"><strong>Message:</strong><br />{selected.message}</p>
            <p className="mt-2"><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            <button
              className="mt-4 px-5 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition shadow-md w-full"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ContactsDashboard;
