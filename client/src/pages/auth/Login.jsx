import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";

function Login() {
  const [errors, setErrors] = useState({});
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/login", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.errors) {
      setErrors(data.errors);
    } else {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "employee") {
        navigate("/employee/dashboard");
      }
    }
  }

  function handleFormDataChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-custom-grey">
        <form
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-bold text-center text-custom-blue">Log In</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleFormDataChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-custom-blue focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleFormDataChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-custom-blue focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-custom-green text-white font-semibold rounded-md hover:bg-green-500 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
