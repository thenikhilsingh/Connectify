import { createContext, useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket/socket";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

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
    if (token) {
      getLoggedInUserData();
    }
  }, [token]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`User Connected with id:${socket.id} `);
    });

    return () => {
      socket.off("connect", () => {
        console.log(`User disonnected with id: ${socket.id}`);
      });
    };
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("join", user._id);
    }
  }, [user]);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const getNotificationCount = async () => {
    try {
      const response = await api.get("/api/people/requestNotifications");

      setNotificationCount(response.data.notifications.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getNotificationCount();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        storeTokenInLS,
        LogoutUser,
        isLoggedIn,
        token,
        user,
        setUser,
        onlineUsers,
        notificationCount,
        getNotificationCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
