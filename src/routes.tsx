import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PhotoDetails from "./pages/PhotoDetails";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes (Only accessible when logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/photo/:photoId" element={<PhotoDetails />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
