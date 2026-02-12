import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://pingme-backend-uyg3.onrender.com/`,
  withCredentials: true,
});

export default axiosInstance;
