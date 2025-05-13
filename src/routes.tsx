import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Profile from "./pages/Profile";
import PhotoDetails from "./pages/PhotoDetails";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:userName" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/success" element={<LoginSuccess />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/photo/:photoId" element={<PhotoDetails />} />
      
      {/* Protected Routes (Only accessible when logged in) */}
      <Route element={<ProtectedRoute />}>
        
      </Route>
    </Routes>
  );
};

export default AppRoutes;
