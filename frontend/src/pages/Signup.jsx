import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Signup() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => [...prev, { message: "Passwords do not match" }]);
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        payload,
      );
      console.log(response.data);
      if (response.status === 200) {
        navigate("/");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg max-w-6xl w-full grid grid-cols-2 overflow-hidden">
        {/* Left Side */}
        <div className="p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logoIcon.png" alt="Connectify" className="h-12" />

            <h1 className="text-5xl font-bold text-violet-600">Connectify</h1>
          </div>

          <img
            src="/SignupImage.png"
            alt="Signup Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>

        {/* Right Side */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-5xl font-bold mb-2">Create your account </h2>

          <p className="text-gray-500 mb-6 text-lg">Join Connectify today</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

              <input
                type="text"
                placeholder="Last Name"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-semibold text-lg transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-violet-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
