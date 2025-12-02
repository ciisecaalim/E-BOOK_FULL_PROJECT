import { Navigate } from "react-router-dom";

function ProtectedRouter({ children }) {
  const admin = localStorage.getItem("admin");

  if (!admin) {
    return <Navigate to="/loginDash" replace />;
  }

  return children;
}

export default ProtectedRouter;
