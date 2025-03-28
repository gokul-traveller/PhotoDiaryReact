import axios from "axios";

const API_BASE_URL = "https://your-backend.com/api/auth";

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to log in the user and retrieve a JWT token
export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }
  return response.data;
};

// Function to log out the user
export const logout = () => {
  localStorage.removeItem("authToken");
};

// Function to get the current user's details
export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");

  const response = await api.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};