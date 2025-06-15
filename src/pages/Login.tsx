import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import wallpaper_login from "/src/assets/wallpaper_login.jpg";
import googleIcon from "/src/assets/google.svg";
import { googleLogin, guestLogin } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Handle login as guest
  const handleGuestLogin = async () => {
    try {
      const guestUser = await guestLogin(); // Expected to return user object
      console.log("Guest login success:", guestUser);
      login(guestUser);
      navigate(`/`);
    } catch (error) {
      console.error("Guest login failed:", error);
    }
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${wallpaper_login})` }}
    >
      <div className="bg-white bg-opacity-60 px-12 py-8 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-72">
        <button
          onClick={googleLogin}
          className="w-full bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-3"
        >
          <span>Login with</span>
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <img src={googleIcon} alt="Google" className="w-3.5 h-3.5" />
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
