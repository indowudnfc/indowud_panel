// src/Routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../Pages/Login";
import ResetPassword from "../Pages/ResetPassword";
import Dashboard from "../Pages/Dashboard";
import AdminUsers from "../Pages/AdminUsers";
import Products from "../Pages/Products";
import QRGeneration from "../Pages/QRGeneration";
import QRTrack from "../Pages/QRTrack";
import Customers from "../Pages/Customers";
import Catalogue from "../Pages/Catalogue";
import Promotions from "../Pages/Promotions";
import Feed from "../Pages/Feed";
import Announcements from "../Pages/Announcements";
import AdminLayout from "../Components/Layout/AdminLayout";
import Settings from "../Pages/Settings";
import ManageTickets from "../Pages/ManageTickets";
import Dealers from "../Pages/Dealers";
import RedemptionManagement from "../Pages/Redemption";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import ProtectedRoute from "../Components/ProtectedRoute";
import { useAuthContext } from "../Context/AuthContext";
import { FULL_ACCESS, ALL_ROLES, homePathFor } from "../utils/rbac";

// Mirrors the backend's role checks so people aren't shown pages that would only return 403.
const ROUTES = [
  { path: "/dashboard", element: <Dashboard />, roles: FULL_ACCESS },
  { path: "/factoryUsers", element: <AdminUsers />, roles: FULL_ACCESS },
  { path: "/customers", element: <Customers />, roles: FULL_ACCESS },
  { path: "/dealers", element: <Dealers />, roles: ALL_ROLES },
  { path: "/products", element: <Products />, roles: ALL_ROLES },
  { path: "/qr", element: <QRGeneration />, roles: ALL_ROLES },
  { path: "/track", element: <QRTrack />, roles: FULL_ACCESS },
  { path: "/catalogue", element: <Catalogue />, roles: FULL_ACCESS },
  { path: "/promotions", element: <Promotions />, roles: FULL_ACCESS },
  { path: "/redemption", element: <RedemptionManagement />, roles: FULL_ACCESS },
  { path: "/settings", element: <Settings />, roles: FULL_ACCESS },
  { path: "/tickets", element: <ManageTickets />, roles: FULL_ACCESS },
  { path: "/feed", element: <Feed />, roles: FULL_ACCESS },
  { path: "/announcements", element: <Announcements />, roles: FULL_ACCESS },
];

function HomeRedirect() {
  const { isInitialized, isAuthenticated, role } = useAuthContext();
  if (!isInitialized) return null;
  return <Navigate to={isAuthenticated ? homePathFor(role) : "/login"} replace />;
}

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />

    {/* Signed-in area */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        {ROUTES.map(({ path, element, roles }) => (
          <Route key={path} path={path} element={<ProtectedRoute roles={roles}>{element}</ProtectedRoute>} />
        ))}
      </Route>
    </Route>

    <Route path="/" element={<HomeRedirect />} />
    <Route path="*" element={<h1 className="p-8 text-center">404 — Page not found</h1>} />
  </Routes>
);

export default AppRoutes;
