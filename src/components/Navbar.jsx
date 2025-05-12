import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import apiRoutes from "../../apiRoutes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NotificationDropdown from "../components/NotificationDropdown";
// Icon
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";

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
  const [roleData, setRoleData] = useState([]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    setName("");
    setRole("");
    setAvatar("");
    setLogout(false);

    await Swal.fire({
      text: "Logged out successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    navigate("/", { replace: true });
  };

  const token = localStorage.getItem("token");
  let decodedToken = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  useEffect(() => {
    if (token) {
      setName(`${decodedToken.firstName}  ${decodedToken.lastName}`);
      setRole(decodedToken.role);
      setAvatar(decodedToken.avatar);
    } else {
      console.error("Token không tồn tại hoặc không hợp lệ.");
    }
  }, [decodedToken]);

  // Get all role
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiRoutes.role.getRole, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

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
        {decodedToken && (
          <NotificationDropdown employeeID={decodedToken.employeeID} />
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
            alt="avatar"
            src={apiRoutes.file.avatar(avatar)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "src/assets/avatar.png";
            }}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-grow ml-[25px] ">
            <p className="text-[14px] font-bold text-left w-full">{name}</p>
            <p className=" text-gray-500 text-[12px] mt-[5px] text-left w-[70%] capitalize">
              {roleData.find((r) => r._id === role)?.name}
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
            <div className="absolute bg-white right-5 top-[130%] z-10 m w-[300%] origin-top-right rounded-[20px] focus:outline-none ">
              <div className="absolute right-1 z-10 w-auto origin-top-right rounded-lg shadow-lg bg-white">
                <div className="flex flex-col divide-y divide-gray-200">
                  <div className="flex items-center px-4 py-3 text-[15px] border-b text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <MdOutlineManageAccounts className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                    <span
                      onClick={() => {
                        navigate(`/profile/${decodedToken._id}`),
                          setLogout(!logout);
                      }}
                    >
                      View Profile
                    </span>
                  </div>
                </div>
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
