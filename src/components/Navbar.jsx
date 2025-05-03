import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import apiRoutes from "../../apiRoutes";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Icon
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";

const countries = [
  { name: "Vietnam", flag: "https://flagcdn.com/w320/vn.png" },
  { name: "English", flag: "https://flagcdn.com/w320/gb.png" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const [notifications, setNotifications] = useState([]);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    setLogout(false);

    Swal.fire({
      text: "Logged out successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setName(`${decodedToken.firstName}  ${decodedToken.lastName}`);
      setRole(decodedToken.role);
      setAvatar(decodedToken.avatar);

      const socket = new WebSocket("ws://localhost:3000");

      socket.addEventListener("open", () => {
        socket.send(
          JSON.stringify({
            type: "register",
            employeeID: decodedToken.employeeID,
          })
        );
      });

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type && data.message) {
          setNotifications((prev) => [
            {
              id: Date.now(),
              type: data.type,
              message: data.message,
              data: data.data,
              read: false,
            },
            ...prev,
          ]);
        }
      });

      return () => socket.close();
    } else {
      console.error("Token không tồn tại hoặc không hợp lệ.");
    }
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((noti) => ({ ...noti, read: true })));
  };

  return (
    <div className="w-[calc(100vw-270px)] flex justify-between items-center relative">
      {/* Search */}
      <div className="relative ml-[5%]">
        <CiSearch className="absolute top-[50%] left-4 transform -translate-y-1/2 w-[20px] h-[20px] " />
        <input
          type="text"
          placeholder="Search"
          className="h-[40px] w-[185%] pl-12 rounded-[19px] border-2 bg-[#F5F6FA] border-gray-300 focus:outline-none text-[13px] focus:border-[#2EB67D] hover:border-[#2EB67D]"
        />
      </div>

      <div className="flex items-center relative">
        <div
          className="relative cursor-pointer"
          onClick={() => {
            setShowNotiDropdown(!showNotiDropdown);
            markAllAsRead();
          }}
        >
          <IoNotifications className="w-[25px] h-[25px] hover:text-[#2EB67D]" />
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </div>

        {showNotiDropdown && (
          <div className="absolute right-[230px] top-[60px] w-[320px] bg-white shadow-lg rounded-lg z-50">
            <div className="p-4 border-b font-semibold text-gray-700">
              Notification
            </div>
            <ul className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="p-4 text-gray-500 text-sm text-center">
                  No notifications
                </li>
              ) : (
                notifications.map((noti) => (
                  <li key={noti.id} className="p-3 border-b hover:bg-gray-100">
                    <div className="font-medium">{noti.message}</div>
                    <div className="text-xs text-gray-500">{noti.type}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* dropdown languages */}
        <div className="relative inline-block ml-[35px] text-[14px]">
          <button
            onClick={toggleDropdown}
            className="flex items-center p-2.5 cursor-pointer bg-white focus:outline-none hover:outline-none w-[170px] h-[50px] focus:border-[#2EB67D] hover:border-[#2EB67D]"
          >
            <img
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              className="w-[44px] h-[30px] mr-[10px] rounded-[5px]"
            />
            <span className="ml-[5px]">{selectedCountry.name}</span>
            <span className="ml-auto">
              <IoIosArrowDown />
            </span>
          </button>
          {isOpen && (
            <ul className="absolute top-full left-0 m-0 p-0 list-none bg-white border border-gray-300 shadow-md rounded-md z-[1000] w-[170px]">
              {countries.map((country) => (
                <li
                  key={country.name}
                  onClick={() => handleSelect(country)}
                  className="flex items-center p-2.5 cursor-pointer border-b border-gray-200 hover:bg-gray-100 ml-[5px]"
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="w-[44px] h-[27px] mr-[10px] rounded-[5px]"
                  />
                  <span>{country.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* dropdown user */}
        <div className="flex items-center p-4 rounded-lg h-[60px] bg-white ml-[10px] ">
          <img
            src={apiRoutes.file.avatar(avatar)}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-grow ml-[25px] ">
            <p className="text-[14px] font-bold text-left w-full">{name}</p>
            <p className=" text-gray-500 text-[12px] mt-[5px] text-left w-[70%]">
              {role === "67fc24eb88df30b9541815ec" ? "Admin" : "Employee"}
            </p>
          </div>
          <div className="text-gray-600 cursor-pointer text-xl border-2 rounded-[50%] ml-5">
            <IoIosArrowDown
              onClick={() => {
                setLogout(!logout);
              }}
            />
          </div>

          {logout && (
            <div className="absolute bg-white right-5 z-10 mt-2 w-[200%] origin-top-right rounded-[20px] focus:outline-none ">
              <div className="absolute right-3 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                <div className="flex flex-col divide-y divide-gray-200">
                  <div className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <IoLogOutOutline className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                    <span onClick={handleLogout}>Log out</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
