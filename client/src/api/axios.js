import axios from "axios";

const API = axios.create({
  baseURL: "https://event-registration-backend-b1a2.onrender.com/api",
});
// Automatically attach token to every request if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
