import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <nav className="bg-custom-blue p-4">
        <div className="flex justify-between items-center mx-12">
          {/* Website Name */}
          <Link to="/" className="text-custom-green text-2xl font-bold">
            <i className="fa-solid fa-feather" /> Taskiffy.com
          </Link>

          {/* Login Link */}
          {!isLoginPage && (
            <Link
              to="/login"
              className="text-white text-lg hover:text-gray-400 transition duration-300">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
