import axios from "axios";

const api = axios.create({
  baseURL: "https://booking-system-v2-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export default api;
