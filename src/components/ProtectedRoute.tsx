import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
