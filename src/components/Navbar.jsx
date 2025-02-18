import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import avatar from "../assets/avatar.png";

// Icon
import { AiOutlineMenu } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";

const countries = [
  { name: "Vietnam", flag: "https://flagcdn.com/w320/vn.png" },
  { name: "English", flag: "https://flagcdn.com/w320/gb.png" },
];
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dataUser, setUserData] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    const employeeId = decodedToken.employeeID;

    if (employeeId) {
      axios
        .get(`http://localhost:3000/api/user/${employeeId}`)
        .then((response) => {
          setUserData(response.data);
          // alert(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error(
            "Lỗi khi lấy thông tin người dùng:",
            error.response?.data || error.message
          );
        });
    } else {
      console.error("Token không chứa employeeID, vui lòng kiểm tra lại.");
    }
  }, []);

  return (
    <div className="h-[60px] w-screen flex items-center">
      <AiOutlineMenu className="h-[25px] w-[25px] mr-[30px] ml-[20px]" />
      {/* Search */}
      <div className="relative ">
        <CiSearch className="absolute top-[50%] left-4 transform -translate-y-1/2 w-[20px] h-[20px] " />
        <input
          type="text"
          placeholder="Search"
          className="h-[40px] w-[424px] pl-12 rounded-[19px] border-2 bg-[#F5F6FA] border-gray-300 focus:outline-none text-[13px] focus:border-[#2EB67D] hover:border-[#2EB67D]"
        />
      </div>
      <IoNotifications
        className="w-[25px] h-[25px] ml-[18%]"
        // onClick={getUser}
      />
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
      <div className="flex items-center p-4 rounded-lg w-[250px] h-[60px] bg-white ml-[20px] ">
        {/* Avatar */}
        <img
          src={avatar} //change avatar later
          alt={avatar}
          className="w-12 h-12 rounded-full"
        />

        {/* User Info */}
        <div className="flex-grow ml-[25px]">
          <p className="text-[14px] font-bold text-left">
            {dataUser.firstName + " " + dataUser.lastName}
          </p>
          <p className=" text-gray-500 text-[12px] mt-[5px] text-left">
            {dataUser.role}
          </p>
        </div>

        {/* Dropdown Icon */}
        <div className="text-gray-600 cursor-pointer text-xl border-2 rounded-[50%]">
          <IoIosArrowDown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
