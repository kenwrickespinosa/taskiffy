import React from "react";
import LogoutButton from "../../LogoutButton";

const AdminTopbar = ({ onToggleBackground }) => {
  return (
    <div className="bg-custom-blue text-white flex justify-between items-center px-4 py-2">
      {/* Title */}
      <h1 className="text-xl font-bold">Admin</h1>

      {/* Toggle Background Button */}
      <div className="relative">
        <button
          className="text-white px-3 py-2 rounded-md hover:bg-opacity-90"
          onClick={onToggleBackground} // Trigger background toggle on click
        >
          <i className="fa-solid fa-moon"></i>
        </button>
      </div>

      {/* Logout Button */}
      <LogoutButton />
    </div>
  );
};

export default AdminTopbar;
