import { Link ,useNavigate } from "react-router-dom";
import { useAuthStore } from "../../context/authStore";
import "./NavStyle.css";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // ✅ redirect after logout
  };
  return (
    <nav className="fixed top-0 w-full bg-gray-500 shadow-md select-none z-50 h-12 md:h-12">
      <div className="flex justify-between items-center w-full px-4">
        <Link to="/" className="text-1xl md:text-2xl font-georgia text-white flex items-center ml-3">
          <Logo />
          <span className="ml-2">PhotoDiary</span>
        </Link>
        <div className="space-x-2 mr-2 md:space-x-8  text-sm md:text-base">
          <Link to={`/`} className="text-white hover:underline">
            About
          </Link>
          <Link to={`/`} className="text-white hover:underline">
            Home
          </Link>
          {user ? (
            <>
              <Link
                to={`/profile/${user.userId}`}
                className="text-white hover:underline"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white font-georgia px-4 py-1 rounded-md hover:text-gray-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
