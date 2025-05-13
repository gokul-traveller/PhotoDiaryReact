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
export const googleLogin = async () => {
  console.log("google login called");
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
  // const response = await api.get("http://localhost:8080/oauth2/authorization/google");
  // if (response.data.token) {
  //   localStorage.setItem("authToken", response.data.token);
  // }
  // console.log(response.data);
  // return response.data;
};

export const guestLogin = async () => {
  console.log("guest login called");
  const response = await api.get("http://localhost:8080/api/auth/guestLogin");
  // if (response.data.token) {
  //   localStorage.setItem("authToken", response.data.token);
  // }
  console.log(response.data);
  return response.data;
};

// Function to log out the user
export const logout = () => {
  localStorage.removeItem("authToken");
};


export const getCurrentUser = async (token: string) => {
  const res = await fetch("http://localhost:8080/api/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json()
  console.log(data);
  return data;
};