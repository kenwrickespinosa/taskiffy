import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminTopbar from "../../../components/Admin/adminbar/AdminTopbar.jsx";
import AdminSidebar from "../../../components/Admin/adminbar/AdminSidebar.jsx";
import Home from "../../../components/Admin/home/Home.jsx";

function Dashboard() {
  const [isWhiteBackground, setIsWhiteBackground] = useState(false); // State to manage background color
  const location = useLocation();

  // Function to toggle background color
  const toggleBackgroundColor = () => {
    setIsWhiteBackground((prevState) => !prevState);
  };

  return (
    <div className={`h-screen flex flex-col ${isWhiteBackground ? "bg-white" : "bg-custom-black"}`}> {/* Toggle background color */}
      {/* Topbar */}
      <AdminTopbar onToggleBackground={toggleBackgroundColor} /> {/* Pass function to Topbar */}

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* If on /admin/dashboard, display Home */}
          {location.pathname === "/admin/dashboard" ? (
            <Home />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
