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
    <div className="h-screen w-screen overflow-hidden flex">
      <div className="w-64 h-full fixed top-0 left-0 z-50 bg-white border-r shadow">
        <Slidebar />
      </div>
      <div className="flex flex-col flex-grow ml-64 w-[calc(100%-16rem)] h-full">
        <div className="h-16 fixed left-64 right-0 z-40 bg-white border-b shadow">
          <Navbar />
        </div>
        <div className="mt-16 overflow-y-auto flex-grow bg-[#F5F6FA]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default Layout;
