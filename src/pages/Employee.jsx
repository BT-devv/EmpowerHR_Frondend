import { useState, useEffect, useRef } from "react";
import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
import apiRoutes from "../../apiRoutes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Modal from "react-modal";
import { format } from "date-fns";
import Swal from "sweetalert2";
import avatar from "../assets/avatar.png";
// icon
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { LuSquareArrowLeft } from "react-icons/lu";
import { LuSquareArrowRight } from "react-icons/lu";
import { HiOutlinePhoto } from "react-icons/hi2";
import { PiGridFourThin } from "react-icons/pi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { BsFilterLeft } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";

Modal.setAppElement("#root");
const Team = () => {
  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false); //Dropdown gende
  const [isRoleOpen, setIsRoleOpen] = useState(false); //Dropdown role
  const [isTypeOpen, setIsTypeOpen] = useState(false); //Dropdown type
  const dropdownRef = useRef(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [more, setMore] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [nextEmployeeID, setNextEmployeeID] = useState("");

  // modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isIdCardVisible, setIsIdCardVisible] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // fields
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [idCard, setIdCard] = useState("");
  const [gender, setGender] = useState("Choose your gender");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("Choose employee type");
  const [role, setRole] = useState("Choose employee role");
  // const [avatar, setAvatar] = useState("");

  const genderData = ["Male", "Female", "Other"];
  const roleData = ["Admin", "Project Manager", "Staff"];
  const typeData = ["Full-time", "Fart-time", "Collabration", "Intern"];

  const [passwordCheck, setPasswordCheck] = useState("");

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, data.length);

  // Open model check before delete user
  const openCheckModal = () => {
    setIsCheckModalOpen(true);
  };

  const closeCheckModal = () => {
    setIsCheckModalOpen(false);
    setError("");
    setPassword("");
  };

  // Open model success delete user
  const openSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsDetailModalOpen(false);
    }, 500);
    window.location.reload();
  };

  // Hide/show ID card number
  const toggleIdCardVisibility = () => {
    setIsIdCardVisible(!isIdCardVisible);
  };

  // Dropdown selection of gender
  const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);
  const handleOptionClick1 = (option) => {
    setGender(option);
    setIsGenderOpen(false);
  };
  // Dropdown selection of role
  const toggleRoleDropdown = () => setIsRoleOpen(!isRoleOpen);
  const handleOptionClick2 = (option) => {
    setRole(option);
    setIsRoleOpen(false);
  };
  // Dropdown selection of type
  const toggleTypeDropdown = () => setIsTypeOpen(!isTypeOpen);
  const handleOptionClick3 = (option) => {
    setType(option);
    setIsTypeOpen(false);
  };

  // Get date
  const currentDate = format(new Date(), "dd MMM, yyyy");

  // Prevent click outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsGenderOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get all users
  useEffect(() => {
    axios
      .get(apiRoutes.user.getAll)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get employeeID
  useEffect(() => {
    axios
      .post(apiRoutes.user.getNextEmployeeID)
      .then((response) => {
        setNextEmployeeID(response.data.employeeID);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const handleCreate = async () => {
    // Form validation
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      phoneNumber.trim() === "" ||
      !dateOfBirth ||
      gender === "Choose your gender" ||
      type === "Choose employee type" ||
      role === "Choose employee role" ||
      address.trim() === ""
    ) {
      Swal.fire({
        text: "Please fill out all required fields.",
        icon: "error",
      });
      return;
    }

    const newUserData = {
      email: email + "@example.com",
      password: password,
      firstName: firstName,
      lastName: lastName,
      employeeType: "Fulltime",
      role: role,
      department: department,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phoneNumber: phoneNumber,
      address: address,
      idCardNumber: idCard,
      avatar: "https://example.com/avatar.jpg",
    };
    alert(JSON.stringify(newUserData));

    try {
      const response = await axios.post(
        apiRoutes.posts.createUser,
        newUserData
      );

      const { success, message, token } = response.data;

      if (success) {
        localStorage.setItem("token", token);

        Swal.fire({
          text: message,
          icon: "success",
        });

        setModalIsOpen(false);
        window.location.reload();
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      // Split error
      const serverErrorMessage = error.response?.data?.error;
      if (serverErrorMessage) {
        const errors = serverErrorMessage
          .replace("User validation failed:", "")
          .split(".,")
          .map((err) => err.trim())
          .filter((err) => err);

        errors.forEach((err) => {
          if (err.includes("dateOfBirth")) {
            Swal.fire({
              text: "Employee must be at least 18 years old.",
              icon: "error",
            });
          } else if (err.includes("idCardNumber")) {
            Swal.fire({
              text: "Invalid ID Card Number. Please check your input.",
              icon: "error",
            });
          } else if (err.includes("phoneNumber")) {
            Swal.fire({
              text: "Invalid phone number format.",
              icon: "error",
            });
          } else if (err.includes("role")) {
            Swal.fire({
              text: "Invalid role selected.",
              icon: "error",
            });
          } else if (err.includes("employeeType")) {
            Swal.fire({
              text: "Invalid employee type provided.",
              icon: "error",
            });
          } else {
            Swal.fire({
              text: err,
              icon: "error",
            });
          }
        });
      } else {
        alert(error.response?.data?.error);
        Swal.fire({
          text: "An error occurred while sending data. Please try again later.",
          icon: "error",
        });
      }
    }
  };

  // Delete user
  const verifyDelete = async () => {
    try {
      const response = await axios.delete(
        apiRoutes.user.profile(selectedEmployee._id)
      );
      if (response.status === 200) {
        closeCheckModal();
        openSuccessModal();
      } else {
        setError("Error deleting the profile");
      }
    } catch (error) {
      setError("Failed to delete the profile: " + error.message);
    }
  };

  // Close model add user
  const closeModal = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setProvince("");
    setPostcode("");
    setCity("");
    setDateOfBirth(null);
    setGender("Choose your gender");
    setType("");
    setRole("");
    setDepartment("");
    setIdCard("");
    setPhoneNumber("");
    setModalIsOpen(false);
  };

  // Get user by click
  const handleRowClick = async (item) => {
    setSelectedEmployee(item);
    setIsDetailModalOpen(true);
  };

  // Format date of birth
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex ">
      <Slidebar className="w-[250px]" />
      <div className="flex flex-col flex-grow w-full">
        <Navbar />
        {/* more */}
        <div className="w-full">
          <div className="flex p-4 mt-[15px] ">
            {/* search */}
            <div className="relative mr-[20px]">
              <CiSearch className="absolute top-[50%] left-4 transform -translate-y-1/2 w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Search by name, role, department..."
                className="h-[50px] w-[331px] pl-12 rounded-[12px] border-2 bg-white border-gray-200 focus:outline-none text-[15px] text-black focus:border-[#2EB67D] hover:border-[#2EB67D]"
              />
            </div>
            {/* filter */}
            <div className="flex relative mr-[80px]">
              <div
                className={`flex items-center h-[50px] w-[100px] px-4 rounded-tl-[12px] rounded-bl-[12px] border-t-2 border-b-2 border-l-2 caret-transparent ${
                  viewMode === "list"
                    ? "bg-[#C5C5C5]"
                    : "bg-white hover:bg-[#C5C5C5]"
                } border-gray-200 text-[15px] cursor-pointer`}
                onClick={() => setViewMode("list")}
              >
                <BsFilterLeft className="w-[20px] h-[20px]" />
                <span className="ml-[10px]">List</span>
              </div>
              <div
                className={`flex items-center h-[50px] w-[100px] px-4 rounded-tr-[12px] rounded-br-[12px] border-t-2 border-b-2 border-r-2 caret-transparent ${
                  viewMode === "grid"
                    ? "bg-[#C5C5C5]"
                    : "bg-white hover:bg-[#C5C5C5]"
                } border-gray-200 text-[15px] cursor-pointer`}
                onClick={() => setViewMode("grid")}
              >
                <PiGridFourThin className="w-[20px] h-[20px]" />
                <span className="ml-[10px]">Grid</span>
              </div>
            </div>
            {/* all department */}
            <div className="relative mr-[20px]">
              <button className="flex items-center justify-between h-[50px] w-[196px] px-4 rounded-[12px] border-2 bg-white border-gray-200 focus:outline-none text-[15px] hover:border-[#2EB67D] focus:border-[#2EB67D]  ">
                <span className="ml-[10px]">All Departments</span>
                <IoIosArrowDown className="w-[20px] h-[20px]" />
              </button>
            </div>

            {/* Calendar */}
            <div className="relative mr-[20px] caret-transparent cursor-default">
              <CiCalendarDate className="absolute top-[50%] left-4 transform -translate-y-1/2 w-[20px] h-[20px]" />
              <div className="flex items-center top-[50%] h-[50px] w-[169px] pl-12 rounded-[12px] border-2 bg-white border-gray-200 focus:outline-none text-[15px] text-black">
                {currentDate}
              </div>
            </div>
            {/* button add */}
            <div className="mr-[15px]">
              <button
                onClick={() => setModalIsOpen(true)}
                className="h-[50px] w-[180px] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D]  text-[15px]"
              >
                Add new employee
              </button>
            </div>
            {/* Modal create user */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel="Modal Create User"
              shouldCloseOnOverlayClick={false}
              className="bg-white rounded-[15px] shadow-lg w-auto p-6 transition-all duration-500"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex space-x-14">
                <div className="ml-[10px]">
                  <button className="flex flex-col ml-[20px] border-[1px] mr-[15px] rounded-[50%] w-[180px] h-[180px] bg-[#EAEAEA] border-[#C5C5C5] text-[#C5C5C5] text-[10px] justify-center items-center  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2">
                    <HiOutlinePhoto className="w-[25px] h-[25px]" />
                    <p className="w-[120px] mt-[5px]">
                      Image: png, jpg, jpeg. Size Maximum: 1mb. Resolution:
                      500x500px.
                    </p>
                  </button>
                  {/* <img
                  src="srcassetsBlobsVector.png"
                  alt="avatar"
                  className="border-[1px] mr-[15px] rounded-[50%] w-[180px] h-[180px] bg-[#EAEAEA] border-[#C5C5C5]"
                /> */}
                  <p className="flex ml-[8px] bg-[#EAEAEA] text-[#2EB67D] text-[31px] justify-center items-center w-[230px] caret-transparent border-[#C5C5C5] rounded-[10px] border-[1px] mt-[20px]">
                    {nextEmployeeID}
                  </p>
                </div>
                <div className="flex flex-col">
                  {/* First Name & Last Name */}
                  <div className="flex space-x-14">
                    <div>
                      <p className="text-[15px] font-bold caret-transparent">
                        First name
                      </p>
                      <input
                        type="text"
                        className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold caret-transparent">
                        Last name
                      </p>
                      <input
                        type="text"
                        className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="mt-[10px] w-full">
                    <p className="text-[15px] font-bold caret-transparent">
                      Email
                    </p>
                    <div className="relative mt-[5px] w-full">
                      <input
                        type="text"
                        placeholder="Enter email"
                        className="border-[#C5C5C5] rounded-[8px] border-[1px] w-full h-[40px] pr-[100px] pl-[15px] text-[15px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                      <span className="absolute top-1/2 right-[10px] transform -translate-y-1/2 text-black">
                        @hrempow.com
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-14">
                    <div>
                      <p className="mt-[10px] text-[15px] font-bold caret-transparent">
                        Department
                      </p>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                        }}
                        className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px]  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                      ></input>
                    </div>
                    {/* role */}
                    <div>
                      <p className="mt-[10px] text-[15px] font-bold caret-transparent">
                        Employee role
                      </p>
                      <div className="relative">
                        <button
                          type="button"
                          className="inline-flex border-2 w-[300px] h-[41px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                          id="menu-button"
                          aria-expanded="true"
                          aria-haspopup="true"
                          onClick={toggleRoleDropdown}
                        >
                          <span className="text-[15px]">{role}</span>
                          <IoIosArrowDown />
                        </button>
                      </div>
                      {isRoleOpen && (
                        <div className="absolute z-10 mt-2 w-[300px] bg-white rounded-md shadow-lg border border-gray-200">
                          <ul className="py-1">
                            {roleData.map((option, index) => (
                              <li
                                key={index}
                                onClick={() => handleOptionClick2(option)}
                                className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* type */}
                      <p className="mt-[10px] text-[15px] font-bold caret-transparent">
                        Employee type
                      </p>
                      <div className="relative">
                        <button
                          type="button"
                          className="inline-flex border-2 w-[300px] h-[41px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                          id="menu-button"
                          aria-expanded="true"
                          aria-haspopup="true"
                          onClick={toggleTypeDropdown}
                        >
                          <span className="text-[15px">{type}</span>
                          <IoIosArrowDown />
                        </button>
                      </div>
                      {isTypeOpen && (
                        <div className="absolute z-10 mt-2 w-[300px] bg-white rounded-md shadow-lg border border-gray-200">
                          <ul className="py-1">
                            {typeData.map((option, index) => (
                              <li
                                key={index}
                                onClick={() => handleOptionClick3(option)}
                                className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#B8BDC5] border-1 w-full mt-[20px]"></div>
              <div className="flex mt-[15px] ml-[10px]">
                <div>
                  <p className="text-[15px] space-x-5 font-bold caret-transparent">
                    Phone number
                  </p>
                  <input
                    type="tel"
                    className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="ml-[20px]">
                  <p className="text-[15px] font-bold caret-transparent">
                    Address
                  </p>
                  <input
                    type="text"
                    className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[620px] h-[40px] mt-[5px] pl-[15px]  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flex mt-[10px] space-x-5 ml-[10px]">
                <div>
                  <p className="text-[15px] font-bold caret-transparent">
                    Province
                  </p>
                  <input
                    type="text"
                    className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px]  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                    }}
                  ></input>
                </div>
                <div>
                  <p className="text-[15px] font-bold caret-transparent">
                    City
                  </p>
                  <input
                    type="text"
                    className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px]  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  ></input>
                </div>
                <div>
                  <p className="text-[15px] font-bold caret-transparent">
                    Postcode
                  </p>
                  <input
                    type="text"
                    className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                    value={postcode}
                    onChange={(e) => {
                      setPostcode(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flex mt-[10px] space-x-5 ml-[10px]">
                <div
                  className="relative inline-block text-left "
                  ref={dropdownRef}
                >
                  <p className="text-[15px] font-bold caret-transparent">
                    Gender
                  </p>
                  <div className="relative">
                    <button
                      type="button"
                      className="inline-flex w-[300px] h-[41px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                      id="menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={toggleGenderDropdown}
                    >
                      <span className="text-[15px]">{gender}</span>
                      <IoIosArrowDown />
                    </button>
                  </div>
                  {isGenderOpen && (
                    <div className="absolute bottom-[calc(70%)] z-10 mt-2 w-[300px] bg-white rounded-md shadow-lg border border-gray-200">
                      <ul className="py-1">
                        {genderData.map((option, index) => (
                          <li
                            key={index}
                            onClick={() => handleOptionClick1(option)}
                            className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                          >
                            {option}
                          </li>
                        ))}
                        x
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-bold caret-transparent">
                    D.O.B
                  </p>
                  <div className="relative mt-[5px] w-[300px] h-[41px]">
                    <DatePicker
                      selected={dateOfBirth}
                      onChange={(date) => setDateOfBirth(date)}
                      placeholderText="Choose your date of birth"
                      className="w-[300px] border border-gray-300 text-gray-900 text-sm rounded-lg  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 block pr-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <IoIosArrowDown />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[15px] font-bold caret-transparent">
                    ID card number
                  </p>
                  <input
                    type="text"
                    className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px]  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                    value={idCard}
                    onChange={(e) => {
                      setIdCard(e.target.value);
                    }}
                  ></input>
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-end mr-[10px]">
                <button
                  onClick={closeModal}
                  className="mt-4 bg-white text-[#FF6262] w-[200px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="mt-4 bg-[#E7F7EF] text-[#097C44] w-[200px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                >
                  Create
                </button>
              </div>
            </Modal>
          </div>
          {/* list employees*/}
          {viewMode === "list" ? (
            <div className="overflow-x-auto mt-[20px] text-[15px] ml-[15px]">
              <table className="border-collapse bg-white rounded-[20px] overflow-hidden w-full ">
                <thead>
                  <tr className="bg-[#E2E2E2] text-left">
                    <th className="px-7 py-4 border-b border-gray-300">
                      <input
                        type="checkbox"
                        disabled
                        className="h-5 w-5 mt-[8px] border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-4 border-b border-gray-300 caret-transparent">
                      Employee
                    </th>
                    <th className="px-6 py-4 border-b border-gray-300 caret-transparent">
                      Role
                    </th>
                    <th className="px-6 py-4 border-b border-gray-300 caret-transparent">
                      Employment Type
                    </th>
                    <th className="px-6 py-4 border-b border-gray-300 caret-transparent">
                      Status
                    </th>
                    <th className="px-6 py-4 border-b border-gray-300 caret-transparent">
                      Email
                    </th>
                    <th className="px-6 py-4 border-b border-gray-300 caret-transparent">
                      Phone number
                    </th>
                    <th className="px-7 py-4 border-b border-gray-300 caret-transparent">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr
                      key={item.employee}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => {
                        if (e.target.type !== "checkbox") {
                          handleRowClick(item);
                        }
                      }}
                    >
                      <td className="px-7 py-3 border-b border-gray-200">
                        <input
                          type="checkbox"
                          className="h-5 w-5 checked:bg-[#2EB67D] checked:border-[#2EB67D] border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        <div className="flex items-center w-[200px]">
                          <img
                            src={avatar}
                            alt={avatar}
                            className="mr-[15px] rounded-[50px] w-[40px] h-[40px]"
                          />
                          {`${item.firstName} ${item.lastName}`}
                        </div>
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        <div className="truncate w-[80px] text-left">
                          {item.department}
                        </div>
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        <span
                          className={`px-2 py-1 border rounded-md text-sm ${
                            item.employeeType === "Fulltime"
                              ? "text-[#534FEB] border-[#534FEB] bg-[#534FEB] bg-opacity-10"
                              : ""
                          } ${
                            item.employeeType === "Partime"
                              ? "text-[#1C6CE5] border-[#1C6CE5] bg-[#1C6CE5] bg-opacity-10"
                              : ""
                          } ${
                            item.employeeType === "Collab"
                              ? "text-[#FF0000] border-[#FF0000] bg-[#FF0000] bg-opacity-10"
                              : ""
                          }`}
                        >
                          {item.employeeType === "Fulltime"
                            ? "Full-Time"
                            : item.employeeType === "Partime"
                            ? "Part-Time"
                            : item.employeeType === "Collab"
                            ? "Collaboration"
                            : "Intern"}
                        </span>
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        <span
                          className={`px-2 py-1 border rounded-md text-sm ${
                            item.status === "Active"
                              ? "text-[#069855] border-[#069855] bg-[#069855] bg-opacity-10"
                              : ""
                          } ${
                            item.status === "Inactive"
                              ? "text-[#D39C1D] border-[#D39C1D] bg-[#D39C1D] bg-opacity-10"
                              : ""
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        <div className="truncate w-[150px] text-left">
                          {item.email}
                        </div>
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        <div className="truncate w-[130px]">
                          {item.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        {item.view}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-4">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#EAEAEA] w-[280px] h-[330px] mt-[20px] ml-[15px] rounded-[15px]"
                >
                  <div className="flex space-x-[120px]">
                    <div className="mt-[10px] ml-[15px] ">
                      <img
                        src={avatar}
                        alt={avatar}
                        className="rounded-[50px] w-[85px] h-[85px] ml-[10px]"
                      />
                      <div className="text-left mt-[10px] ml-[10px]">
                        <p className="font-bold uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                          {`${item.firstName} ${item.lastName}`}
                        </p>
                        <p className="text-[#979797] text-[14px]">
                          {item.department}
                        </p>
                      </div>
                    </div>
                    <BiDotsHorizontalRounded className="w-[35px] h-[35px] mt-[10px] cursor-pointer" />
                  </div>
                  <div className="bg-[#FFFFFF] rounded-[15px] h-[48%] w-[93%] ml-[10px] mt-[15px]">
                    <div className="flex space-x-[30%] text-[14px] ml-[15px] text-left">
                      <div className="mt-[5%]">
                        <p className="text-[#979797]">Department</p>
                        <p className="font-bold">{item.department}</p>
                      </div>
                      <div className="mt-[5%]">
                        <p className="text-[#979797]">Hired date</p>
                        <p className="font-bold">{item.hiredDate}</p>
                      </div>
                    </div>
                    <div className="ml-[15px] mt-[15%]">
                      <div className="flex items-center">
                        <AiOutlineMail className="text-[#5ADAA4] w-[20px] h-[20px] mr-[10px]" />
                        <p className="text-[13px]">{item.email}</p>
                      </div>
                      <div className="flex mt-[5%]">
                        <FiPhone className="text-[#5ADAA4] w-[20px] h-[20px] mr-[10px]" />
                        <p className="text-[13px]">{item.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal detail employee */}
        {selectedEmployee && (
          <Modal
            isOpen={isDetailModalOpen}
            onRequestClose={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setIsAnimating(false);
                setIsDetailModalOpen(false);
              }, 500);
            }}
            contentLabel="Employee Details"
            shouldCloseOnOverlayClick={false}
            className={`bg-white h-screen rounded-tl-[20px] w-[calc(68%)] ${
              isAnimating
                ? "animate-slideOutToRight"
                : "animate-slideInFromRight"
            }`}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center "
          >
            <div className="flex flex-col ml-[20px] mt-4 ">
              <div className="flex justify-between">
                <IoIosArrowRoundBack
                  className="w-[40px] h-[40px] cursor-pointer"
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setIsAnimating(false);
                      setIsDetailModalOpen(false);
                    }, 500);
                  }}
                />
                <div className="relative inline-block text-left">
                  <BiDotsHorizontalRounded
                    className="w-[40px] h-[40px] cursor-pointer mr-[20px]"
                    onClick={() => {
                      setMore(!more);
                    }}
                  />
                  {more && (
                    <div
                      className="absolute right-5 z-10 mt-2 w-56 origin-top-right rounded-md border-[#C5C5C5] shadow-[5px_5px_#C5C5C5] ring-1 ring-black/5 focus:outline-none border-2"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                      // onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 space-y-4">
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-[15px] bg-white text-gray-700 hover:bg-gray-100 border-[#979797] rounded-[5px]"
                        >
                          Edit profile
                        </button>
                        <button
                          type="button"
                          onClick={openCheckModal}
                          className="block w-full px-4 py-2 text-left text-[15px] bg-white text-gray-700 hover:bg-gray-100 border-[#FF0000] rounded-[5px]"
                        >
                          Delete profile
                        </button>
                        {/* Model delete user */}
                        <Modal
                          isOpen={isCheckModalOpen}
                          onRequestClose={closeCheckModal}
                          contentLabel="Delete Profile"
                          className="bg-white w-[500px] p-6 rounded-lg shadow-lg"
                          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                        >
                          <h2 className="text-[25px] font-bold text-red-600 flex justify-center">
                            DELETE EMPLOYEE !
                          </h2>
                          <p className="mt-4 flex justify-center">
                            {selectedEmployee.firstName}{" "}
                            {selectedEmployee.lastName} {" - "}
                            {selectedEmployee.employeeID} will be deleted from
                            all current projects and moved to Recycle Bin.
                          </p>
                          <p className="mt-8 flex justify-center text-[15px]">
                            Re-enter your admin password to confirm:
                          </p>

                          {/* Input password */}
                          <input
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md justify-center items-center"
                            placeholder="Enter your admin password"
                          />

                          {/* Error message */}
                          {error && (
                            <p className="text-red-500 mt-2">{error}</p>
                          )}

                          {/* Footer buttons */}
                          <div className="mt-6 flex justify-between">
                            <button
                              onClick={closeCheckModal}
                              className="px-10 py-2 border-[#FF2323] bg-white  rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={verifyDelete}
                              className="px-10 py-2 bg-[#C0F9DD] border-[#979797] rounded-md"
                            >
                              Proceed
                            </button>
                          </div>
                        </Modal>
                        {/* Modal success delete user */}
                        <Modal
                          isOpen={isSuccessModalOpen}
                          onRequestClose={closeSuccessModal}
                          contentLabel="Delete Profile"
                          className="bg-white w-[500px] p-6 rounded-lg shadow-lg"
                          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                        >
                          <div className="flex flex-col justify-center items-center">
                            <img
                              alt="logo"
                              src="src/assets/star.png"
                              className="w-[120px] h-[120px] mb-4"
                            />
                            <p className="text-center mt-[10px]">
                              Successfully deleted {selectedEmployee.firstName}{" "}
                              {selectedEmployee.lastName} from all recent
                              project and moved to Recycle Bin folder.
                            </p>
                          </div>
                          {/* Footer buttons */}
                          <div className="mt-6 flex justify-between">
                            <button
                              onClick={closeSuccessModal}
                              className="px-5 py-2 border-[#979797] bg-white text-[14px] rounded-md"
                            >
                              Close
                            </button>
                            <div>
                              <button className="px-5 py-2 border-[#979797] rounded-md flex items-center text-[14px]">
                                Go to the Recycle Bin folder
                                <IoIosArrowRoundForward className="w-[30px] h-[25px]" />
                              </button>
                            </div>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}
                  {more && (
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => {
                        setMore(false);
                      }}
                    ></div>
                  )}
                </div>
              </div>
              <div className="flex mt-[10px] ml-[50px]">
                <div>
                  <img
                    src={avatar}
                    alt={avatar}
                    className="border-[1px] rounded-[50%] w-[180px] h-[180px] bg-[#EAEAEA] border-[#C5C5C5]"
                  />
                  <p className="text-[#2EB67D] text-[30px] w-[220px] mt-[10px] font-bold mr-[20px] ml-[-10px]">
                    {selectedEmployee.employeeID}
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <p className="text-[30px] ">
                      {`${selectedEmployee.firstName} ${selectedEmployee.lastName} `}
                    </p>
                    <div
                      className={`px-2 py-1 border text-sm rounded-[15px] mt-[8px]
                      ${
                        selectedEmployee.status === "Active"
                          ? "w-auto h-[30px] px-3 ml-[20px] bg-[#B2FDDE] border-[#069855] border-2"
                          : ""
                      }
                      ${
                        selectedEmployee.status === "Inactive"
                          ? "border-[#D39C1D] bg-[#D39C1D] bg-opacity-10 w-auto h-[30px] px-3 ml-[20px] border-2"
                          : ""
                      }`}
                    >
                      {selectedEmployee.status}
                    </div>
                  </div>
                  <p className="mt-[10px]">{selectedEmployee.email}</p>
                  <div className="flex">
                    <img
                      src="https://flagcdn.com/w320/vn.png"
                      alt="country"
                      className="w-[35px] h-[20px] mr-[10px] rounded-[9px]"
                    />
                    <p>{selectedEmployee.phoneNumber}</p>
                  </div>
                  <div className="flex space-x-[70%] mt-[20px] text-[16px]">
                    <div className="space-y-2">
                      <p className="font-bold">Department</p>
                      <p>{selectedEmployee.department}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold">Position</p>
                      <p>{selectedEmployee.employeeType}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-[30px] mt-[20px]">
                <button
                  type="button"
                  className="border-[#3CBD87] border-1 rounded bg-white"
                >
                  General
                </button>
                <button
                  type="button"
                  className="border-[#3CBD87] border-1 rounded bg-white"
                >
                  Detail
                </button>
                <div className="border-t border-black border-1 w-[calc(95%)]"></div>
              </div>
              <div className="flex ml-[30px] mt-[20px] space-x-8">
                <div>
                  <p className="font-bold mt-[10px]">Address</p>
                  <p className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[450px] h-[40px] mt-[5px] pl-[15px] flex items-center justify-between">
                    {selectedEmployee.address}
                  </p>
                  <p className="font-bold mt-[10px]">City</p>
                  <p className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[450px] h-[40px] mt-[5px] pl-[15px] flex items-center justify-between">
                    {selectedEmployee.city}
                  </p>
                  <div className="flex space-x-10">
                    <div>
                      <p className="font-bold mt-[10px]">Gender</p>
                      <p className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[100px] h-[40px] mt-[5px] pl-[15px] flex items-center justify-between">
                        {selectedEmployee.gender}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold mt-[10px]">D.O.B</p>
                      <p className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[200px] h-[40px] mt-[5px] pl-[15px] flex items-center justify-between">
                        {formatDate(selectedEmployee.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-bold mt-[10px]">Province</p>
                  <p className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[450px] h-[40px] mt-[5px] pl-[15px] flex items-center justify-between">
                    {selectedEmployee.province}
                  </p>
                  <p className="font-bold mt-[10px]">Postcode</p>
                  <p className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[450px] h-[40px] mt-[5px] pl-[15px] flex items-center justify-between">
                    {selectedEmployee.postcode}
                  </p>
                  <p className="font-bold mt-[10px]">ID card number</p>
                  <p className="border-[#C5C5C5] rounded-[8px] border-[1px] w-[300px] h-[40px] mt-[5px] pl-[15px] relative flex items-center justify-between">
                    <span>
                      {isIdCardVisible
                        ? selectedEmployee.idCardNumber
                        : "***********"}
                    </span>
                    <span
                      className="cursor-pointer mr-3"
                      onClick={toggleIdCardVisibility}
                    >
                      {isIdCardVisible ? (
                        <FaRegEyeSlash className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FaRegEye className="w-5 h-5 text-gray-500" />
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {/* infor bottom */}
        <div className="mt-[50px] ml-[15px] flex items-center justify-between caret-transparent">
          <p>
            Showing{" "}
            <b>
              {startIndex} to {endIndex} of {data.length}
            </b>{" "}
            employees
          </p>
          {/* Pagination */}
          <div className="flex items-center space-x-2 mr-[50px]">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3] ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <LuSquareArrowLeft />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3] ${
                  currentPage === index + 1
                    ? "bg-[#F5F5F5]"
                    : "bg-white border-[#F5F5F5] border-2"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3] ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <LuSquareArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
