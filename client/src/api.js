import axios from "axios";

const api = axios.create({
  baseURL: "https://booking-system-v2-backend.onrender.com/api",
<<<<<<< HEAD
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
=======
    headers: {
    "Content-Type": "application/json",
    
   },
   withCredentials: true, 
    },
);
>>>>>>> 411ed307cb8edb27410871df62577cd1409d0e8a
export default api;
