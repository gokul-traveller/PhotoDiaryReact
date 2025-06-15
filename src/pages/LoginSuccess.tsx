// src/pages/LoginSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { getCurrentUser } from "../api/authApi";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      console.log(token);

      getCurrentUser(token)
        .then((user) => {
          login(user); // this updates auth store
          navigate("/");
        })
        .catch((error) => {
          console.error("Failed to fetch user info:", error);
          navigate("/login");
        });
    } else {
      console.error("No token found in URL");
      navigate("/login");
    }
  }, []);

  return <div className="text-center mt-10 text-lg">Logging you in...</div>;
};

export default LoginSuccess;
