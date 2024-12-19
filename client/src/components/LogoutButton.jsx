import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const { token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  // Log out the user
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If response is not okay, throw an error
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Logout failed:", errorData);
        alert("Failed to log out. Please try again.");
        return;
      }

      // Parse the response data
      const data = await res.json();
      console.log("Logout successful:", data);

      // Clear user session data
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");

      // Redirect to home page
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleLogout}>
      <button className="text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600">
        Log Out
      </button>
    </form>
  );
}

export default LogoutButton;
