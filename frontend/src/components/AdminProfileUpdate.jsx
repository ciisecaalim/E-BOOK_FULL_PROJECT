import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function AdminProfile() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({ name: "", email: "", avatar: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/profile/public");
      setAdmin(res.data);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Failed to fetch profile", "error");
    }
  };

  const validate = () => {
    let newErr = {};

    // Name: only letters + space
    if (!/^[A-Za-z ]+$/.test(admin.name.trim())) {
      newErr.name = "Name must contain letters only";
    }

    // Email: standard regex
    if (!admin.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErr.email = "Invalid email format";
    }

    // Avatar: allow only images + size limit check
    if (avatarFile) {
      if (!allowedTypes.includes(avatarFile.type)) {
        newErr.avatar = "Only JPG, PNG and WEBP images are allowed";
      }
      if (avatarFile.size > 2 * 1024 * 1024) {
        newErr.avatar = "Image must be smaller than 2MB";
      }
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        Swal.fire("Invalid File", "Only image files are allowed", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire("Too Large", "Max size is 2MB", "error");
        return;
      }
    }

    setAvatarFile(file);
    setRemoveAvatar(false);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setRemoveAvatar(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", admin.name);
      formData.append("email", admin.email);

      if (avatarFile) formData.append("avatar", avatarFile);
      else if (removeAvatar) formData.append("removeAvatar", "true");

      const res = await axios.put(
        "http://localhost:3000/api/admin/profile/public",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAdmin(res.data);
      setAvatarFile(null);
      setRemoveAvatar(false);

      localStorage.setItem("adminData", JSON.stringify(res.data));
      window.dispatchEvent(new Event("adminDataUpdated"));

      Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false });

      navigate("/dash");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-2xl border border-purple-200">
      <h2 className="text-3xl font-extrabold mb-4 text-purple-700 text-center tracking-wide">
        Admin Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full shadow-md bg-gray-100 border-2 border-purple-400 overflow-hidden">
            {avatarFile ? (
              <img src={URL.createObjectURL(avatarFile)} className="w-full h-full object-cover" />
            ) : admin.avatar ? (
              <img src={`http://localhost:3000${admin.avatar}?t=${Date.now()}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-gray-400">No Avatar</div>
            )}
          </div>

          <input
            type="file"
            onChange={handleAvatarChange}
            className="text-sm mt-3 cursor-pointer"
          />

          {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}

          {(admin.avatar || avatarFile) && !removeAvatar && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="mt-2 text-red-500 text-sm hover:underline"
            >
              Remove Avatar
            </button>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={admin.name}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
            className={`w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-purple-800 transition disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default AdminProfile;
