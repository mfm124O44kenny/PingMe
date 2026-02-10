import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:5001/api`,
  withCredentials: true,
});

export default axiosInstance;
