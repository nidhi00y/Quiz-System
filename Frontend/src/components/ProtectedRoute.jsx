import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function ProtectedRoute({ allowedRole, children }) {
  const { role } = useAuth();

  // Not logged in
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
