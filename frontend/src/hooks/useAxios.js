import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAxios = () => {
  const { token } = useContext(AuthContext);

  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default useAxios;
