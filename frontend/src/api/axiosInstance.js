// src/api/axiosInstance.js
import axios from "axios";

// pull in your VITE_BACKEND_URL at build time
const BACKEND = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND) {
  console.warn(
    "VITE_BACKEND_URL is not defined, requests to '/api' will 404 in production"
  );
}

// In dev, you still want the Vite proxy, so only use the env var in prod:
const baseURL =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production"
    ? `${BACKEND}/api`
    : "/api";

const axiosInstance = axios.create({
  baseURL,
  // withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = JSON.parse(
    sessionStorage.getItem("accessToken")
  ) || "";
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
