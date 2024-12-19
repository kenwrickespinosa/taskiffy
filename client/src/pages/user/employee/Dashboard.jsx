import React, { useState } from "react";
import EmployeeSidebar from "../../../components/Employee/employeebar/EmployeeSidebar";
import EmployeeTopbar from "../../../components/Employee/employeebar/EmployeeTopbar";
import { Outlet } from "react-router-dom";
import Home from "../../../components/Employee/home/Home.jsx";

function Dashboard() {
  const [isWhiteBackground, setIsWhiteBackground] = useState(false);

  const toggleBackgroundColor = () => {
    setIsWhiteBackground((prevState) => !prevState);
  };

  return (
    <div
      className={`h-screen flex flex-col ${isWhiteBackground ? "bg-white" : "bg-custom-black"}`}
    >
      {/* Topbar */}
      <EmployeeTopbar toggleBackgroundColor={toggleBackgroundColor} />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <EmployeeSidebar />

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* If on /admin/dashboard, display Home */}
          {location.pathname === "/employee/dashboard" ? (
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
