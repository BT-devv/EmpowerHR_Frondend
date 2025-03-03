import { Outlet } from "react-router-dom";
import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
const Layout = () => {
  return (
    <div className="flex">
      <Slidebar />
      <div className="flex flex-col flex-grow w-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
