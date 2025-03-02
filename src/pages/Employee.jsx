import { useState, useEffect, useRef } from "react";
import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
import apiRoutes from "../../apiRoutes";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
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
// import { PiGridFourThin } from "react-icons/pi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BiEdit } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
// import { BsFilterLeft } from "react-icons/bs";
// import { AiOutlineMail } from "react-icons/ai";
// import { FiPhone } from "react-icons/fi";
import { TbDeviceDesktop } from "react-icons/tb";
import { FaArrowTrendUp } from "react-icons/fa6";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

Modal.setAppElement("#root");
const Employee = () => {
  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  // const [isRoleOpen, setIsRoleOpen] = useState(false);
  // const [isTypeOpen, setIsTypeOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // const [error, setError] = useState("");
  // const [viewMode, setViewMode] = useState("list");
  // const [nextEmployeeID, setNextEmployeeID] = useState("");

  // fields
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailPersonal, setEmailPersonal] = useState("");
  const [emailCompany, setEmailCompany] = useState("");
  const [alias, setAlias] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [idCard, setIdCard] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [joiningDate, setJoiningDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [gender, setGender] = useState("Gender");
  // const [department, setDepartment] = useState("");
  // const [type, setType] = useState("Choose employee type");
  // const [role, setRole] = useState("Choose employee role");
  const [isActive, setIsActive] = useState(false);

  const genderData = ["Male", "Female", "Other"];
  // const roleData = ["Admin", "Project Manager", "Staff"];
  // const typeData = ["Full-time", "Fart-time", "Collabration", "Intern"];

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
  }, [currentPage, selectedEmployee]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, data.length);

  // Dropdown selection of gender
  const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);
  const handleOptionClick1 = (option) => {
    setGender(option);
    setIsGenderOpen(false);
  };
  // Dropdown selection of role
  // const toggleRoleDropdown = () => setIsRoleOpen(!isRoleOpen);
  // const handleOptionClick2 = (option) => {
  //   setRole(option);
  //   setIsRoleOpen(false);
  // };

  // Dropdown selection of type
  // const toggleTypeDropdown = () => setIsTypeOpen(!isTypeOpen);
  // const handleOptionClick3 = (option) => {
  //   setType(option);
  //   setIsTypeOpen(false);
  // };

  // Get date
  const currentDate = format(new Date(), "dd MMM, yyyy");

  // Format date of birth
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  const handleCreate = async () => {
    // Form validation
    // if (
    //   firstName.trim() === "" ||
    //   lastName.trim() === "" ||
    //   alias.trim() === "" ||
    //   idCard.trim() === "" ||
    //   !dateOfBirth ||
    //   gender === "Choose your gender" ||
    //   phoneNumber.trim() === "" ||
    //   emailCompany.trim() === "" ||
    //   address.trim() === "" ||
    //   emailPersonal.trim() === "" ||
    //   province.trim() === "" ||
    //   postcode.trim() === "" ||
    //   city.trim() === "" ||
    //   accountName.trim() === "" ||
    //   accountNumber.trim() === ""
    //   // type === "Choose employee type" ||
    //   // role === "Choose employee role" ||
    //   // type === "Choose employee type" ||
    //   // role === "Choose employee role" ||
    //   // !joiningDate
    // ) {
    //   Swal.fire({
    //     text: "Please fill out all required fields.",
    //     icon: "error",
    //   });
    //   return;
    // }

    const newUserData = {
      avatar: "https://example.com/avatar.jpg",
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      idCardNumber: idCard,
      dateOfBirth: dateOfBirth,
      gender: gender,
      employeeType: "Fulltime",
      phoneNumber: phoneNumber,
      emailCompany: emailCompany,
      address: address,
      emailPersonal: emailPersonal,
      province: province,
      postcode: postcode,
      bankName: bankName,
      accountName: accountName,
      accountNumber: accountNumber,
      // employeeType: employeeType,
      // department: department,
      // jobTitle: jobTitle,
      joiningDate: joiningDate,
      endDate: endDate,
    };
    alert(JSON.stringify(newUserData));

    // try {
    //   const response = await axios.post(
    //     apiRoutes.posts.createUser,
    //     newUserData
    //   );

    //   const { success, message, token } = response.data;

    //   if (success) {
    //     localStorage.setItem("token", token);

    //     Swal.fire({
    //       text: message,
    //       icon: "success",
    //     });

    //     setModalIsOpen(false);
    //     window.location.reload();
    //   } else {
    //     Swal.fire({
    //       text: message,
    //       icon: "error",
    //       timer: 2000,
    //     });
    //   }
    // } catch (error) {
    //   // Split error
    //   const serverErrorMessage = error.response?.data?.error;
    //   if (serverErrorMessage) {
    //     const errors = serverErrorMessage
    //       .replace("User validation failed:", "")
    //       .split(".,")
    //       .map((err) => err.trim())
    //       .filter((err) => err);

    //     errors.forEach((err) => {
    //       if (err.includes("dateOfBirth")) {
    //         Swal.fire({
    //           text: "Employee must be at least 18 years old.",
    //           icon: "error",
    //         });
    //       } else if (err.includes("idCardNumber")) {
    //         Swal.fire({
    //           text: "Invalid ID Card Number. Please check your input.",
    //           icon: "error",
    //         });
    //       } else if (err.includes("phoneNumber")) {
    //         Swal.fire({
    //           text: "Invalid phone number format.",
    //           icon: "error",
    //         });
    //       } else if (err.includes("role")) {
    //         Swal.fire({
    //           text: "Invalid role selected.",
    //           icon: "error",
    //         });
    //       } else if (err.includes("employeeType")) {
    //         Swal.fire({
    //           text: "Invalid employee type provided.",
    //           icon: "error",
    //         });
    //       } else {
    //         Swal.fire({
    //           text: err,
    //           icon: "error",
    //         });
    //       }
    //     });
    //   } else {
    //     alert(error.response?.data?.error);
    //     Swal.fire({
    //       text: "An error occurred while sending data. Please try again later.",
    //       icon: "error",
    //     });
    //   }
    // }
  };

  // Delete user
  // const verifyDelete = async () => {
  //   try {
  //     const response = await axios.delete(
  //       apiRoutes.user.profile(selectedEmployee._id)
  //     );
  //     if (response.status === 200) {
  //       closeCheckModal();
  //       openSuccessModal();
  //     } else {
  //       setError("Error deleting the profile");
  //     }
  //   } catch (error) {
  //     setError("Failed to delete the profile: " + error.message);
  //   }
  // };

  // Close model add user
  const closeModal = () => {
    // setEmail("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setProvince("");
    setPostcode("");
    setCity("");
    setDateOfBirth(null);
    setGender("Choose your gender");
    // setType("");
    // setRole("");
    // setDepartment("");
    setIdCard("");
    setPhoneNumber("");
    setModalIsOpen(false);
  };

  // Get user by click
  const handleRowClick = async (item) => {
    setSelectedEmployee(item);
  };

  // Format date of birth
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  return (
    <div className="flex ">
      <Slidebar />
      <div className="flex flex-col flex-grow w-screen">
        <Navbar />
        {selectedEmployee ? (
          <div className="flex flex-col bg-[#F5F6FA] w-full h-full relative">
            <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[77%] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="flex space-x-8 items-center mt-[2%] ml-[2%] text-[#1C1C1C] font-medium">
                <IoIosArrowRoundBack
                  className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                  onClick={() => setSelectedEmployee(null)}
                />
                <p>General</p>
                <p>Job</p>
                <p>Payroll</p>
                <p>Performance</p>
                <p>Documents</p>
                <p>Dependents</p>
              </div>
            </div>
            <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[77%] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="flex ml-[2%] mt-[2%]">
                {/* <img
                        alt="logo"
                        src="src/assets/star.png"
                        className="w-[220px] h-[220px] mb-4"
                      /> */}
                <div className="bg-red-200 w-[240px] h-[255px]"></div>
                <div className="ml-[3%]">
                  <div className="flex items-center justify-between mt-[1%]">
                    <p className="text-[20px] font-bold">
                      Personal Information
                    </p>
                    <BiEdit className="w-[25px] h-[25px] text-[#069855] mr-[-8%]" />
                  </div>
                  <div className="flex items-center space-x-3 mt-[1%]">
                    <p>{isActive ? "Active" : "Inactive"}</p>
                    <div
                      className={`w-14 h-7 flex items-center rounded-[4px] p-1 cursor-pointer transition-all ${
                        isActive ? "bg-[#B2CCC1]" : "bg-gray-300"
                      }`}
                      onClick={() => setIsActive(!isActive)}
                    >
                      <div
                        className={`w-5 h-5 bg-gray-800 rounded-[4px] transition-all ${
                          isActive ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-[150px] mt-[2%]">
                    <div>
                      <p className="w-fit text-[#828282]">ID Employee</p>
                      <p className="mt-[10%] font-bold">
                        {selectedEmployee.employeeID}
                      </p>
                    </div>
                    <div>
                      <p className="w-fit text-[#828282]">First Name</p>
                      <p className="mt-[10%] font-bold">
                        {selectedEmployee.firstName}
                      </p>
                    </div>
                    <div>
                      <p className="w-fit text-[#828282]">Last Name</p>
                      <p className="mt-[10%] font-bold">
                        {selectedEmployee.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="w-fit text-[#828282]">Alias</p>
                      <p className="mt-[10%] font-bold">Tuan Bui</p>
                    </div>
                  </div>
                  <div className="flex space-x-[150px] mt-[5%] mb-[4%]">
                    <div>
                      <p className="w-fit text-[#828282]">ID Card</p>
                      <p className="mt-[10%] font-bold">
                        {selectedEmployee.idCardNumber}
                      </p>
                    </div>
                    <div>
                      <p className="w-fit text-[#828282]">Date of Birth</p>
                      <p className="mt-[10%] font-bold">
                        {formatDate(selectedEmployee.dateOfBirth)}
                      </p>
                    </div>
                    <div>
                      <p className="w-fit text-[#828282]">Gender</p>
                      <p className="mt-[10%] font-bold">
                        {selectedEmployee.gender}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[77%] h-fit text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="ml-[2%]">
                <div className="flex items-center justify-between mt-[2%]">
                  <p className="text-[20px] font-bold">Contact Detail</p>
                  <BiEdit className="w-[25px] h-[25px] text-[#069855] mr-[2%]" />
                </div>
                <div>
                  <div className="grid grid-cols-2 mt-[2%]">
                    <div>
                      <p className="text-[#828282]">Phone Number</p>
                      <p className="font-bold mt-2">
                        {selectedEmployee.phoneNumber != ""
                          ? "--"
                          : selectedEmployee.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#828282]">Email Company</p>
                      <p className="font-bold mt-2">
                        {" "}
                        {selectedEmployee.emailCompany != ""
                          ? "--"
                          : selectedEmployee.emailCompany}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mt-[3%]">
                    <div>
                      <p className="text-[#828282]">Address</p>
                      <p className="font-bold mt-2">
                        {selectedEmployee.address != ""
                          ? "--"
                          : selectedEmployee.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#828282]">Email Person</p>
                      <p className="font-bold mt-2">
                        {selectedEmployee.emailPersonal != ""
                          ? "--"
                          : selectedEmployee.emailPersonal}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
                    <div>
                      <p className="text-[#828282]">Province</p>
                      <p className="font-bold mt-2">
                        {selectedEmployee.province != ""
                          ? "--"
                          : selectedEmployee.province}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-10">
                      <div>
                        <p className="text-[#828282]">Postcode</p>
                        <p className="font-bold mt-2">
                          {" "}
                          {selectedEmployee.postcode != ""
                            ? "--"
                            : selectedEmployee.postcode}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#828282]">City</p>
                        <p className="font-bold mt-2">
                          {" "}
                          {selectedEmployee.city != ""
                            ? "--"
                            : selectedEmployee.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[77%] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="ml-[2%]">
                <div className="flex items-center justify-between mt-[2%]">
                  <p className="text-[20px] font-bold">Bank Account</p>
                  <BiEdit className="w-[25px] h-[25px] text-[#069855] mr-[2%]" />
                </div>
                <div>
                  <div className="grid grid-cols-2 mt-[2%]">
                    <div>
                      <p className="text-[#828282]">Bank Account Name</p>
                      <p className="font-bold mt-2">
                        {" "}
                        {selectedEmployee.bankAccountName != ""
                          ? "--"
                          : selectedEmployee.bankAccountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#828282]">Account Name</p>
                      <p className="font-bold mt-2">--</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
                    <div>
                      <p className="text-[#828282]">Bank Account Number</p>
                      <p className="font-bold mt-2">
                        {" "}
                        {selectedEmployee.bankAccpuntNumber != ""
                          ? "--"
                          : selectedEmployee.bankAccpuntNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[77%] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="ml-[2%]">
                <div className="flex items-center justify-between mt-[2%]">
                  <p className="text-[20px] font-bold">Employee Access</p>
                  <BiEdit className="w-[25px] h-[25px] text-[#069855] mr-[2%]" />
                </div>
                <div>
                  <div className="grid grid-cols-4 mt-[2%]">
                    <div>
                      <p className="text-[#828282]">Employee Type</p>
                      <p className="font-bold mt-2">
                        {selectedEmployee.employeeType}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#828282]">Department</p>
                      <p className="font-bold mt-2">
                        {selectedEmployee.department}
                      </p>
                    </div>{" "}
                    <div>
                      <p className="text-[#828282]">Position</p>
                      <p className="font-bold mt-2">Manual QA</p>
                    </div>{" "}
                    <div>
                      <p className="text-[#828282]">Role</p>
                      <p className="font-bold mt-2">Manager</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
                    <div>
                      <p className="text-[#828282]">Joining Date</p>
                      <p className="font-bold mt-2">01/04/2023</p>
                    </div>{" "}
                    <div>
                      <p className="text-[#828282]">End Date</p>
                      <p className="font-bold mt-2">--</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[77%] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] mb-[2%]">
              <div className="mt-[2%] ml-[2%]">
                <div className="flex items-center justify-between">
                  <p className="text-[20px] font-bold">Credential</p>
                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      className="ml-[-70%] bg-[#2EB67D] text-white outline-none w-fit text-[18px] focus:outline-none flex items-center"
                      // onClick={handleSubmit}
                    >
                      <GoPlus className="w-[25px] h-[25px] mr-2" />
                      Credential
                    </button>
                  </div>
                </div>
                {/* table*/}
                <div className="text-[14px] ml-[15px] border-l border-b border-r w-fit mb-5">
                  <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden w-auto caret-transparent border-gray-200 border">
                    <thead>
                      <tr className="bg-[#010101] text-left">
                        <th className="px-5 py-3 caret-transparent text-white font-normal">
                          Credential
                        </th>
                        <th className="px-1 py-3 caret-transparent text-white font-normal">
                          Upload Date
                        </th>
                        <th className="px-5 py-3 caret-transparent text-white font-normal">
                          Documents
                        </th>
                        <th className="px-5 py-3 caret-transparent text-white font-normal">
                          Expiry day
                        </th>
                        <th className="px-5 py-3 caret-transparent text-white font-normal">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="cursor-pointer">
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[200px]  ">Photo ID</div>
                        </td>
                        <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]  ">
                            10-10-2025
                          </div>
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="w-[200px]">
                            <div className="bg-red-200 w-[40px] h-[40px] ml-[6%]"></div>
                          </div>
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[200px]  ">--</div>
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[90px]  ">--</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col bg-[#F5F6FA] w-full h-full relative">
            <div className="flex ml-[3%] space-x-13 mt-[2%]">
              {/* active */}
              <div className="bg-white w-[79%] h-[160px] rounded-[40px] flex justify-around items-center shadow-md p-6 relative">
                {/* Total Customers */}
                <div className="flex items-center space-x-4 relative">
                  <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                    <div className="bg-green-300 w-full h-full rounded-full opacity-20 absolute"></div>
                    <HiOutlineUsers className="text-green-400 w-10 h-10 relative" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Customers</p>
                    <p className="font-bold text-3xl">{data.length} </p>
                  </div>
                </div>

                {/* Active Now */}
                <div className="flex items-center space-x-4 relative">
                  <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                    <div className="bg-[#FF527D] w-full h-full rounded-full opacity-20 absolute"></div>
                    <TbDeviceDesktop className="text-[#FF527D] w-10 h-10 relative" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Active Now</p>
                    <p className="font-bold text-3xl">100</p>
                  </div>
                </div>
              </div>
              {/* overtime */}
            </div>
            <div className="flex flex-col bg-[#FFFFFF] w-[77%] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px]">
              <div className="flex w-full items-center ml-[1%] mt-[2%]">
                <div>
                  <p className="text-[#252C58] text-[20px] font-light">
                    Total Employee
                  </p>
                </div>
                {/* Search */}
                <div className="relative ml-[10%] flex items-center">
                  <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
                  <input
                    type="text"
                    placeholder="Quick Search"
                    className="h-[50px] w-[424px] pl-12 rounded-[10px] border-[1px] bg-[#FFFFFF] border-gray-300 focus:outline-none text-[13px] focus:border-[#2EB67D] hover:border-[#2EB67D] placeholder:text-[#252C58] placeholder:font-light placeholder:opacity-100"
                  />
                </div>
                {/* Filter */}
                <div className="relative mr-[20px] flex items-center caret-transparent cursor-default ml-[2%]">
                  <CiCalendarDate className="absolute left-4 w-[20px] h-[20px]" />
                  <div className="h-[50px] w-[169px] pl-12 rounded-[12px] border-2 bg-[#D5D9DD] border-gray-300 focus:outline-none text-[15px] text-black flex items-center font-light">
                    {currentDate}
                  </div>
                </div>
                {/* Button create new employee*/}
                <div className="mr-[15px]">
                  <button
                    className="text-white font-normal h-[50px] w-[180px] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
                    onClick={() => setModalIsOpen(true)}
                  >
                    Create Employee
                  </button>
                  {/* Modal create new employee */}
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    shouldCloseOnOverlayClick={false}
                    className="bg-white rounded-[20px] shadow-lg w-auto min-w-[80%] p-6 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                    overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <IoIosArrowRoundBack
                          className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                          onClick={closeModal}
                        />
                        <p className="text-[20px] font-bold">Create Employee</p>
                      </div>
                      <div className="bg-gray-300 min-w-[110%] h-0.5 mt-[1%] mb-[1%] ml-[-2%]"></div>
                    </div>
                    <div className="border-gray-200 border-2 rounded-[5px]">
                      <div className="flex mt-[2%]">
                        {/* avatar */}
                        <div className="ml-[10px] ">
                          <button className="flex flex-col rounded-none ml-[20px] border-[1px] mr-[15px] w-[240px] h-[240px] bg-[#EAEAEA] border-gray-400 text-[#C5C5C5] text-[10px] justify-center items-center  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2">
                            <HiOutlinePhoto className="w-[30px] h-[30px]" />
                            <p className="w-[150px] mt-[5px] text-[12px]">
                              Image: png, jpg, jpeg. Size Maximum: 1mb.
                              Resolution: 500x500px.
                            </p>
                          </button>
                        </div>
                        {/* text 1*/}
                        <div className="ml-[2%]">
                          <div className="flex items-center justify-between">
                            <p className="text-[20px] font-bold">
                              Personal Information
                            </p>
                            <div className="flex items-center space-x-3 ">
                              <p>{isActive ? "Active" : "Inactive"}</p>
                              <div
                                className={`w-14 h-7 flex items-center rounded-[4px] border border-gray-400 p-1 cursor-pointer transition-all ${
                                  isActive ? "bg-[#B2CCC1]" : "bg-gray-300"
                                }`}
                                onClick={() => setIsActive(!isActive)}
                              >
                                <div
                                  className={`w-5 h-5 bg-gray-800 rounded-[4px] transition-all ${
                                    isActive ? "translate-x-6" : "translate-x-0"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          {/* fields 1*/}
                          <div className="flex space-x-5">
                            <div>
                              {/* Col 1 */}
                              <div className="mt-[5%]">
                                <div className="flex">
                                  <p>First Name</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <input
                                  type="text"
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  value={firstName}
                                  placeholder="Input First Name"
                                  onChange={(e) => {
                                    setFirstName(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="mt-5">
                                <div className="flex">
                                  <p>ID Card</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <input
                                  type="text"
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  value={idCard}
                                  placeholder="Input ID Card"
                                  onChange={(e) => {
                                    setIdCard(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              {/* Col 2 */}
                              <div className="mt-[5%]">
                                <div className="flex">
                                  <p>Last Name</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <input
                                  type="text"
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  value={lastName}
                                  placeholder="Input Last Name"
                                  onChange={(e) => {
                                    setLastName(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="mt-5">
                                <div className="flex">
                                  <p>Date of Birth</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    value={dateOfBirth}
                                    onChange={(newDate) =>
                                      setDateOfBirth(newDate)
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                            <div className=" mr-[10%]">
                              {/* Col 3 */}
                              <div className="mt-[5%]">
                                <div className="flex">
                                  <p>Alias</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <input
                                  type="text"
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  value={alias}
                                  placeholder="Input Alias"
                                  onChange={(e) => {
                                    setAlias(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="mt-5 space-x-5">
                                <div
                                  className="relative inline-block text-left "
                                  ref={dropdownRef}
                                >
                                  <div className="flex">
                                    <p>Gender</p>
                                    <p className="text-[#E03137] ml-1">*</p>
                                  </div>
                                  <div className="relative">
                                    <div
                                      className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                      onClick={toggleGenderDropdown}
                                    >
                                      <span className="text-[15px]">
                                        {gender}
                                      </span>
                                      <IoIosArrowDown />
                                    </div>
                                  </div>
                                  {isGenderOpen && (
                                    <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                      <ul className="py-1">
                                        {genderData.map((option, index) => (
                                          <li
                                            key={index}
                                            onClick={() =>
                                              handleOptionClick1(option)
                                            }
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
                        </div>
                      </div>
                      {/* Text 2 */}
                      <div className="mt-[2%] ml-[3%]">
                        <p className="text-[20px] font-bold">Contact Details</p>
                        {/* fields 2*/}
                        <div className="flex space-x-7">
                          <div>
                            {/* Col 1 */}
                            <div className="mt-[3%]">
                              <div className="flex">
                                <p>Phone Number</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={phoneNumber}
                                placeholder="Input Phone Number"
                                onChange={(e) => {
                                  setPhoneNumber(e.target.value);
                                }}
                              />
                            </div>
                            <div className="mt-5">
                              <div className="flex">
                                <p>Address</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={address}
                                placeholder="Input Address"
                                onChange={(e) => {
                                  setAddress(e.target.value);
                                }}
                              />
                            </div>
                            <div className="mt-5">
                              <div className="flex">
                                <p>Province</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={province}
                                placeholder="Input Province"
                                onChange={(e) => {
                                  setProvince(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            {/* Col 2 */}
                            <div className="mt-[3%]">
                              <div className="flex">
                                <p>Email Company</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={emailCompany}
                                placeholder="Input Email Company"
                                onChange={(e) => {
                                  setEmailCompany(e.target.value);
                                }}
                              />
                            </div>
                            <div className="mt-5">
                              <div className="flex">
                                <p>Email Personal </p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={emailPersonal}
                                placeholder="Input Email Personal"
                                onChange={(e) => {
                                  setEmailPersonal(e.target.value);
                                }}
                              />
                            </div>
                            <div className="flex space-x-5">
                              <div className="mt-5">
                                <div className="flex">
                                  <p>Postcode</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <input
                                  type="text"
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  value={postcode}
                                  placeholder="Input Postcode"
                                  onChange={(e) => {
                                    setPostcode(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="mt-5">
                                <div className="flex">
                                  <p>City</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <input
                                  type="text"
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  value={city}
                                  placeholder="Input City"
                                  onChange={(e) => {
                                    setCity(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Text 3 */}
                      <div className="mt-[2%] ml-[3%]">
                        <p className="text-[20px] font-bold">Contact Details</p>
                        {/* fields 3*/}
                        <div className="flex space-x-7">
                          <div>
                            {/* Col 1 */}
                            <div className="mt-[3%]">
                              <p>Bank Name</p>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={bankName}
                                placeholder="Input Bank Name"
                                onChange={(e) => {
                                  setBankName(e.target.value);
                                }}
                              />
                            </div>
                            <div className="mt-5">
                              <div className="flex">
                                <p>Account Number</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={accountNumber}
                                placeholder="Input Account Number"
                                onChange={(e) => {
                                  setAccountNumber(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            {/* Col 2 */}
                            <div className="mt-[3%]">
                              <div className="flex">
                                <p>Account Name</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                value={accountName}
                                placeholder="Input Account Name"
                                onChange={(e) => {
                                  setAccountName(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Text 4 */}
                      <div className="mt-[2%] ml-[3%]">
                        <p className="text-[20px] font-bold">Employee Access</p>
                        {/* fields 4*/}
                        <div className="flex space-x-5">
                          {/* Col 1 */}
                          <div className="mt-5">
                            <div
                              className="relative inline-block text-left "
                              // ref={dropdownRef}
                            >
                              <div className="flex">
                                <p>Gender</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <div className="relative">
                                <div
                                  className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                  onClick={toggleGenderDropdown}
                                >
                                  <span className="text-[15px]">{gender}</span>
                                  <IoIosArrowDown />
                                </div>
                              </div>
                              {isGenderOpen && (
                                <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                  <ul className="py-1">
                                    {genderData.map((option, index) => (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          handleOptionClick1(option)
                                        }
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
                          <div className="mt-5">
                            <div
                              className="relative inline-block text-left "
                              // ref={dropdownRef}
                            >
                              <div className="flex">
                                <p>Gender</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <div className="relative">
                                <div
                                  className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                  onClick={toggleGenderDropdown}
                                >
                                  <span className="text-[15px]">{gender}</span>
                                  <IoIosArrowDown />
                                </div>
                              </div>
                              {isGenderOpen && (
                                <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                  <ul className="py-1">
                                    {genderData.map((option, index) => (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          handleOptionClick1(option)
                                        }
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
                          <div className="mt-5">
                            <div
                              className="relative inline-block text-left "
                              // ref={dropdownRef}
                            >
                              <div className="flex">
                                <p>Gender</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <div className="relative">
                                <div
                                  className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                  onClick={toggleGenderDropdown}
                                >
                                  <span className="text-[15px]">{gender}</span>
                                  <IoIosArrowDown />
                                </div>
                              </div>
                              {isGenderOpen && (
                                <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                  <ul className="py-1">
                                    {genderData.map((option, index) => (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          handleOptionClick1(option)
                                        }
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
                          <div className="mt-5">
                            <div
                              className="relative inline-block text-left "
                              // ref={dropdownRef}
                            >
                              <div className="flex">
                                <p>Gender</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <div className="relative">
                                <div
                                  className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                  onClick={toggleGenderDropdown}
                                >
                                  <span className="text-[15px]">{gender}</span>
                                  <IoIosArrowDown />
                                </div>
                              </div>
                              {isGenderOpen && (
                                <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                  <ul className="py-1">
                                    {genderData.map((option, index) => (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          handleOptionClick1(option)
                                        }
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
                        <div>
                          {/* Col 2 */}
                          <div className="flex space-x-6">
                            {/* Col 1 */}
                            <div className="mt-5">
                              <div className="flex">
                                <p>Joining Date</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={joiningDate}
                                  onChange={(newDate) =>
                                    setJoiningDate(newDate)
                                  }
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[540px] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                />
                              </LocalizationProvider>
                            </div>
                            <div className="mt-5">
                              <p>End Date</p>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={endDate}
                                  onChange={(newDate) => setEndDate(newDate)}
                                  className="border-gray-200 rounded-[5px] border-[1px] w-[540px] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Text 5 */}
                      <div className="mt-[2%] ml-[3%]">
                        <p className="text-[20px] font-bold">Credential</p>
                        {/* table*/}
                        <div className="text-[14px] ml-[15px] border-l border-b border-r w-fit mb-5">
                          <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden w-auto caret-transparent border-gray-200 border">
                            <thead>
                              <tr className="bg-[#010101] text-left">
                                <th className="px-5 py-3 caret-transparent text-white font-normal">
                                  Credential
                                </th>
                                <th className="px-1 py-3 caret-transparent text-white font-normal"></th>
                                <th className="px-5 py-3 caret-transparent text-white font-normal">
                                  Documents
                                </th>
                                <th className="px-5 py-3 caret-transparent text-white font-normal">
                                  Expiry day
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="cursor-pointer">
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  ">
                                    Photo ID
                                  </div>
                                </td>
                                <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                                  <div className="border-[#000000] text-center p-1 border rounded-md w-fit h-fit flex items-center justify-center">
                                    upload
                                  </div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  "></div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  ">
                                    --
                                  </div>
                                </td>
                              </tr>
                              <tr className="cursor-pointer">
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  ">
                                    Certificate
                                  </div>
                                </td>
                                <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                                  <div className="border-[#000000] text-center p-1 border rounded-md w-fit h-fit flex items-center justify-center">
                                    upload
                                  </div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  "></div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  ">
                                    --
                                  </div>
                                </td>
                              </tr>
                              <tr className="cursor-pointer">
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  ">
                                    Graduation Certificate
                                  </div>
                                </td>
                                <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                                  <div className="border-[#000000] text-center p-1 border rounded-md w-fit h-fit flex items-center justify-center">
                                    upload
                                  </div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  "></div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]  ">
                                    --
                                  </div>
                                </td>
                              </tr>
                              <tr className="cursor-pointer">
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px] ">
                                    Order
                                  </div>
                                </td>
                                <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                                  <div className="border-[#000000] text-center p-1 border rounded-md w-fit h-fit flex items-center justify-center">
                                    upload
                                  </div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]"></div>
                                </td>
                                <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                  <div className="text-left w-[240px]">--</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="bg-gray-300 min-w-[110%] h-0.5 mt-[1%] mb-[1%] ml-[-2%]"></div>
                      <div className="flex justify-end mr-[10px]">
                        <button
                          onClick={closeModal}
                          className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreate}
                          className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              {/* table employee */}
              <div className="overflow-x-auto mt-[10px] text-[14px] ml-[15px]">
                <table className="border-collapse mt-[2%] bg-white overflow-hidden w-full caret-transparent">
                  <thead>
                    <tr className="border-gray-300 border-t border-b-2 text-left">
                      <th className="px-2 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        ID
                      </th>
                      <th className="px-6 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Employee
                      </th>
                      <th className="px-4 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Position
                      </th>
                      <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Department
                      </th>
                      <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Email
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Status
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr
                        key={item.employee}
                        className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer"
                        onClick={() => handleRowClick(item)}
                      >
                        <td className="px-2 py-6 border-b border-gray-200 text-[16px] text-[#252C58]">
                          <div className="truncate text-left w-[60px]">
                            {item.employeeID}
                          </div>
                        </td>
                        <td className="px-6 py-6 border-b border-gray-200 text-[16px] text-[#252C58]">
                          <div className="truncate text-left w-[130px] ">
                            {`${item.firstName} ${item.lastName}`}
                          </div>
                        </td>
                        <td className="px-4 py-6 border-b border-gray-200 text-[16px] text-[#252C58] opacity-[50%]">
                          <div className="truncate text-left w-[170px]">
                            {item.department}
                          </div>
                        </td>
                        <td className="px-3 py-6 border-b border-gray-200 text-[16px] text-[#252C58] opacity-[50%]">
                          <div className="truncate text-left w-[170px] ">
                            {item.department}
                          </div>
                        </td>
                        <td className="px-3 py-6 border-b border-gray-200 text-[16px] text-[#252C58] opacity-[50%]">
                          <div className="text-left w-[260px]">
                            {item.email}
                          </div>
                        </td>
                        <td className="px-4 py-6 border-b border-gray-200 ">
                          <div
                            className={`text-center p-1 rounded-[6px] text-[16px] font-light w-[80px] h-[40px] flex items-center justify-center ${
                              item.status === "Active"
                                ? "text-[#D5B500] bg-[#FFF8E7]"
                                : ""
                            } ${
                              item.status === "Inactive"
                                ? "text-[#AA0000] bg-[#FFE5EE]"
                                : ""
                            }`}
                          >
                            {item.status}
                          </div>
                        </td>
                        <td className="px-5 py-6 border-b border-gray-200">
                          <HiOutlineDotsHorizontal className="text-[23px]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
        )}
      </div>
    </div>
  );
};

export default Employee;
