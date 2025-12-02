import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import SidenavList from "./sideNavList";
import axios from "axios";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [admin, setAdmin] = useState({ name: "", email: "", role: "", avatar: "" });
  const [img, setImg] = useState("/avatar.png");
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogOut = () => {
    localStorage.removeItem("adminData");
    navigate("/loginDash");
  };

  const links = [
    { to: "/dash", icon: "fa-home", title: "Dashboard" },
    { to: "/dash/books", icon: "fa-book", title: "Books" },
    { to: "/dash/add-book", icon: "fa-plus", title: "Add Book" },
    { to: "/dash/customers", icon: "fa-user", title: "Customers" },
    { to: "/dash/orders", icon: "fa-shopping-cart", title: "orders" },
    { to: "/dash/AddCategory", icon: "fa-shopping-cart", title: "AddCategory" },
    { to: "/dash/addOrder", icon: "fa-cart-plus", title: "Add Orders" },
    { to: "/dash/RecycleBin", icon: "fa-cart-plus", title: "RecycleBin" },
    { to: "/dash/reports", icon: "fa-chart-bar", title: "Reports" },
    { to: "/dash/settings", icon: "fa-cog", title: "Settings" },
  ];

  const fetchAdmin = async () => {
    const storedAdmin = localStorage.getItem("adminData");
    if (storedAdmin) {
      const parsed = JSON.parse(storedAdmin);
      setAdmin(parsed);
      setImg(parsed.avatar ? `http://localhost:3000${parsed.avatar}?t=${Date.now()}` : "/avatar.png");
    } else {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/profile/public");
        setAdmin(res.data);
        setImg(res.data.avatar ? `http://localhost:3000${res.data.avatar}?t=${Date.now()}` : "/avatar.png");
      } catch (err) {
        console.error("Failed to fetch admin:", err);
      }
    }
  };

  useEffect(() => {
    fetchAdmin();
    const handleUpdate = () => fetchAdmin();
    window.addEventListener("adminDataUpdated", handleUpdate);
    return () => window.removeEventListener("adminDataUpdated", handleUpdate);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 bg-purple-700 shadow-lg transition-all duration-300 flex flex-col`}
        style={{ width: isOpen ? "18%" : "6%" }}
      >
        {/* Admin Info */}
        <div className="flex items-center gap-3 p-4 border-b border-purple-600 overflow-hidden relative">
          {!imgLoaded && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={img}
            alt="Admin"
            onLoad={() => setImgLoaded(true)}
            className="w-10 h-10 rounded-full object-cover transition-all duration-500 transform hover:scale-110"
          />
          {isOpen && (
            <Link to="AdminProfile" className="flex-1 ml-3 overflow-hidden">
              <h4 className="text-white font-semibold truncate">{admin.name || "Admin Name"}</h4>
              <p className="text-gray-200 text-sm truncate">{admin.email || "admin@example.com"}</p>
              <p className="text-gray-300 text-xs truncate">Role: {admin.role || "Admin"}</p>
            </Link>
          )}
        </div>

        {/* Toggle Button */}
        <div className="flex justify-end p-3">
          <i
            onClick={handleToggle}
            className={`text-white fa-solid ${isOpen ? "fa-chevron-left" : "fa-chevron-right"} cursor-pointer hover:text-gray-300 transition-all duration-300`}
          ></i>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-y-3 px-2 mt-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600 text-red-500 font-semibold shadow-sm"
                    : "text-white hover:bg-purple-600 hover:text-gray-200"
                }`
              }
            >
              <SidenavList icon={link.icon} title={isOpen ? link.title : null} />
            </NavLink>
          ))}

          {/* Log Out */}
          <div className="mt-auto border-t border-purple-600 pt-4 px-2">
            <button
              onClick={handleLogOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white hover:bg-blue-800 hover:text-gray-200 transition-all"
            >
              <SidenavList icon="fa-key" title={isOpen ? "Log Out" : null} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 bg-gray-100 min-h-screen transition-all duration-300 p-10"
        style={{ marginLeft: isOpen ? "18%" : "6%" }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;
