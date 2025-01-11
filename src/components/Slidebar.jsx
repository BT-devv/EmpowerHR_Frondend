import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// icon
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { BiSolidMessageDetail } from "react-icons/bi";
import { BiSolidCalendar } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { PiToolboxFill } from "react-icons/pi";
import { RiExchange2Fill } from "react-icons/ri";
import { PiNotepadFill } from "react-icons/pi";
import { AiFillControl } from "react-icons/ai";
import { BsPcDisplay } from "react-icons/bs";

const Slidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const pathToItem = {
      "/dashboard": "dashboard",
      "/message": "message",
      "/calendar": "calendar",
      "/job": "job",
      "/candidates": "candidates",
      "/myreferrals": "myreferrals",
      "/carrersite": "carrersite",
      "/employee": "employee",
      "/projectmanagement": "projectmanagement",
      "/checkincheckout": "checkincheckout",
      "/overtime": "overtime",
      "/absense": "absense",
      "/settings": "settings",
    };
    setSelectedItem(pathToItem[location.pathname] || "");
  }, [location.pathname]);

  const toggleMenu = (item, path) => {
    setSelectedItem(item);
    navigate(path);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedItem]);

  return (
    <div className=" w-[250px] h-[1080] font-sans flex flex-col justify-center items-center text-[14px] ml-[20px]">
      {/* Logo */}
      <div>
        <img
          alt="logo"
          src="src\assets\logoapp.png"
          className="w-[215px] h-[72px] left-[10px]"
        />
      </div>
      {/* Menu */}
      <div className="mt-[10%]">
        <p className="flex font-bold">MENU</p>
        <ul className="flex flex-col mt-[5%]">
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px]  ${
                selectedItem === "dashboard"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("dashboard", "/dashboard")}
            >
              <HiMiniSquares2X2 className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Dashboard
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px]  ${
                selectedItem === "message"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("message")}
            >
              <BiSolidMessageDetail className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Message
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] ${
                selectedItem === "calendar"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("calendar")}
            >
              <BiSolidCalendar className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Calendar
            </li>
          </div>
        </ul>
      </div>
      {/* Recruitment */}
      <div className="mt-[10%]">
        <p className="flex font-bold">RECRUITMENT</p>
        <ul className="flex flex-col mt-[5%]">
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] ${
                selectedItem === "job"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("job")}
            >
              <PiToolboxFill className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Jobs
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] ${
                selectedItem === "candidates"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("candidates")}
            >
              <FaUserFriends className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Cadidates
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] ${
                selectedItem === "myreferrals"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("myreferrals")}
            >
              <RiExchange2Fill className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              My Referrals
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] ${
                selectedItem === "carrersite"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("carrersite")}
            >
              <BsPcDisplay className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Career Site
            </li>
          </div>
        </ul>
      </div>
      {/* Organization */}
      <div className="mt-[10%]">
        <p className="flex font-bold">ORGANIZATION</p>
        <ul className="flex flex-col mt-[5%]">
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "employee"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("employee", "/employee")}
            >
              <FaUserFriends className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Employee
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "projectmanagement"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("projectmanagement")}
            >
              <RiExchange2Fill className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Project management
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "checkincheckout"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("checkincheckout")}
            >
              <PiNotepadFill className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Check-in/Check-out
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "overtime"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("overtime")}
            >
              <AiFillControl className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Overtime
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "absense"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("absense")}
            >
              <AiFillControl className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Absence
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "setting"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("setting")}
            >
              <AiFillControl className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Settings
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "setting"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("setting")}
            >
              <AiFillControl className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Settings
            </li>
          </div>
          <div className="flex">
            <li
              className={`flex items-center w-[230px] rounded-[8px] h-[50px] transition-all duration-500 ${
                selectedItem === "setting"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("setting")}
            >
              <AiFillControl className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Settings
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Slidebar;
