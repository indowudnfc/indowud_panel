import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import { homePathFor } from "../utils/rbac";

/**
 * Route guard. Without `roles` it only requires a signed-in admin; with `roles` it also checks the role.
 * This is a UI convenience — the backend checks the token and role on every request.
 */
const ProtectedRoute = ({ roles, children }) => {
  const { isInitialized, isAuthenticated, role } = useAuthContext();
  const location = useLocation();

  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading…</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to={homePathFor(role)} replace />;
  }
  return children ?? <Outlet />;
};

export default ProtectedRoute;
