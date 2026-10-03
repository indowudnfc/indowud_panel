import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import DataProviders from "../../Context/DataProviders";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, userData } = useAuthContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // for mobile

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Revokes the refresh token on the server and clears every stored credential.
    setTimeout(async () => {
      await logout();
      navigate("/login", { replace: true });
    }, 300);
  };

  // Keyed by admin so switching accounts never shows the previous admin's cached data.
  return (
    <DataProviders key={userData?.user?.uid}>
    <div
      className={`flex h-screen bg-gray-50 transition-opacity duration-300 ${isLoggingOut ? "opacity-0" : "opacity-100"
        }`}
    >
      {/* ===== Sidebar ===== */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 transform ${isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onLogout={handleLogout} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* ===== Overlay (for mobile) ===== */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ===== Main Section ===== */}
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
    </DataProviders>
  );
};

export default AdminLayout;