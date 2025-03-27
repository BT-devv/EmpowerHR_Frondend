import { Outlet, Navigate, useLocation } from "react-router-dom";
import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
const Layout = () => {
  const location = useLocation();
  // Check auth
  const token = localStorage.getItem("token");
  const expiryTime = localStorage.getItem("expiryTime");
  const isAuthenticated = token && Date.now() < expiryTime;

  return isAuthenticated ? (
    <div className="flex">
      <Slidebar />
      <div className="flex flex-col flex-grow w-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default Layout;
