import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// icon
import { CiDollar } from "react-icons/ci";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { BiMessageRounded } from "react-icons/bi";
import { IoCalendarOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";

const Slidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const pathToItem = {
      "/dashboard": "dashboard",
      "/message": "message",
      "/payroll": "payroll",
      "/calendar": "calendar",
      "/employee": "employee",
      "/attendance": "attendance",
      "/overtime": "overtime",
      "/absense": "absense",
      "/settings": "settings",
      "/qrscanner": "qrscanner",
    };
    setSelectedItem(pathToItem[location.pathname] || "");
  }, [location.pathname]);

  const toggleMenu = (item, path) => {
    setSelectedItem(item);
    if (item === "qrscanner") {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedItem]);

  return (
    <div className="w-[250px] min-w-[250px] font-sans flex flex-col justify-between items-center text-[14px] caret-transparent border-r-2">
      <div className="w-full flex flex-col items-start px-[10px]">
        {/* Logo */}
        <div>
          <img
            alt="logo"
            src="src\assets\logoapp.png"
            className="w-[215px] h-[72px] left-[10px] mt-[10%]"
          />
        </div>
        {/* Menu */}
        <div className="mt-[10%] ml-[10px]">
          <p className="flex font-bold">MENU</p>
          <ul className="flex flex-col mt-[5%]">
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "dashboard"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("dashboard", "/dashboard")}
              >
                <HiOutlineSquares2X2 className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Dashboard
              </li>
            </div>
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "message"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("message", "/message")}
              >
                <BiMessageRounded className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Message
              </li>
            </div>
            <div className="flex">
              <li
                className={`flex items-center w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "calendar"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("calendar", "/calendar")}
              >
                <IoCalendarOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Calendar
              </li>
            </div>
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "overtime"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("overtime", "/overtime")}
              >
                <IoTimeOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Overtime
              </li>
            </div>
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "absense"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("absense", "/absense")}
              >
                <IoCloseCircleOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Absence
              </li>
            </div>
          </ul>
        </div>
        {/* Organization */}
        <div className="mt-[10%] ml-[10px]">
          <p className="flex font-bold">ORGANIZATION</p>
          <ul className="flex flex-col mt-[5%]">
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "employee"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("employee", "/employee")}
              >
                <HiOutlineUserGroup className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Employee
              </li>
            </div>
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "payroll"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("payroll", "/payroll")}
              >
                <CiDollar className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Payroll
              </li>
            </div>
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "attendance"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("attendance", "/attendance")}
              >
                <HiOutlineDocumentCheck className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                Attendance
              </li>
            </div>
            <div className="flex">
              <li
                className={`flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointer transition-transform duration-300 ${
                  selectedItem === "qrscanner"
                    ? "bg-[#2EB67D] text-white translate-x-2"
                    : "bg-white text-[#979797]"
                }`}
                onClick={() => toggleMenu("qrscanner", "/qrscanner")}
              >
                <HiOutlineDocumentCheck className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
                QR Scanner
              </li>
            </div>
          </ul>
        </div>
      </div>
      {/* Setting */}
      <div className="flex justify-end border-[#B8BDC5] border-2 rounded-[10px] mt-[50%] mb-[5%]">
        <li
          className="flex items-center  w-[210px] rounded-[8px] h-[50px] cursor-pointe text-[#979797]"
          onClick={() => toggleMenu("setting", "/settings")}
        >
          <IoSettingsOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
          Settings
        </li>
      </div>
    </div>
  );
};

export default Slidebar;
