import axios from "axios";

// Create an Axios instance with a common base URL
const api = axios.create({
    baseURL: "http://localhost:5000",
});

// We can add interceptors here if needed in the future (e.g., attach JWT tokens)
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
