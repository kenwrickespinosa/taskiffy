import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppContext';

function Signup() {
  const [errors, setErrors] = useState({});
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/signup", {
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
      navigate("/admin/dashboard");
    }

    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="w-full sm:w-96 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-custom-blue mb-6">Register Employee</h2>

      <form className="space-y-4" onSubmit={handleSignup}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormDataChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-custom-green focus:border-custom-green"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormDataChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-custom-green focus:border-custom-green"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleFormDataChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-custom-green focus:border-custom-green"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleFormDataChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-custom-green focus:border-custom-green"
          />
          {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation[0]}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 bg-custom-blue text-white font-semibold rounded-md hover:bg-custom-green focus:outline-none focus:ring-2 focus:ring-custom-green"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
