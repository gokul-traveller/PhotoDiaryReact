import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { getCurrentUser } from "../api/authApi";

const GoogleRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
  
      if (token) {
        localStorage.setItem("jwtToken", token);
        try {
          const user = await getCurrentUser(token);
          login(user);
          console.log("login data form controller :"+ user.userId + " " + user.userName);
          navigate(`/`);
        } catch (err) {
          console.error("Failed to fetch user", err);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };
  
    fetchUser();
  }, []);



  return <div>Logging in...</div>;
};

export default GoogleRedirectHandler;
