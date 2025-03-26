import { useState, useEffect, useRef } from "react";
import apiRoutes from "../../apiRoutes";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Modal from "react-modal";
// import { format } from "date-fns";
import Swal from "sweetalert2";
// icon
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlinePhoto } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BiEdit } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { TbDeviceDesktop } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegAddressCard } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BiFilterAlt } from "react-icons/bi";

Modal.setAppElement("#root");
const Employee = () => {
  const [data, setData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isDepartOpen, setIsDepartOpen] = useState(false);

  const dropdownRef = useRef(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
  const [bankAccountNumber, setbankAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [joiningDate, setJoiningDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [moreOptions, setMoreOptions] = useState(null);

  const [gender, setGender] = useState("Gender");
  const [type, setType] = useState("Employee Type");
  const [department, setDepartment] = useState("Department");
  const [position, setPosition] = useState("Position");
  const [role, setRole] = useState("Role");

  const genderData = ["Male", "Female", "Other"];
  const typeData = ["Full-time", "Fart-time", "Collabration", "Intern"];
  const departData = ["Quality Assuarance"];
  const positionData = ["Manual QA", "Front-End", "Backend"];
  const roleData = ["Admin", "Project Manager", "Staff"];

  // edit employee 1
  const [isEditing1, setIsEditing1] = useState(false);

  const [formData1, setFormData1] = useState(() => ({
    firstName: selectedEmployee?.firstName || "",
    lastName: selectedEmployee?.lastName || "",
    // alias: selectedEmployee?.alias || "",
    dateOfBirth: selectedEmployee?.dateOfBirth || "",
    idCardNumber: selectedEmployee?.idCardNumber || "",
    gender: selectedEmployee?.gender || "Male",
  }));

  useEffect(() => {
    if (selectedEmployee) {
      setFormData1({
        firstName: selectedEmployee.firstName || "",
        lastName: selectedEmployee.lastName || "",
        idCardNumber: selectedEmployee.idCardNumber || "",
        dateOfBirth: selectedEmployee.dateOfBirth || "",
        gender: selectedEmployee.gender || "Male",
      });
    }
  }, [selectedEmployee]);

  const handleEditClick1 = () => {
    setIsEditing1(true);
  };

  const handleCancelClick1 = () => {
    setIsEditing1(false);
    setFormData1({
      firstName: selectedEmployee.firstName,
      lastName: selectedEmployee.lastName,
      // alias: selectedEmployee.alias,
      idEmployee: selectedEmployee.idEmployee,
      idCardNumber: selectedEmployee.idCardNumber,
      dateOfBirth: selectedEmployee.dateOfBirth,
      gender: selectedEmployee.gender,
    });
  };

  const handleSaveClick1 = async () => {
    if (!selectedEmployee?._id) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(selectedEmployee._id),
        formData1
      );

      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: response.data.success ? "success" : "error",
        }).then(() => {
          setIsEditing1(false);
          window.location.reload();
        });
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleChange1 = (e) => {
    setFormData1({ ...formData1, [e.target.name]: e.target.value });
  };

  // edit employee 2
  const [isEditing2, setIsEditing2] = useState(false);

  const [formData2, setFormData2] = useState(() => ({
    phoneNumber: selectedEmployee?.phoneNumber || "",
    address: selectedEmployee?.address || "",
    postcode: selectedEmployee?.postcode || "",
    city: selectedEmployee?.city || "",
    province: selectedEmployee?.province || "",
    emailCompany: selectedEmployee?.emailCompany || "",
    emailPersonal: selectedEmployee?.emailPersonal || "",
  }));

  useEffect(() => {
    if (selectedEmployee) {
      setFormData2({
        phoneNumber: selectedEmployee?.phoneNumber || "",
        address: selectedEmployee?.address || "",
        postcode: selectedEmployee?.postcode || "",
        city: selectedEmployee?.city || "",
        province: selectedEmployee?.province || "",
        emailCompany: selectedEmployee?.emailCompany || "",
        emailPersonal: selectedEmployee?.emailPersonal || "",
      });
    }
  }, [selectedEmployee]);

  const handleEditClick2 = () => {
    setIsEditing2(true);
  };

  const handleCancelClick2 = () => {
    setIsEditing2(false);
    setFormData2({
      phoneNumber: selectedEmployee.phoneNumber,
      address: selectedEmployee.address,
      postcode: selectedEmployee.postcode,
      city: selectedEmployee.city,
      province: selectedEmployee.province,
      emailCompany: selectedEmployee.emailCompany,
      emailPersonal: selectedEmployee.emailPersonal,
    });
  };

  const handleSaveClick2 = async () => {
    if (!selectedEmployee?._id) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(selectedEmployee._id),
        formData2
      );

      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: response.data.success ? "success" : "error",
        }).then(() => {
          setIsEditing2(false);
          window.location.reload();
        });
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleChange2 = (e) => {
    setFormData2({ ...setFormData2, [e.target.name]: e.target.value });
  };

  // edit employee 4
  const [isEditing4, setIsEditing4] = useState(false);

  const [formData4, setFormData4] = useState(() => ({
    type: selectedEmployee?.type || "",
    department: selectedEmployee?.department || "",
    position: selectedEmployee?.position || "",
    role: selectedEmployee?.role || "",
    joiningDate: selectedEmployee?.joiningDate || "",
    endDate: selectedEmployee?.endDate || "",
  }));

  useEffect(() => {
    if (selectedEmployee) {
      setFormData4({
        type: selectedEmployee.type || "",
        department: selectedEmployee.department || "",
        position: selectedEmployee.position || "",
        role: selectedEmployee.role || "",
        joiningDate: selectedEmployee.joiningDate || "",
        endDate: selectedEmployee.endDate || "",
      });
    }
  }, [selectedEmployee]);

  const handleEditClick4 = () => {
    setIsEditing4(true);
  };

  const handleCancelClick4 = () => {
    setIsEditing4(false);
    setFormData4({
      type: selectedEmployee.type,
      department: selectedEmployee.department,
      position: selectedEmployee.position,
      role: selectedEmployee.role,
      joiningDate: selectedEmployee.joiningDate,
      endDate: selectedEmployee.endDate,
    });
  };

  const handleSaveClick4 = async () => {
    if (!selectedEmployee?.employeeID) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(selectedEmployee.employeeID),
        formData4
      );

      if (response.data.success) {
        alert("Cập nhật thành công!");
        setIsEditing4(false);
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleChange4 = (e) => {
    setFormData4({ ...formData4, [e.target.name]: e.target.value });
  };

  // edit employee 3
  const [isEditing3, setIsEditing3] = useState(false);

  const [formData3, setFormData3] = useState(() => ({
    bankName: selectedEmployee?.bankName || "",
    bankAccountNumber: selectedEmployee?.bankAccountNumber || "",
    bankAccountName: selectedEmployee?.bankAccountName || "",
  }));
  useEffect(() => {
    if (selectedEmployee) {
      setFormData3({
        bankName: selectedEmployee.bankName || "",
        bankAccountNumber: selectedEmployee.bankAccountNumber || "",
        bankAccountName: selectedEmployee.bankAccountName || "",
      });
    }
  }, [selectedEmployee]);

  const handleEditClick3 = () => {
    setIsEditing3(true);
  };

  const handleCancelClick3 = () => {
    setIsEditing3(false);
    setFormData3({
      bankName: selectedEmployee.bankName,
      bankAccountNumber: selectedEmployee.bankAccountNumber,
      bankAccountName: selectedEmployee.bankAccountName,
    });
  };

  const handleSaveClick3 = async () => {
    if (!selectedEmployee?.employeeID) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(selectedEmployee.employeeID),
        formData3
      );

      if (response.data.success) {
        alert("Cập nhật thành công!");
        setIsEditing3(false);
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleChange3 = (e) => {
    setFormData3({ ...formData3, [e.target.name]: e.target.value });
  };

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const renderPagination = () => {
    const pages = [];
    const totalPages = Math.ceil(data.length / itemsPerPage);

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      if (currentPage > 2) {
        pages.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="px-3 py-2 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={`w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border caret-transparent ${
            currentPage === page ? "bg-[#2EB67D] text-white" : "bg-white"
          }`}
        >
          {page}
        </button>
      )
    );
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

  // Dropdown selection of department
  const toggleDepartDropdown = () => setIsDepartOpen(!isDepartOpen);
  const handleOptionClick4 = (option) => {
    setDepartment(option);
    setIsDepartOpen(false);
  };

  // Dropdown selection of position
  const togglePossitionDropdown = () => setIsPositionOpen(!isPositionOpen);
  const handleOptionClick5 = (option) => {
    setPosition(option);
    setIsPositionOpen(false);
  };

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
        console.log(JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const handleCreate = async () => {
    // Form validation
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      alias.trim() === "" ||
      idCard.trim() === "" ||
      !dateOfBirth ||
      gender === "Gender" ||
      phoneNumber.trim() === "" ||
      emailCompany.trim() === "" ||
      address.trim() === "" ||
      emailPersonal.trim() === "" ||
      province.trim() === "" ||
      postcode.trim() === "" ||
      city.trim() === "" ||
      accountName.trim() === "" ||
      bankAccountNumber.trim() === "" ||
      department === "Department" ||
      role === "Role" ||
      position === "Position" ||
      type === "Type" ||
      !joiningDate
    ) {
      Swal.fire({
        text: "Please fill out all required fields.",
        icon: "error",
      });
      return;
    }

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
      bankAccountName: accountName,
      bankAccountNumber: bankAccountNumber,
      department: "Quality Assuarance",
      role: "Employee",
      jobTitle: "Front end",
      joiningDate: joiningDate,
      endDate: endDate,
      // status: "Active",
      city: city,
    };

    try {
      const response = await axios.post(
        apiRoutes.posts.createUser,
        newUserData
      );
      const { success, message } = response.data;
      if (success) {
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

  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() === "") {
      axios.get("/api/employees").then((res) => setData(res.data));
      return;
    }

    try {
      const response = await axios.get(
        `${apiRoutes.user.search}?keyword=${keyword}`
      );
      setData(response.data.users);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setData([]);
    }
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
    setGender("Gender");
    setType("Employee Type");
    setRole("Role");
    setDepartment("Department");
    setPosition("Position");
    setIdCard("");
    setPhoneNumber("");
    setModalIsOpen(false);
  };

  return (
    <div className="">
      {selectedEmployee ? (
        <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex space-x-8 items-center mt-[2%] ml-[2%] text-[#1C1C1C] font-medium">
              <IoIosArrowRoundBack
                className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                onClick={() => {
                  setSelectedEmployee(null);
                }}
              />
              <p>General</p>
              <p>Job</p>
              <p>Payroll</p>
              <p>Performance</p>
              <p>Documents</p>
              <p>Dependents</p>
            </div>
          </div>
          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex ml-[2%] mt-[2%]">
              {/* <img
                        alt="logo"
                        src="src/assets/star.png"
                        className="w-[220px] h-[220px] mb-4"
                      /> */}
              {isEditing1 ? (
                <div className="bg-red-200 w-[290px] h-[230px]"></div>
              ) : (
                <div className="bg-red-200 w-[230px] h-[230px]"></div>
              )}

              <div className="ml-[3%]">
                <div className="flex items-center justify-between">
                  <p className="text-[20px] font-bold">Personal Information</p>
                  {isEditing1 ? (
                    <div className="flex space-x-2 mr-[4%]">
                      <IoBookmarkOutline
                        onClick={handleSaveClick1}
                        className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                      />
                      <IoCloseCircleOutline
                        onClick={handleCancelClick1}
                        className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                      />
                    </div>
                  ) : (
                    <BiEdit
                      className="w-[25px] h-[25px] mr-[-28%] text-[#069855] cursor-pointer"
                      onClick={handleEditClick1}
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-[1%]">
                  <p>
                    {selectedEmployee.status === "Active"
                      ? "Active"
                      : "Inactive"}
                  </p>
                  <div
                    className={`w-14 h-7 flex items-center rounded-[4px] p-1 transition-all ${
                      selectedEmployee.status === "Active"
                        ? "bg-[#00FF94]"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-gray-800 rounded-[4px] transition-all ${
                        selectedEmployee.status === "Active"
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-x-10 mt-4">
                  <div>
                    <p className="w-fit text-[#828282]">ID Employee</p>
                    <p className="mt-[10%] font-bold whitespace-nowrap">
                      {selectedEmployee.employeeID}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#828282]">First Name</p>
                    {isEditing1 ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData1.firstName}
                        onChange={handleChange1}
                        className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[6%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[10%]">
                        {selectedEmployee.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282] w-fit">Last Name</p>

                    {isEditing1 ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData1.lastName}
                        onChange={handleChange1}
                        className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[6%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[10%]">
                        {selectedEmployee.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="w-fit text-[#828282] whitespace-nowrap">
                      Alias
                    </p>
                    <p className="w-fit mt-[8%] font-bold whitespace-nowrap">
                      {selectedEmployee.alias}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-x-10 mt-6 mb-4">
                  <div>
                    <p className="w-fit text-[#828282] ">ID Card</p>
                    {isEditing1 ? (
                      <input
                        type="text"
                        name="idCardNumber"
                        value={formData1.idCardNumber}
                        onChange={handleChange1}
                        className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[5%]"
                      />
                    ) : (
                      <p className=" w-fit font-bold mt-[10%]">
                        {selectedEmployee.idCardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282] mb-2">Date of Birth</p>
                    {isEditing1 ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={
                            formData1.dateOfBirth
                              ? dayjs(formData1.dateOfBirth)
                              : null
                          }
                          onChange={(newDate) =>
                            setFormData1((prev) => ({
                              ...prev,
                              dateOfBirth: newDate ? newDate.toISOString() : "",
                            }))
                          }
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                          slotProps={{ textField: { size: "small" } }}
                        />
                      </LocalizationProvider>
                    ) : (
                      <p className="mt-2 font-bold">
                        {formatDate(selectedEmployee.dateOfBirth)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="w-fit text-[#828282]">Gender</p>

                    {isEditing1 ? (
                      <div
                        className="relative inline-block text-left "
                        ref={dropdownRef}
                      >
                        <div className="relative">
                          <div
                            className="inline-flex w-[240%] border-gray-200 border-1 h-[42px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                            onClick={toggleGenderDropdown}
                          >
                            <span className="text-[15px]">
                              {formData1.gender}
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
                                    setFormData1((prev) => ({
                                      ...prev,
                                      gender: option,
                                    }))
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
                    ) : (
                      <p className="w-fit font-bold">
                        {selectedEmployee.gender}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-fit text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
            <div className="ml-[2%] w-full">
              <div className="flex items-center justify-between mt-[2%]">
                <p className="text-[20px] font-bold">Contact Detail</p>
                {isEditing2 ? (
                  <div className="flex space-x-2 mr-[4%]">
                    <IoBookmarkOutline
                      onClick={handleSaveClick2}
                      className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                    />
                    <IoCloseCircleOutline
                      onClick={handleCancelClick2}
                      className="w-[25px] h-[25px] mr-[5%] cursor-pointer hover:text-[#069855]"
                    />
                  </div>
                ) : (
                  <BiEdit
                    className="w-[25px] h-[25px] mr-[5%] text-[#069855] cursor-pointer"
                    onClick={handleEditClick2}
                  />
                )}
              </div>
              <div>
                <div className="grid grid-cols-2 mt-[2%]">
                  <div>
                    <p className="text-[#828282]">Phone Number</p>

                    {isEditing2 ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData2.phoneNumber}
                        onChange={handleChange2}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.phoneNumber == ""
                          ? "--"
                          : selectedEmployee.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Email Company</p>

                    {isEditing2 ? (
                      <input
                        type="text"
                        name="emailCompany"
                        value={formData2.emailCompany}
                        onChange={handleChange2}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.emailCompany == ""
                          ? "--"
                          : selectedEmployee.emailCompany}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 mt-[3%]">
                  <div>
                    <p className="text-[#828282]">Address</p>
                    {isEditing2 ? (
                      <input
                        type="text"
                        name="address"
                        value={formData2.address}
                        onChange={handleChange2}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.address == ""
                          ? "--"
                          : selectedEmployee.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Email Person</p>
                    {isEditing2 ? (
                      <input
                        type="text"
                        name="emailPersonal"
                        value={formData2.emailPersonal}
                        onChange={handleChange2}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.emailPersonal == ""
                          ? "--"
                          : selectedEmployee.emailPersonal}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
                  <div>
                    <p className="text-[#828282]">Province</p>
                    {isEditing2 ? (
                      <input
                        type="text"
                        name="province"
                        value={formData2.province}
                        onChange={handleChange2}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.province == ""
                          ? "--"
                          : selectedEmployee.province}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-10">
                    <div>
                      <p className="text-[#828282]">Postcode</p>
                      {isEditing2 ? (
                        <input
                          type="text"
                          name="postcode"
                          value={formData2.postcode}
                          onChange={handleChange2}
                          className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                        />
                      ) : (
                        <p className="w-fit font-bold mt-[2%]">
                          {selectedEmployee.postcode == ""
                            ? "--"
                            : selectedEmployee.postcode}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[#828282]">City</p>

                      {isEditing2 ? (
                        <input
                          type="text"
                          name="city"
                          value={formData2.city}
                          onChange={handleChange2}
                          className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                        />
                      ) : (
                        <p className="w-fit font-bold mt-[2%]">
                          {selectedEmployee.city == ""
                            ? "--"
                            : selectedEmployee.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
            <div className="ml-[2%] w-full">
              <div className="flex items-center justify-between mt-[2%]">
                <p className="text-[20px] font-bold">Bank Account</p>
                {isEditing3 ? (
                  <div className="flex space-x-2 mr-[4%]">
                    <IoBookmarkOutline
                      onClick={handleSaveClick3}
                      className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                    />
                    <IoCloseCircleOutline
                      onClick={handleCancelClick3}
                      className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                    />
                  </div>
                ) : (
                  <BiEdit
                    className="w-[25px] h-[25px] mr-[5%] text-[#069855] cursor-pointer"
                    onClick={handleEditClick3}
                  />
                )}
              </div>
              <div>
                <div className="grid grid-cols-2 mt-[2%]">
                  <div>
                    <p className="text-[#828282] ">Bank Account Name</p>
                    {isEditing3 ? (
                      <input
                        type="text"
                        name="bankName"
                        value={formData3.bankName}
                        onChange={handleChange3}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.bankName == ""
                          ? "--"
                          : selectedEmployee.bankName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Account Name</p>
                    {isEditing3 ? (
                      <input
                        type="text"
                        name="bankAccountName"
                        value={formData3.bankAccountName}
                        onChange={handleChange3}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.bankAccountName == ""
                          ? "--"
                          : selectedEmployee.bankAccountName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
                  <div>
                    <p className="text-[#828282]">Bank Account Number</p>
                    {isEditing3 ? (
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData3.bankAccountNumber}
                        onChange={handleChange3}
                        className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[2%]">
                        {selectedEmployee.bankAccountNumber == ""
                          ? "--"
                          : selectedEmployee.bankAccountNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFFFF]  ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
            <div className="ml-[2%]">
              <div className="flex items-center justify-between mt-[2%]">
                <p className="text-[20px] font-bold">Employee Access</p>
                {isEditing4 ? (
                  <div className="flex space-x-2 mr-[2%]">
                    <IoBookmarkOutline
                      onClick={handleSaveClick4}
                      className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                    />
                    <IoCloseCircleOutline
                      onClick={handleCancelClick4}
                      className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                    />
                  </div>
                ) : (
                  <BiEdit
                    className="w-[25px] h-[25px] mr-[3%] text-[#069855] cursor-pointer"
                    onClick={handleEditClick4}
                  />
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 mt-[2%]">
                  <div>
                    <p className="text-[#828282]">Employee Type</p>
                    {isEditing4 ? (
                      <div
                        className="relative inline-block text-left "
                        ref={dropdownRef}
                      >
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                            onClick={toggleTypeDropdown}
                          >
                            <span className="text-[15px]">
                              {formData4.employeeType}
                            </span>
                            <IoIosArrowDown />
                          </div>
                        </div>
                        {isTypeOpen && (
                          <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                              {typeData.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    setFormData4((prev) => ({
                                      ...prev,
                                      type: option,
                                    }))
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
                    ) : (
                      <p className="w-fit font-bold">
                        {selectedEmployee.employeeType}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Department</p>
                    {isEditing4 ? (
                      <div
                        className="relative inline-block text-left "
                        ref={dropdownRef}
                      >
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                            onClick={toggleDepartDropdown}
                          >
                            <span className="text-[15px]">
                              {formData4.department}
                            </span>
                            <IoIosArrowDown />
                          </div>
                        </div>
                        {isDepartOpen && (
                          <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                              {departData.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    setFormData4((prev) => ({
                                      ...prev,
                                      department: option,
                                    }))
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
                    ) : (
                      <p className="w-fit font-bold">
                        {selectedEmployee.department}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Position</p>
                    {isEditing4 ? (
                      <div
                        className="relative inline-block text-left "
                        ref={dropdownRef}
                      >
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                            onClick={togglePossitionDropdown}
                          >
                            <span className="text-[15px]">
                              {formData4.position}
                            </span>
                            <IoIosArrowDown />
                          </div>
                        </div>
                        {isPositionOpen && (
                          <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                              {positionData.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    setFormData4((prev) => ({
                                      ...prev,
                                      position: option,
                                    }))
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
                    ) : (
                      <p className="w-fit font-bold">
                        {selectedEmployee.position}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Role</p>
                    {isEditing4 ? (
                      <div
                        className="relative inline-block text-left "
                        ref={dropdownRef}
                      >
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                            onClick={toggleRoleDropdown}
                          >
                            <span className="text-[15px]">
                              {formData4.role}
                            </span>
                            <IoIosArrowDown />
                          </div>
                        </div>
                        {isRoleOpen && (
                          <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                              {roleData.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    setFormData4((prev) => ({
                                      ...prev,
                                      role: option,
                                    }))
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
                    ) : (
                      <p className="w-fit font-bold">{selectedEmployee.role}</p>
                    )}
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
          <div className="bg-[#FFFFFF]  ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] mb-[2%]">
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
                        <div className="text-left w-[240px]  ">10-10-2025</div>
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
        <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
          <div className="flex ml-[3%] space-x-13 mt-[2%] caret-transparent">
            {/* active */}
            <div className="bg-white w-[calc(100vw-340px)] h-[160px] rounded-[40px] flex justify-around items-center shadow-md p-6 relative">
              {/* Total Customers */}
              <div className="flex items-center space-x-4 relative">
                <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                  <div className="bg-green-300 w-full h-full rounded-full opacity-20 absolute"></div>
                  <HiOutlineUsers className="text-green-400 w-10 h-10 relative" />
                </div>
                <div>
                  <p className="text-gray-400 text-[16px]">Total Customers</p>
                  <p className="font-bold text-3xl text-left">{data.length} </p>
                </div>
              </div>
              <div className="bg-gray-100 w-[2px] h-[100px] " />
              {/* Active Now */}
              <div className="flex items-center space-x-4 relative mr-[5%]">
                <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                  <div className="bg-[#FF527D] w-full h-full rounded-full opacity-20 absolute"></div>
                  <TbDeviceDesktop className="text-[#FF527D] w-10 h-10 relative" />
                </div>
                <div>
                  <p className="text-gray-400 text-[16px]">Active Now</p>
                  <p className="font-bold text-3xl text-left">
                    {
                      data.filter((employee) => employee.status === "Active")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
            {/* overtime */}
          </div>
          <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] shadow-[0px_1px_3px_rgba(0,0,0,0.2)] h-auto ml-[3%] rounded-[15px] mt-[2%] mb-[2%] items-start p-[10px]">
            <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6 ">
              {/* Total Employee */}
              <div>
                <p className="text-[#252C58] text-[20px] font-light caret-transparent">
                  Total Employee
                </p>
              </div>

              {/* Search */}
              <div className="relative flex items-center flex-1 min-w-[200px] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[400px] ml-14">
                <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
                <input
                  type="text"
                  placeholder="Quick Search"
                  onChange={handleSearch}
                  className="h-[50px] w-full pl-12 rounded-[10px] border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] placeholder:text-[#252C58] placeholder:opacity-100"
                />
              </div>

              {/* Filter Button */}
              <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
                <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
                <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
                  Filter
                </div>
              </div>

              {/* Create Employee Button */}
              <div>
                <button
                  className="text-white font-normal h-[50px] px-6 rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
                  onClick={() => setModalIsOpen(true)}
                >
                  Create Employee
                </button>
                {/* Modal create new employee */}
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={() => setModalIsOpen(false)}
                  shouldCloseOnOverlayClick={false}
                  className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
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
                  <div className="border-gray-200 border-2 rounded-[5px] w-[104%] ml-[-2%]">
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                              value={bankAccountNumber}
                              placeholder="Input Account Number"
                              onChange={(e) => {
                                setbankAccountNumber(e.target.value);
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
                              <p>Employee Type</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                onClick={toggleTypeDropdown}
                              >
                                <span className="text-[15px]">{type}</span>
                                <IoIosArrowDown />
                              </div>
                            </div>
                            {isTypeOpen && (
                              <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
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
                        <div className="mt-5">
                          <div
                            className="relative inline-block text-left "
                            // ref={dropdownRef}
                          >
                            <div className="flex">
                              <p>Department</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                onClick={toggleDepartDropdown}
                              >
                                <span className="text-[15px]">
                                  {department}
                                </span>
                                <IoIosArrowDown />
                              </div>
                            </div>
                            {isDepartOpen && (
                              <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                <ul className="py-1">
                                  {departData.map((option, index) => (
                                    <li
                                      key={index}
                                      onClick={() => handleOptionClick4(option)}
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
                              <p>Job title</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                onClick={togglePossitionDropdown}
                              >
                                <span className="text-[15px]">{position}</span>
                                <IoIosArrowDown />
                              </div>
                            </div>
                            {isPositionOpen && (
                              <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                <ul className="py-1">
                                  {positionData.map((option, index) => (
                                    <li
                                      key={index}
                                      onClick={() => handleOptionClick5(option)}
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
                              <p>Role</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className="inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                                onClick={toggleRoleDropdown}
                              >
                                <span className="text-[15px]">{role}</span>
                                <IoIosArrowDown />
                              </div>
                            </div>
                            {isRoleOpen && (
                              <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
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
                                onChange={(newDate) => setJoiningDate(newDate)}
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
                        <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden w-[calc(100vw-400px)] caret-transparent border-gray-200 border">
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
                                <div className="text-left w-[240px]  ">--</div>
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
                                <div className="text-left w-[240px]  ">--</div>
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
                                <div className="text-left w-[240px]  ">--</div>
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

            {data.length > 0 ? (
              <div className="mt-[10px] text-[14px] ml-[15px] z-0">
                <table className="border-collapse mt-[2%] bg-white w-[calc(100vw-400px)] caret-transparent ">
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
                        key={item._id}
                        className="hover:bg-[rgba(0,84,232,0.03)] text-[15px]"
                      >
                        <td className="px-2 py-6 border-b border-gray-200 text-[#252C58]">
                          <div className="truncate text-left w-[60px]">
                            {item.employeeID}
                          </div>
                        </td>
                        <td className="px-6 py-6 border-b border-gray-200 text-[#252C58]">
                          <div className="truncate text-left w-[150px] ">
                            {`${item.firstName} ${item.lastName}`}
                          </div>
                        </td>
                        <td className="px-4 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%]">
                          <div className="truncate text-left w-[170px]">
                            {item.jobTitle}
                          </div>
                        </td>
                        <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%]">
                          <div className="truncate text-left w-[170px] ">
                            {item.department}
                          </div>
                        </td>
                        <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%]">
                          <div className="text-left w-[260px]">
                            {item.emailPersonal}
                          </div>
                        </td>
                        <td className="px-4 py-6 border-b border-gray-200 ">
                          <div
                            className={`text-center p-1 rounded-[6px] font-light w-[80px] h-[40px] flex items-center justify-center ${
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
                        <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer">
                          <HiOutlineDotsHorizontal
                            className="text-[23px]"
                            onClick={() => {
                              setMoreOptions(
                                moreOptions === item.employeeID
                                  ? null
                                  : item.employeeID
                              );
                            }}
                          />
                          {moreOptions === item.employeeID && (
                            <div
                              className="absolute bg-white right-5 z-10 mt-2 w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                            >
                              <div className="absolute right-3 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                                <div className="flex flex-col divide-y divide-gray-200">
                                  {/* View Detail */}
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMoreOptions(null);
                                      setSelectedEmployee(item);
                                    }}
                                    className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                    <span>View detail</span>
                                  </div>

                                  {/* Delete */}
                                  <div
                                    // onClick={(e) => {
                                    //   e.stopPropagation();
                                    //   setMoreOptions(null);
                                    //   handleDeleteEmployee(item.employeeID);
                                    // }}
                                    className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <IoTrashBinOutline className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                    <span>Delete</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center text-gray-500 text-lg flex-grow mx-auto">
                <img
                  alt="logo"
                  src="src/assets/Image.png"
                  className="w-[380px] h-[280px]"
                />
                <div className="mt-[10%] text-center">
                  <p className="font-bold">Empty Employee</p>
                  <p>Add your first Employee manually</p>
                </div>
                <button
                  className="text-white font-normal mt-[10%] h-[50px] w-[180px] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
                  onClick={() => setModalIsOpen(true)}
                >
                  + Employee
                </button>
              </div>
            )}

            {/* infor bottom */}
            <div className="flex flex-wrap items-center w-full justify-between text-[#9A9A9A] caret-transparent p-4 gap-4 md:gap-6 mt-2">
              <p className="text-sm sm:text-base">
                Showing {startIndex} to {endIndex} of {data.length} entries
              </p>

              {/* Pagination */}
              <div className="flex items-center gap-2 text-black">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`min-w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3] ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <IoChevronBack />
                </button>

                {renderPagination()}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`min-w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3] ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <IoIosArrowForward />
                </button>
              </div>

              <div className="flex items-center gap-2 text-black">
                <p>Show</p>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-[80px] h-[50px] border border-gray-300 rounded-[8px] text-center bg-white cursor-pointer"
                >
                  {[10, 20, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <p>entries</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
