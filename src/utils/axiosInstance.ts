import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (!token && !config.url?.includes("/auth/google")) {
      return Promise.reject("Unauthorized - Please log in first");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
