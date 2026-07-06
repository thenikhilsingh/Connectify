import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LoaderCircle } from "lucide-react";
import BackendHealth from "./BackendHealth";

export default function Login() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { storeTokenInLS, isLoggedIn } = useContext(AuthContext);
  const [loginLoading, setLoginLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [backendReady, setBackendReady] = useState(false);
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/api/health");

        if (response.status === 200) {
          setBackendReady(true);
        }
      } catch {
        setTimeout(checkBackend, 3000); // retry after 3 seconds
      }
    };

    checkBackend();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData,
      );
      console.log(response.data);
      if (response.status === 200) {
        storeTokenInLS(response.data.token);
        navigate("/app");
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/guest`);

      if (response.status === 200) {
        storeTokenInLS(response.data.token);
        navigate("/app");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGuestLoading(false);
    }
  };

  if (!backendReady) {
    return <BackendHealth />;
  }

  if (isLoggedIn) {
    return <Navigate to="/app" />;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-6xl w-full grid grid-cols-2">
        {/* Left Side */}
        <div className="p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <img src="/logoIcon.png" alt="" className="h-8" />
            <h1 className="text-3xl font-bold text-violet-600">Connectify</h1>
          </div>

          <h2 className="text-4xl font-bold mb-4">Connect. Share. Chat.</h2>

          <p className="text-gray-500 mb-8">All in one place.</p>

          <img src="/loginImage.png" alt="" className="max-w-sm" />
        </div>

        {/* Right Side */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>

          <p className="text-gray-500 mb-8">Login to continue</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email or Username"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="text-right">
              <button type="button" className="text-sm text-violet-600">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700"
            >
              {loginLoading && (
                <LoaderCircle size={18} className="animate-spin" />
              )}

              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-6 text-center text-gray-400">or continue with</div>

          <div className="space-y-3">
            <button
              onClick={handleGuestLogin}
              disabled={guestLoading}
              type="button"
              className="w-full border py-3 rounded-xl"
            >
              {guestLoading && (
                <LoaderCircle size={18} className="animate-spin" />
              )}

              {guestLoading ? "Signing in..." : "Continue as a Guest"}
            </button>
          </div>

          <p className="text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-violet-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
