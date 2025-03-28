import { Link } from "react-router-dom";
import { useAuthStore } from "../../context/authStore";
import "./NavStyle.css";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 w-full bg-rose-400 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-georgia text-gray-800 flex items-center ml-3">
          <Logo />
          <span className="ml-2">PhotoDiary</span>
        </Link>
        <div className="space-x-8 mr-4">
          <Link to={`/`} className="text-gray-700 hover:underline">
            About
          </Link>
          <Link to={`/`} className="text-gray-700 hover:underline">
            Home
          </Link>
          {user ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                className="text-gray-700 hover:underline"
              >
                My Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
