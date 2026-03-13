import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session?.user?.rol)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

export default ProtectedRoute;
