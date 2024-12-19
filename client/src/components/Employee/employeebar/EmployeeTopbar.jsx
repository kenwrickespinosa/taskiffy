import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { Link } from "react-router-dom";
import LogoutButton from "../../LogoutButton";

function EmployeeTopbar({ toggleBackgroundColor }) {
  const { user } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-custom-blue text-white">
      {/* Logo or Title */}
      <div className="text-xl font-bold">
        {user && <span>Welcome, {user.name}!</span>}
      </div>

      {/* Notification Dropdown */}
      <div className="relative">
        <button
          className="text-white px-3 py-2 rounded-md hover:bg-opacity-90"
          onClick={toggleBackgroundColor}
        >
          <i className="fa-solid fa-moon"></i>
        </button>
      </div>

      {/* User Info and Logout */}
      <div className="flex items-center space-x-4">
        <LogoutButton />
      </div>
    </div>
  );
}

export default EmployeeTopbar;
