import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState();

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  const getLoggedInUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("user", response.data.userData);
      if (response.status === 200) {
        setUser(response.data.userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoggedInUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ storeTokenInLS, LogoutUser, isLoggedIn, token, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
