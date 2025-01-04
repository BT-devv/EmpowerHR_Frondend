import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
import { PiChats } from "react-icons/pi";
import { BsListCheck } from "react-icons/bs";
import { LuRectangleVertical } from "react-icons/lu";
import { CiGift } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { MdPeopleOutline } from "react-icons/md";
import { PiMoneyFill } from "react-icons/pi";
import { BsBarChart } from "react-icons/bs";
import { AiOutlineTable } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdPowerSettingsNew } from "react-icons/md";

const Slidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const pathToItem = {
      "/products": "products",
      "/favorites": "favorites",
      "/inbox": "inbox",
      "/order": "order",
      "/productStock": "productStock",
      "/pricing": "pricing",
      "/calendar": "calendar",
      "/todo": "todo",
      "/contact": "contact",
      "/invoice": "invoice",
      "/ui": "ui",
      "/team": "team",
      "/table": "table",
      "/settings": "settings",
      "/logout": "logout",
    };
    setSelectedItem(pathToItem[location.pathname] || "");
  }, [location.pathname]);

  const toggleMenu = (item, path) => {
    setSelectedItem(item);
    navigate(path);
  };

  return (
    <div className=" w-[250px] h-[1080] font-sans flex flex-col justify-center items-center text-[14px]">
      {/* Logo */}
      <div>
        <img
          alt="logo"
          src="src\assets\logoapp.png"
          className="w-[215px] h-[72px] left-[10px]"
        />
      </div>
      {/* Dashboard */}
      <div className="mt-[10%]">
        <p className="flex justify-center font-bold">Dashboard</p>
        <ul className="flex flex-col mt-[5%]">
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "products" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "products"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("products")}
            >
              <HiOutlineSquares2X2 className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Products
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "favorites" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "favorites"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("favorites")}
            >
              <CiHeart className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Favorites
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "inbox" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "inbox"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("inbox")}
            >
              <PiChats className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Inbox
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "order" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "order"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("order")}
            >
              <BsListCheck className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Order Lists
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "productStock"
                  ? "bg-[#2EB67D]"
                  : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "productStock"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("productStock")}
            >
              <LuRectangleVertical className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Product Stock
            </li>
          </div>
        </ul>
      </div>
      {/* Pages */}
      <div className="border-t border-[#E0E0E0] my-4 w-[250px] mt-[5%]"></div>
      <div>
        <p className="text-gray-400 text-left ml-[10px]">PAGES</p>
        <ul className="flex flex-col mt-[10px]">
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "pricing" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "pricing"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("pricing")}
            >
              <CiGift className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Pricing
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "calendar" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "calendar"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("calendar")}
            >
              <IoCalendarOutline className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Calendar
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "todo" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "todo"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("todo")}
            >
              <RiTodoLine className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              To-Do
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "contact" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "contact"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("contact")}
            >
              <MdPeopleOutline className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Contact
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "invoice" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "invoice"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("invoice")}
            >
              <PiMoneyFill className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Invoice
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "ui" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "ui"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("ui")}
            >
              <BsBarChart className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              UI Elements
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "team" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "team"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("team", "/team")}
            >
              <CiUser className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Team
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "table" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "table"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("table")}
            >
              <AiOutlineTable className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Table
            </li>
          </div>
        </ul>
      </div>
      {/* Setting */}
      <div className="border-t border-[#E0E0E0] my-4 w-[250px]"></div>
      <div>
        <ul className="flex flex-col">
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "setting" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "setting"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("setting")}
            >
              <IoSettingsOutline className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Settings
            </li>
          </div>
          <div className="flex">
            <div
              className={`w-[50px] h-[50px] rounded-[8px] ml-[-55px] ${
                selectedItem === "logout" ? "bg-[#2EB67D]" : "bg-transparent"
              }`}
            ></div>
            <li
              className={`flex items-center w-[200px] rounded-[8px] h-[50px] ml-[30px] ${
                selectedItem === "logout"
                  ? "bg-[#2EB67D] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => toggleMenu("logout")}
            >
              <MdPowerSettingsNew className="h-[20px] w-[20px] mr-[20px] ml-[20px]" />
              Logout
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Slidebar;
