import React from "react";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="h-full bg-custom-grey text-white w-64 flex flex-col px-4 py-6 overflow-y-auto">
      <nav className="flex flex-col gap-4">
        {/* Home Link */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `py-2 px-4 rounded-md ${
              isActive ? "bg-custom-green text-black" : "hover:bg-custom-grey"
            }`
          }
        >
          <i className="fa-solid fa-house"></i> Home
        </NavLink>

        {/* Tasks Link */}
        <NavLink
          to="/admin/dashboard/tasks"
          className={({ isActive }) =>
            `py-2 px-4 rounded-md ${
              isActive ? "bg-custom-green text-black" : "hover:bg-custom-grey"
            }`
          }
        >
          <i className="fa-solid fa-pen"></i> Tasks
        </NavLink>

        {/* Employees Link */}
        <NavLink
          to="/admin/dashboard/employees"
          className={({ isActive }) =>
            `py-2 px-4 rounded-md ${
              isActive ? "bg-custom-green text-black" : "hover:bg-custom-grey"
            }`
          }
        >
          <i className="fa-solid fa-user"></i> Employees
        </NavLink>
      </nav>
    </div>
  );
}

export default AdminSidebar;
