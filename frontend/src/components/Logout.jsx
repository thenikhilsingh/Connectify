import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Logout() {
  const { LogoutUser } = useContext(AuthContext);

  useEffect(() => {
    LogoutUser();
  }, [LogoutUser]);

  return <Navigate to="/" />;
}
