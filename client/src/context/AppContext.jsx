import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Fetch the user data
  async function getUser() {
    const res = await fetch('http://localhost:8000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      setUser(data);
    } else {
      console.error("Failed to fetch user:", data);
    }
  }

  // Log out the user
  async function logout() {
    const res = await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      setUser(null);  // Reset user state
      setToken(null);  // Clear token
      localStorage.removeItem('token');  // Remove token from localStorage
    } else {
      console.error("Failed to log out:", data);
    }
  }

  // UseEffect to fetch user data if token exists
  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AppContext.Provider>
  );
}
