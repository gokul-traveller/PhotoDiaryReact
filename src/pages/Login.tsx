import { useAuthStore } from "../context/authStore";
import wallpaper_login from "/src/assets/wallpaper_login.jpg";
import google from "/src/assets/google.svg";
import { useNavigate } from "react-router-dom";
import {
  googleLogin,
  guestLogin
} from "../api/authApi";

const Login = () => {
    const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleGuestLogin = async () => {
    try {
      const guest = await guestLogin(); // should return your user object
      console.log("guest login success:", guest);
      login(guest);
      navigate(`/`);
    } catch (err) {
      console.error("Guest login failed:", err);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const user = await googleLogin();
      console.log("guest login success");
      login(user);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${wallpaper_login})`,
      }}
    >
      <div className="bg-white bg-opacity-60 px-12 py-8 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-72">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-3"
        >
          <span>Login with </span>
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <img src={google} alt="Google" className="w-3.5 h-3.5" />
          </span>
        </button>
        <button
          onClick={handleGuestLogin}
          className="w-full bg-gray-500 text-white px-8 py-2 rounded-md hover:bg-gray-600"
        >
          Login as Guest
        </button>
      </div>
    </div>
  );
  
  
};

export default Login;
