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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FileUpload from "../components/FileUpload";
import TabSelector from "../components/TabSelector";
import PaginationFooter from "../components/PaginationFooter";
import ClickOutside from "../components/ClickOutside";
import UsePermission from "../components/UsePermission";
import { CircularProgress } from "@mui/material";
import alert from "../components/Alert";

// icon
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlinePhoto } from "react-icons/hi2";
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
import { FaRegTrashCan } from "react-icons/fa6";

Modal.setAppElement("#root");
const Employee = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("user.read");

  const [progress, setProgress] = useState(false);

  const [data, setData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isDepartOpen, setIsDepartOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("general");
  const [isCredentialOpen, setIsCredentialOpen] = useState(false);

  const [errors, setErrors] = useState({});
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
  const [iDNext, setIDNext] = useState("");
  const [bankAccountNumber, setbankAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [joiningDate, setJoiningDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [moreOptions, setMoreOptions] = useState(null);
  const [status, setStatus] = useState(true);
  const [fileInfos, setFileInfos] = useState({});

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({
    avatar: null,
    photoID: null,
    certificate: null,
    graduationCertificate: null,
    order: null,
  });
  const [selectedAva, setSelectedAva] = useState(null);

  const [gender, setGender] = useState("Gender");
  const [employeeType, setEmployeeType] = useState("Employee Type");
  const [department, setDepartment] = useState("Department");
  const [jobTitle, setJobTitle] = useState("Position");
  const [role, setRole] = useState("Role");

  const genderData = ["Male", "Female", "Other"];
  const typeData = ["Fulltime", "Partime", "Collab", "Intern"];

  const [departData, setDepartData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);

  // Edit employee 1
  const [isEditing1, setIsEditing1] = useState(false);

  const [formData1, setFormData1] = useState(() => ({
    avatar: selectedEmployee?.avatar || "",
    firstName: selectedEmployee?.firstName || "",
    lastName: selectedEmployee?.lastName || "",
    alias: selectedEmployee?.alias || "",
    status: selectedEmployee?.status || "",
    dateOfBirth: selectedEmployee?.dateOfBirth || "",
    idCardNumber: selectedEmployee?.idCardNumber || "",
    gender: selectedEmployee?.gender || "Male",
  }));
  const isFormChanged1 = () => {
    return (
      formData1.firstName !== selectedEmployee.firstName ||
      formData1.lastName !== selectedEmployee.lastName ||
      formData1.alias !== selectedEmployee.alias ||
      formData1.status !== selectedEmployee.status ||
      formData1.dateOfBirth !== selectedEmployee.dateOfBirth ||
      formData1.idCardNumber !== selectedEmployee.idCardNumber ||
      formData1.gender !== selectedEmployee.gender
    );
  };
  useEffect(() => {
    if (selectedEmployee) {
      setFormData1({
        avatar: selectedEmployee.avatar || "",
        firstName: selectedEmployee.firstName || "",
        lastName: selectedEmployee.lastName || "",
        alias: selectedEmployee?.alias || "",
        status: selectedEmployee?.status || "",
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
    setPreview(null);
    setFormData1({
      avatar: selectedEmployee.avatar,
      firstName: selectedEmployee.firstName,
      lastName: selectedEmployee.lastName,
      alias: selectedEmployee.alias,
      status: selectedEmployee.status,
      idEmployee: selectedEmployee.idEmployee,
      idCardNumber: selectedEmployee.idCardNumber,
      dateOfBirth: selectedEmployee.dateOfBirth,
      gender: selectedEmployee.gender,
    });
  };

  const handleToggleStatus = () => {
    setFormData1((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
  };

  const handleSaveClick1 = async () => {
    if (!selectedEmployee?._id) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    if (!selectedAva && !isFormChanged1()) {
      Swal.fire({
        text: "Không có thay đổi nào để cập nhật.",
        icon: "info",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        setIsEditing1(false);
      });
      return;
    }
    setProgress(true);

    try {
      if (selectedAva) {
        const formData = new FormData();
        formData.append("employeeID", selectedEmployee.employeeID);
        formData.append("avatar", selectedAva);

        const uploadRes = await axios.post(
          apiRoutes.file.uploadfile,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadRes.data.updatedFields?.avatar) {
          setFormData1((prev) => ({
            ...prev,
            avatar: uploadRes.data.updatedFields.avatar,
          }));
        }
        console.log(uploadRes.data);
      }

      if (isFormChanged1()) {
        const response = await axios.put(
          apiRoutes.posts.updateUser(selectedEmployee._id),
          formData1,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          Swal.fire({
            text: response.data.message,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          setIsEditing1(false);
        } else {
          alert("Cập nhật thất bại: " + response.data.message);
        }
      } else {
        if (selectedAva) {
          Swal.fire({
            text: "Ảnh đại diện đã được cập nhật.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          setIsEditing1(false);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật: " + error);
    } finally {
      setProgress(false);
    }
  };

  const token = localStorage.getItem("token");

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

  const isFormChanged2 = () => {
    return (
      formData2.phoneNumber !== selectedEmployee.phoneNumber ||
      formData2.address !== selectedEmployee.address ||
      formData2.postcode !== selectedEmployee.postcode ||
      formData2.city !== selectedEmployee.city ||
      formData2.province !== selectedEmployee.province ||
      formData2.emailCompany !== selectedEmployee.emailCompany ||
      formData2.emailPersonal !== selectedEmployee.emailPersonal
    );
  };

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
    if (!isFormChanged2()) {
      Swal.fire({
        text: "Không có thay đổi nào cần lưu.",
        icon: "info",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        setIsEditing2(false);
      });
      return;
    }
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(selectedEmployee._id),
        formData2,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: response.data.success ? "success" : "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          setIsEditing2(false);
        });
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setProgress(false);
    }
  };

  const handleChange2 = (e) => {
    setFormData2({ ...setFormData2, [e.target.name]: e.target.value });
  };

  // edit employee 4
  const [isEditing4, setIsEditing4] = useState(false);

  const [formData4, setFormData4] = useState(() => ({
    employeeType: selectedEmployee?.employeeType || "",
    department: selectedEmployee?.department || "",
    jobTitle: selectedEmployee?.jobTitle || "",
    role: selectedEmployee?.role || "",
    joiningDate: selectedEmployee?.joiningDate || "",
    endDate: selectedEmployee?.endDate || "",
  }));

  useEffect(() => {
    if (selectedEmployee) {
      setFormData4({
        employeeType: selectedEmployee.employeeType || "",
        department: selectedEmployee.department || "",
        position: selectedEmployee.jobTitle || "",
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
      employeeType: selectedEmployee.type,
      department: selectedEmployee.department,
      jobTitle: selectedEmployee.jobTitle,
      role: selectedEmployee.role,
      joiningDate: selectedEmployee.joiningDate,
      endDate: selectedEmployee.endDate,
    });
  };

  const handleSaveClick4 = async () => {
    const token = localStorage.getItem("token");

    if (!selectedEmployee?.employeeID) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(selectedEmployee._id),
        formData4,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        setIsEditing4(false);
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setProgress(false);
    }
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
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(selectedEmployee.employeeID),
        formData3,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
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
    } finally {
      setProgress(false);
    }
  };

  const handleChange3 = (e) => {
    setFormData3({ ...formData3, [e.target.name]: e.target.value });
  };

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, selectedEmployee]);

  // Get data dropdown
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [departments, positions, roles] = await Promise.all([
          axios.get(apiRoutes.department.getAllDepartment),
          axios.get(apiRoutes.jobtitle.getAllJobtitle),
          axios.get(apiRoutes.role.getRole),
        ]);

        setDepartData(departments.data);
        setPositionData(positions.data);
        setRoleData(roles.data);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
  }, []);

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
    setEmployeeType(option);
    setIsTypeOpen(false);
  };

  // Dropdown selection of department
  const toggleDepartDropdown = () => setIsDepartOpen(!isDepartOpen);
  const handleOptionClick4 = (selectedDeptName) => {
    setDepartment(selectedDeptName);
    setJobTitle("Position");

    const selectedDept = departData.find(
      (dept) => dept.name === selectedDeptName
    );
    if (selectedDept) {
      const jobIds = selectedDept.jobtitle;
      const filtered = positionData.filter((job) => jobIds.includes(job._id));
      setFilteredJobTitles(filtered);
    } else {
      setFilteredJobTitles([]);
    }

    setIsDepartOpen(false);
    setIsDepartOpen(false);
  };

  // Dropdown selection of position
  const togglePossitionDropdown = () => setIsPositionOpen(!isPositionOpen);

  // Format date of birth
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get all users
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiRoutes.user.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  // form validation
  const fieldsToValidate = {
    firstName: {
      value: firstName,
      message: "First Name is required.",
    },
    lastName: {
      value: lastName,
      message: "Last Name is required.",
    },
    alias: {
      value: alias,
      message: "Alias is required.",
    },
    idCard: {
      value: idCard,
      message: "ID Card is required.",
    },
    dateOfBirth: {
      value: dateOfBirth,
      message: "Date of Birth is required.",
      isOptional: false,
    },
    gender: {
      value: gender,
      message: "Gender is required.",
      isInvalid: (val) => val === "Gender",
    },
    phoneNumber: {
      value: phoneNumber,
      message: "Phone Number is required.",
    },
    emailCompany: {
      value: emailCompany,
      message: "Company Email is required.",
    },
    address: {
      value: address,
      message: "Address is required.",
    },
    emailPersonal: {
      value: emailPersonal,
      message: "Personal Email is required.",
    },
    province: {
      value: province,
      message: "Province is required.",
    },
    postcode: {
      value: postcode,
      message: "Postcode is required.",
    },
    city: {
      value: city,
      message: "City is required.",
    },
    department: {
      value: department,
      message: "Department is required.",
      isInvalid: (val) => val === "Department",
    },
    role: {
      value: role,
      message: "Role is required.",
      isInvalid: (val) => val === "Role",
    },
    jobTitle: {
      value: jobTitle,
      message: "Position is required.",
      isInvalid: (val) => val === "Position",
    },
    employeeType: {
      value: employeeType,
      message: "Type is required.",
      isInvalid: (val) => val === "Employee Type",
    },
    joiningDate: {
      value: joiningDate,
      message: "Joining Date is required.",
    },
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    Object.entries(fieldsToValidate).forEach(([key, config]) => {
      const { value, message, isInvalid } = config;

      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (typeof isInvalid === "function" && isInvalid(value));

      if (isEmpty) {
        newErrors[key] = message;
        isValid = false;
      } else {
        newErrors[key] = "";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.avatar) {
      await handleUpdate("avatar");
    }
    if (selectedFiles.photoID) {
      await handleUpdate("photoID");
    }
    if (selectedFiles.certificate) {
      await handleUpdate("certificate");
    }
    if (selectedFiles.graduationCertificate) {
      await handleUpdate("graduationCertificate");
    }
  };

  const handleUpdate = async (fileType) => {
    const selectedFile = selectedFiles[fileType];
    setProgress(true);
    try {
      const formData = new FormData();
      formData.append("employeeID", selectedEmployee.employeeID);
      formData.append(fileType, selectedFile);

      const uploadRes = await axios.post(apiRoutes.file.uploadfile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadRes.status === 200) {
        Swal.fire({
          text: `Tải lên ${fileType} thành công.`,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        setSelectedFiles({
          avatar: null,
          photoID: null,
          certificate: null,
          graduationCertificate: null,
          order: null,
        });
        setIsCredentialOpen(!isCredentialOpen);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        text: `Tải lên ${fileType} thất bại.`,
        icon: "error",
        showConfirmButton: true,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setProgress(false);
    }
  };

  const handleCreate = async () => {
    // Form validation
    if (!validateFields()) {
      return;
    }

    const newUserData = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      idCardNumber: idCard,
      dateOfBirth: dateOfBirth,
      gender: gender,
      employeeType: employeeType,
      phoneNumber: "(+84)" + " " + phoneNumber,
      emailCompany: emailCompany,
      address: address,
      emailPersonal: emailPersonal,
      province: province,
      postcode: postcode,
      bankName: bankName,
      bankAccountName: accountName,
      bankAccountNumber: bankAccountNumber,
      department: department,
      role: role,
      jobTitle: jobTitle,
      joiningDate: joiningDate,
      endDate: endDate,
      status: status ? "Active" : "Inactive",
      city: city,
    };
    setProgress(true);
    try {
      const response = await axios.post(
        apiRoutes.posts.createUser,
        newUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { success, message } = response.data;
      if (success) {
        if (selectedFiles.avatar) {
          await handleUpload("avatar");
        }
        if (selectedFiles.photoID) {
          await handleUpload("photoID");
        }
        if (selectedFiles.certificate) {
          await handleUpload("certificate");
        }
        if (selectedFiles.graduationCertificate) {
          await handleUpload("graduationCertificate");
        }

        Swal.fire({
          text: message,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        setModalIsOpen(false);

        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
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
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          } else if (err.includes("idCardNumber")) {
            Swal.fire({
              text: "Invalid ID Card Number. Please check your input.",
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          } else if (err.includes("phoneNumber")) {
            Swal.fire({
              text: "Invalid phone number format.",
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          } else if (err.includes("role")) {
            Swal.fire({
              text: "Invalid role selected.",
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          } else if (err.includes("employeeType")) {
            Swal.fire({
              text: "Invalid employee type provided.",
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              text: err,
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
        });
      } else {
        Swal.fire({
          text: "An error occurred while sending data. Please try again later.",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } finally {
      setProgress(false);
    }
  };

  // Search
  const handleSearch = async (e) => {
    const keyword = e.target.value;

    if (keyword.trim() === "") {
      axios
        .get(apiRoutes.user.getAll, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => setData(res.data));
      return;
    }
    setProgress(true);

    try {
      const response = await axios.get(
        `${apiRoutes.user.search}?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data.users);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setData([]);
    } finally {
      setProgress(false);
    }
  };

  // Delete user
  const verifyDelete = async (id) => {
    setProgress(true);

    try {
      const response = await axios.delete(apiRoutes.user.profile(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { success, message } = response.data;
      if (success) {
        Swal.fire({
          text: message,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    } finally {
      setProgress(false);
    }
  };

  // Close model add user
  const closeModal = () => {
    setErrors({});
    setFirstName("");
    setAlias("");
    setLastName("");
    setAddress("");
    setProvince("");
    setPostcode("");
    setCity("");
    setDateOfBirth(null);
    setGender("Gender");
    setEmployeeType("Employee Type");
    setRole("Role");
    setDepartment("Department");
    setJobTitle("Position");
    setIdCard("");
    setPhoneNumber("");
    setModalIsOpen(false);
    setStatus(true);
    setPreview(null);
    setSelectedFiles({
      avatar: null,
      photoID: null,
      certificate: null,
      graduationCertificate: null,
      order: null,
    });
  };

  useEffect(() => {
    const fetchFileInfos = async () => {
      const fields = [
        "graduationCertificate",
        "photoID",
        "certificate",
        "order",
      ];
      const fileData = {};

      for (const field of fields) {
        const fileId = selectedEmployee?.[field];
        if (fileId) {
          try {
            const res = await axios.get(apiRoutes.file.file(fileId), {
              responseType: "blob",
            });

            const blobUrl = URL.createObjectURL(res.data);
            fileData[field] = blobUrl;
          } catch (error) {
            console.error(`❌ Error fetching ${field}:`, error);
          }
        }
      }
      setFileInfos(fileData);
    };
    if (selectedEmployee) {
      fetchFileInfos();
    }
  }, [selectedEmployee]);

  // Upload avatar
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedAva(file);
    setPreview(URL.createObjectURL(file));
  };

  // Get employeeID next
  useEffect(() => {
    axios
      .post(apiRoutes.user.getNextEmployeeID)
      .then((response) => {
        setIDNext(response.data.employeeID);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const handleUpload = async (fileType) => {
    const selectedFile = selectedFiles[fileType];
    setProgress(true);

    try {
      const formData = new FormData();
      formData.append("employeeID", iDNext);
      formData.append(fileType, selectedFile);

      const uploadRes = await axios.post(apiRoutes.file.uploadfile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadRes.data.success) {
        console.error("Upload success");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        text: `Tải lên ${fileType} thất bại.`,
        icon: "error",
        showConfirmButton: true,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setProgress(false);
    }
  };

  const handleTabSelect = async (key) => {
    setSelectedTab(key);

    if (key !== "general") {
      alert();
    }
  };

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      {progress && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress size={80} style={{ color: "#069855" }} />
        </div>
      )}
      {selectedEmployee ? (
        <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
          <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
            <IoIosArrowRoundBack
              className="w-[30px] h-[30px] ml-[1%] cursor-pointer "
              onClick={() => {
                setSelectedEmployee(null);
                handleCancelClick1();
                handleCancelClick2();
                handleCancelClick3();
                handleCancelClick4();
              }}
            />
            <TabSelector
              tabs={[
                { key: "general", label: "General" },
                { key: "job", label: "Job" },
                { key: "payroll", label: "Payroll" },
                { key: "performance", label: "Performance" },
                { key: "documents", label: "Documents" },
                { key: "dependents", label: "Dependents" },
              ]}
              selectedTab={selectedTab}
              onTabSelect={handleTabSelect}
              wrapperClassName="gap-10 md:gap-10 text-[#1C1C1C] ml-7"
            />
          </div>

          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-full text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex ml-[2%] mt-[2%] mb-[2%]">
              {isEditing1 ? (
                <div className="relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-[230px] h-[230px] object-cover border border-gray-300"
                    />
                  ) : (
                    <button
                      onClick={handleChooseFile}
                      className="flex flex-col rounded-none border-[1px] w-[230px] h-[230px] bg-[#EAEAEA] border-gray-400 text-[#C5C5C5] text-[10px] justify-center items-center hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                    >
                      <HiOutlinePhoto className="w-[30px] h-[30px]" />
                      <p className="w-[150px] mt-[5px] text-[12px]">
                        Image: png, jpg, jpeg. Size Maximum: 1mb. Resolution:
                        500x500px.
                      </p>
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              ) : (
                <img
                  alt="avatar"
                  src={apiRoutes.file.avatar(selectedEmployee.avatar)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "src/assets/avatar.png";
                  }}
                  className="w-[230px] h-[230px] object-cover border border-gray-300"
                />
              )}

              <div className="ml-[3%] w-full">
                <div className="flex justify-between items-center">
                  <p className="text-[20px] font-bold">Personal Information</p>
                  {isEditing1 ? (
                    <div className="flex space-x-2 mr-[3%]">
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
                      className="w-[25px] h-[25px] mr-[4%] text-[#069855] cursor-pointer"
                      onClick={handleEditClick1}
                    />
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  {isEditing1 ? (
                    <>
                      <p>
                        {formData1.status === "Active" ? "Active" : "Inactive"}
                      </p>
                      <div
                        className={`w-14 h-7 flex items-center rounded-[4px] border border-gray-400 p-1 cursor-pointer transition-all ${
                          formData1.status === "Active"
                            ? "bg-[#00FF94]"
                            : "bg-gray-300"
                        }`}
                        onClick={handleToggleStatus}
                      >
                        <div
                          className={`w-5 h-5 bg-gray-800 rounded-[4px] transition-all ${
                            formData1.status === "Active"
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div>
                    <p className="w-fit text-[#828282]">ID Employee</p>
                    {isEditing1 ? (
                      <input
                        readOnly
                        type="text"
                        value={selectedEmployee.employeeID}
                        disabled
                        className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[6%] whitespace-nowrap"
                      ></input>
                    ) : (
                      <p className="mt-[5%] font-bold ">
                        {selectedEmployee.employeeID}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">First Name</p>
                    {isEditing1 ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData1.firstName}
                        onChange={handleChange1}
                        className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[6%] "
                      />
                    ) : (
                      <p className="w-fit font-bold mt-[5%]">
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
                      <p className="w-fit font-bold mt-[5%]">
                        {selectedEmployee.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="w-fit text-[#828282] whitespace-nowrap">
                      Alias
                    </p>
                    {isEditing1 ? (
                      <input
                        type="text"
                        name="alias"
                        value={formData1.alias}
                        onChange={handleChange1}
                        className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[5%]"
                      />
                    ) : (
                      <p className=" w-fit font-bold mt-[5%]">
                        {selectedEmployee.alias}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-x-3 mt-6">
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
                      <p className=" w-fit font-bold mt-[5%]">
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
                      <ClickOutside
                        className="w-full"
                        setIsOpen={setIsGenderOpen}
                      >
                        <div className="relative">
                          <div
                            className="inline-flex w-[215%] border-gray-200 border-1 h-[42px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
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
                      </ClickOutside>
                    ) : (
                      <p className="w-fit font-bold mt-[5%]">
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
          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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
                      <ClickOutside setIsOpen={setIsTypeOpen}>
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[42px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
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
                                  onClick={() => {
                                    setFormData4((prev) => ({
                                      ...prev,
                                      employeeType: option,
                                    }));
                                    setIsTypeOpen(false);
                                  }}
                                  className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                >
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </ClickOutside>
                    ) : (
                      <p className="w-fit font-bold">
                        {selectedEmployee.employeeType}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Department</p>
                    {isEditing4 ? (
                      <ClickOutside setIsOpen={setIsDepartOpen}>
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[42px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
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
                                  onClick={() => {
                                    setFormData4((prev) => ({
                                      ...prev,
                                      department: option.name, // Cập nhật department khi chọn
                                    }));
                                    handleOptionClick4(option.name); // Gọi hàm lọc job title khi chọn department
                                  }}
                                  className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                >
                                  {option.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </ClickOutside>
                    ) : (
                      <p className="w-fit font-bold">
                        {selectedEmployee.department}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Position</p>
                    {isEditing4 ? (
                      <ClickOutside setIsOpen={setIsPositionOpen}>
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[42px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                            onClick={togglePossitionDropdown}
                          >
                            <span className="text-[15px]">
                              {formData4?.jobTitle}
                            </span>
                            <IoIosArrowDown />
                          </div>
                        </div>
                        {isPositionOpen && (
                          <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                              {filteredJobTitles.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() => {
                                    setFormData4((prev) => ({
                                      ...prev,
                                      jobTitle: option.name,
                                    }));
                                    setIsPositionOpen(false);
                                  }}
                                  className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                >
                                  {option.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </ClickOutside>
                    ) : (
                      <p className="w-fit font-bold">
                        {selectedEmployee.jobTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">Role</p>
                    {isEditing4 ? (
                      <ClickOutside setIsOpen={setIsRoleOpen}>
                        <div className="relative">
                          <div
                            className="inline-flex w-[260px] border-gray-200 border-1 h-[42px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                            onClick={toggleRoleDropdown}
                          >
                            <span className="text-[15px]">
                              {formData4.role?.name || "Select Role"}
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
                                  onClick={() => {
                                    setFormData4((prev) => ({
                                      ...prev,
                                      role: option,
                                    }));
                                    setIsRoleOpen(false);
                                  }}
                                  className="block capitalize px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                >
                                  {option.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </ClickOutside>
                    ) : (
                      <p className="w-fit font-bold capitalize">
                        {roleData.find((r) => r._id === selectedEmployee.role)
                          ?.name || "--"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
                  <div>
                    <p className="text-[#828282]">Joining Date</p>
                    {isEditing4 ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={
                            formData4.joiningDate
                              ? dayjs(formData4.joiningDate)
                              : null
                          }
                          onChange={(newDate) =>
                            setFormData4((prev) => ({
                              ...prev,
                              joiningDate: newDate ? newDate.toISOString() : "",
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
                        {formatDate(selectedEmployee.joiningDate) ===
                        "NaN/NaN/NaN"
                          ? "--"
                          : formatDate(selectedEmployee.joiningDate)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[#828282]">End Date</p>
                    {isEditing4 ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={
                            formData4.endDate ? dayjs(formData4.endDate) : null
                          }
                          onChange={(newDate) =>
                            setFormData4((prev) => ({
                              ...prev,
                              endDate: newDate ? newDate.toISOString() : "",
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
                        {formatDate(selectedEmployee.endDate) === "NaN/NaN/NaN"
                          ? "--"
                          : formatDate(selectedEmployee.endDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] mb-[2%]">
            <div className="mt-[2%] ml-[2%]">
              <div className="flex items-center justify-between">
                <p className="text-[20px] font-bold">Credential</p>
                <div className="flex items-center justify-center">
                  {isCredentialOpen ? (
                    <button
                      type="button"
                      className="ml-[-70%] bg-[#2EB67D] text-white outline-none w-fit text-[16px] caret-transparent focus:outline-none flex items-center"
                      onClick={() => {
                        if (isCredentialOpen) {
                          handleUploadFiles();
                        }
                      }}
                    >
                      <GoPlus className="w-[25px] h-[25px] mr-2" />
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCredentialOpen(!isCredentialOpen);
                      }}
                      className="ml-[-70%] bg-[#2EB67D] text-white outline-none w-fit text-[16px] caret-transparent focus:outline-none flex items-center"
                    >
                      <GoPlus className="w-[25px] h-[25px] mr-2" />
                      Credential
                    </button>
                  )}
                </div>
              </div>
              {/* table*/}
              {isCredentialOpen ? (
                <div className="text-[14px] ml-[15px] border-l border-b border-r w-fit mb-5">
                  <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden w-[calc(100vw-500px)] caret-transparent border-gray-200 border">
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
                          <div className="text-left w-[240px]  ">Photo ID</div>
                        </td>
                        <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                          <FileUpload
                            fileType="photoID"
                            selectedEmployee={selectedEmployee}
                            setSelectedFile={(file) =>
                              setSelectedFiles((prev) => ({
                                ...prev,
                                photoID: file,
                              }))
                            }
                          />
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]  ">
                            {" "}
                            {selectedFiles.photoID && (
                              <a
                                href={URL.createObjectURL(
                                  selectedFiles.photoID
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                Preview Photo ID
                              </a>
                            )}
                          </div>
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
                          <FileUpload
                            fileType="certificate"
                            selectedEmployee={selectedEmployee}
                            setSelectedFile={(file) =>
                              setSelectedFiles((prev) => ({
                                ...prev,
                                certificate: file,
                              }))
                            }
                          />
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]  ">
                            {selectedFiles.certificate && (
                              <a
                                href={URL.createObjectURL(
                                  selectedFiles.certificate
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                Preview Certificate
                              </a>
                            )}
                          </div>
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
                          <FileUpload
                            fileType="graduationCertificate"
                            selectedEmployee={selectedEmployee}
                            setSelectedFile={(file) =>
                              setSelectedFiles((prev) => ({
                                ...prev,
                                graduationCertificate: file,
                              }))
                            }
                          />
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]  ">
                            {selectedFiles.graduationCertificate && (
                              <a
                                href={URL.createObjectURL(
                                  selectedFiles.graduationCertificate
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                Preview Graduation Certificate
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]  ">--</div>
                        </td>
                      </tr>
                      <tr className="cursor-pointer">
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px] ">Order</div>
                        </td>
                        <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                          <FileUpload
                            fileType="order"
                            selectedEmployee={selectedEmployee}
                            setSelectedFile={(file) =>
                              setSelectedFiles((prev) => ({
                                ...prev,
                                order: file,
                              }))
                            }
                          />
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]">
                            {selectedFiles.order && (
                              <a
                                href={URL.createObjectURL(selectedFiles.order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                Preview Order
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]">--</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-[14px] ml-[15px] border-l border-b border-r w-fit mb-5">
                  <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden w-[calc(100vw-500px)] caret-transparent border-gray-200 border">
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
                      {[
                        { key: "photoID", label: "Photo ID" },
                        { key: "certificate", label: "Certificate" },
                        {
                          key: "graduationCertificate",
                          label: "Graduation Certificate",
                        },
                        { key: "order", label: "Order" },
                      ]
                        .filter((field) => selectedEmployee[field.key])
                        .map((field) => (
                          <tr key={field.key} className="cursor-pointer">
                            <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                              <div className="text-left w-[200px]">
                                {field.label}
                              </div>
                            </td>

                            <td className="px-1 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                              <div className="text-left w-[240px]">--</div>
                            </td>
                            <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                              <div className="w-[200px]">
                                {fileInfos[field.key] && (
                                  <a
                                    href={apiRoutes.file.file(
                                      selectedEmployee[field.key]
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Download {field.label}
                                  </a>
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                              <div className="text-left w-[200px]">--</div>
                            </td>

                            <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                              <div className="text-left w-[90px]">
                                <FaRegTrashCan className="w-[25px] h-[25px] text-red-400" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      {![
                        "photoID",
                        "certificate",
                        "graduationCertificate",
                        "order",
                      ].some((key) => selectedEmployee[key]) && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center text-gray-400 py-5 border-b border-gray-200 w-[calc(100vw-430px)] text-[15px]"
                          >
                            No file data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
          <div className="flex ml-[3%] space-x-13 mt-[2%] caret-transparent">
            {/* active */}
            <div className="bg-white w-[calc(100vw-340px)] h-[150px] rounded-[40px] flex justify-around items-center shadow-md p-6 relative">
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
                  className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[85%] overflow-y-auto no-scrollbar mt-10"
                  overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
                >
                  <div className="flex flex-col mt-[-2%]">
                    <div className="flex items-center mb-2">
                      <IoIosArrowRoundBack
                        className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                        onClick={closeModal}
                      />
                      <p className="text-[20px] font-bold ">Create Employee</p>
                    </div>
                    <div className="bg-gray-300 w-[110%] h-0.5 mt-[1%] mb-[1%] ml-[-5%]"></div>
                  </div>
                  <div className="border-gray-200 border-2 rounded-[5px] w-[104%] ml-[-2%]">
                    <div className="flex mt-[2%]">
                      {/* avatar */}
                      <div className="ml-[10px] ">
                        <FileUpload
                          fileType="avatar"
                          selectedEmployee={selectedEmployee}
                          setSelectedFile={(file) =>
                            setSelectedFiles((prev) => ({
                              ...prev,
                              avatar: file,
                            }))
                          }
                        />
                      </div>
                      {/* text 1*/}
                      <div className="ml-[2%]">
                        <div className="flex items-center justify-between">
                          <p className="text-[20px] font-bold">
                            Personal Information
                          </p>
                          <div className="flex items-center space-x-3 ">
                            <p>{status ? "Active" : "Inactive"}</p>
                            <div
                              className={`w-14 h-7 flex items-center rounded-[4px] border border-gray-400 p-1 cursor-pointer transition-all ${
                                status ? "bg-[#B2CCC1]" : "bg-gray-300"
                              }`}
                              onClick={() => setStatus(!status)}
                            >
                              <div
                                className={`w-5 h-5 bg-gray-800 rounded-[4px] transition-all ${
                                  status ? "translate-x-6" : "translate-x-0"
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
                                className={`border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                  errors.firstName
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                value={firstName}
                                placeholder="Input First Name"
                                onChange={(e) => {
                                  setFirstName(
                                    e.target.value.replace(/[0-9]/g, "")
                                  );
                                  setErrors({});
                                }}
                              />
                              {errors.firstName && (
                                <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                            <div className="mt-7">
                              <div className="flex">
                                <p>ID Card</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className={`border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                  errors.idCard
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                value={idCard}
                                maxLength={11}
                                placeholder="Input ID Card"
                                onChange={(e) => {
                                  setIdCard(
                                    e.target.value.replace(/[a-zA-Z]/g, "")
                                  );
                                  setErrors({});
                                }}
                              />
                              {errors.idCard && (
                                <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                  {errors.idCard}
                                </p>
                              )}
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
                                className={`border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                  errors.lastName
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                value={lastName}
                                placeholder="Input Last Name"
                                onChange={(e) => {
                                  setLastName(
                                    e.target.value.replace(/[0-9]/g, "")
                                  );
                                  setErrors({});
                                }}
                              />
                              {errors.lastName && (
                                <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                            <div className="mt-7">
                              <div className="flex">
                                <p>Date of Birth</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={dateOfBirth}
                                  onChange={(newDate) => {
                                    setDateOfBirth(newDate);
                                    setErrors({});
                                  }}
                                  format="DD/MM/YYYY"
                                  slotProps={{
                                    textField: {
                                      error: Boolean(errors.dateOfBirth),
                                    },
                                  }}
                                />
                              </LocalizationProvider>
                              {errors.dateOfBirth && (
                                <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                  {errors.dateOfBirth}
                                </p>
                              )}
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
                                className={`border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                  errors.alias
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                value={alias}
                                placeholder="Input Alias"
                                onChange={(e) => {
                                  setAlias(
                                    e.target.value.replace(/[0-9]/g, "")
                                  );
                                  setErrors({});
                                }}
                              />
                              {errors.alias && (
                                <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                  {errors.alias}
                                </p>
                              )}
                            </div>
                            <div className="mt-7 space-x-5">
                              <ClickOutside setIsOpen={setIsGenderOpen}>
                                <div className="flex">
                                  <p>Gender</p>
                                  <p className="text-[#E03137] ml-1">*</p>
                                </div>
                                <div className="relative">
                                  <div
                                    className={`inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 ${
                                      errors.gender
                                        ? "border-[2px] border-red-500"
                                        : ""
                                    }`}
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
                                          onClick={() => {
                                            handleOptionClick1(option);
                                            setErrors({});
                                          }}
                                          className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                        >
                                          {option}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {errors.gender && (
                                  <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                    {errors.gender}
                                  </p>
                                )}
                              </ClickOutside>
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
                            <div className="relative w-[530px]">
                              <span className="absolute left-[10px] mt-5 text-[15px]">
                                (+84)
                              </span>
                              <input
                                type="text"
                                maxLength={12}
                                className={`border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[60px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                  errors.phoneNumber
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                value={phoneNumber}
                                // placeholder="Input Phone Number"
                                onChange={(e) => {
                                  setPhoneNumber(
                                    e.target.value.replace(/[a-zA-Z]/g, "")
                                  );
                                  setErrors({});
                                }}
                              />
                            </div>
                            {errors.phoneNumber && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.phoneNumber}
                              </p>
                            )}
                          </div>
                          <div className="mt-7">
                            <div className="flex">
                              <p>Address</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <input
                              type="text"
                              className={`border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                errors.address
                                  ? "border-[2px] border-red-500"
                                  : ""
                              }`}
                              value={address}
                              placeholder="Input Address"
                              onChange={(e) => {
                                setAddress(e.target.value);
                                setErrors({});
                              }}
                            />
                            {errors.address && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.address}
                              </p>
                            )}
                          </div>
                          <div className="mt-7">
                            <div className="flex">
                              <p>Province</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <input
                              type="text"
                              className={`border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                errors.province
                                  ? "border-[2px] border-red-500"
                                  : ""
                              }`}
                              value={province}
                              placeholder="Input Province"
                              onChange={(e) => {
                                setProvince(e.target.value);
                                setErrors({});
                              }}
                            />
                            {errors.province && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.province}
                              </p>
                            )}
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
                              className={`border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                errors.emailCompany
                                  ? "border-[2px] border-red-500"
                                  : ""
                              }`}
                              value={emailCompany}
                              placeholder="Input Email Company"
                              onChange={(e) => {
                                setEmailCompany(e.target.value);
                                setErrors({});
                              }}
                            />
                            {errors.emailCompany && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.emailCompany}
                              </p>
                            )}
                          </div>
                          <div className="mt-7">
                            <div className="flex">
                              <p>Email Personal </p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <input
                              type="text"
                              className={`border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                errors.emailPersonal
                                  ? "border-[2px] border-red-500"
                                  : ""
                              }`}
                              value={emailPersonal}
                              placeholder="Input Email Personal"
                              onChange={(e) => {
                                setEmailPersonal(e.target.value);
                                setErrors({});
                              }}
                            />
                            {errors.emailPersonal && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.emailPersonal}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-5">
                            <div className="mt-7">
                              <div className="flex">
                                <p>Postcode</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className={`border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                  errors.postcode
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                value={postcode}
                                placeholder="Input Postcode"
                                onChange={(e) => {
                                  setPostcode(e.target.value);
                                  setErrors({});
                                }}
                              />
                              {errors.postcode && (
                                <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                  {errors.postcode}
                                </p>
                              )}
                            </div>
                            <div className="mt-7">
                              <div className="flex">
                                <p>City</p>
                                <p className="text-[#E03137] ml-1">*</p>
                              </div>
                              <input
                                type="text"
                                className={`border-gray-200 rounded-[5px] border-[1px] w-[260px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                                  errors.city
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                value={city}
                                placeholder="Input City"
                                onChange={(e) => {
                                  setCity(e.target.value);
                                  setErrors({});
                                }}
                              />
                              {errors.city && (
                                <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                  {errors.city}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Text 3 */}
                    <div className="mt-[2%] ml-[3%]">
                      <p className="text-[20px] font-bold">Bank Account</p>
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
                                setErrors({});
                              }}
                            />
                          </div>
                          <div className="mt-7">
                            <div className="flex">
                              <p>Account Number</p>
                            </div>
                            <input
                              type="text"
                              maxLength={10}
                              className={`border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                              value={bankAccountNumber}
                              placeholder="Input Account Number"
                              onChange={(e) => {
                                setbankAccountNumber(e.target.value);
                                setErrors({});
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          {/* Col 2 */}
                          <div className="mt-[3%]">
                            <div className="flex">
                              <p>Account Name</p>
                            </div>
                            <input
                              type="text"
                              className={`border-gray-200 rounded-[5px] border-[1px] w-[530px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                              value={accountName}
                              placeholder="Input Account Name"
                              onChange={(e) => {
                                setAccountName(e.target.value);
                                setErrors({});
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
                        <div className="mt-7">
                          <ClickOutside setIsOpen={setIsTypeOpen}>
                            <div className="flex">
                              <p>Employee Type</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className={`inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 ${
                                  errors.employeeType
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                onClick={toggleTypeDropdown}
                              >
                                <span className="text-[15px]">
                                  {employeeType}
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
                                      onClick={() => {
                                        handleOptionClick3(option);
                                        setErrors({});
                                      }}
                                      className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                    >
                                      {option}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {errors.employeeType && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.employeeType}
                              </p>
                            )}
                          </ClickOutside>
                        </div>
                        <div className="mt-7">
                          <ClickOutside setIsOpen={setIsDepartOpen}>
                            <div className="flex">
                              <p>Department</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className={`inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 ${
                                  errors.department
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
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
                                      onClick={() => {
                                        handleOptionClick4(option.name);
                                        setErrors({});
                                      }}
                                      className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                    >
                                      {option.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {errors.department && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.department}
                              </p>
                            )}
                          </ClickOutside>
                        </div>

                        <div className="mt-7">
                          <ClickOutside setIsOpen={setIsPositionOpen}>
                            <div className="flex">
                              <p>Job title</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className={`inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 ${
                                  errors.jobTitle
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                onClick={togglePossitionDropdown}
                              >
                                <span className="text-[15px]">{jobTitle}</span>
                                <IoIosArrowDown />
                              </div>
                            </div>
                            {isPositionOpen && (
                              <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                                <ul className="py-1">
                                  {filteredJobTitles.map((option, index) => (
                                    <li
                                      key={index}
                                      onClick={() => {
                                        setJobTitle(option.name); // hoặc setFormData4({...}) nếu đang dùng formData
                                        setIsPositionOpen(false);
                                      }}
                                      className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                    >
                                      {option.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {errors.jobTitle && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.jobTitle}
                              </p>
                            )}
                          </ClickOutside>
                        </div>
                        <div className="mt-7">
                          <ClickOutside setIsOpen={setIsRoleOpen}>
                            <div className="flex">
                              <p>Role</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <div className="relative">
                              <div
                                className={`inline-flex w-[260px] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 ${
                                  errors.role
                                    ? "border-[2px] border-red-500"
                                    : ""
                                }`}
                                onClick={toggleRoleDropdown}
                              >
                                <span className="text-[15px] capitalize">
                                  {role}
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
                                      onClick={() => {
                                        handleOptionClick2(option.name);
                                        setErrors({});
                                      }}
                                      className="block capitalize px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                    >
                                      {option.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {errors.role && (
                              <p className="text-red-500 text-[12px] mt-2 mb-[-25px] caret-transparent">
                                {errors.role}
                              </p>
                            )}
                          </ClickOutside>
                        </div>
                      </div>
                      <div>
                        {/* Col 2 */}
                        <div className="flex space-x-6">
                          {/* Col 1 */}
                          <div className="mt-7">
                            <div className="flex">
                              <p>Joining Date</p>
                              <p className="text-[#E03137] ml-1">*</p>
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={joiningDate}
                                onChange={(newDate) => {
                                  setJoiningDate(newDate);
                                  setErrors({});
                                }}
                                format="DD/MM/YYYY"
                                className="border-gray-200 rounded-[5px] border-[1px] w-[540px] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                slotProps={{
                                  textField: {
                                    error: Boolean(errors.joiningDate),
                                  },
                                }}
                              />
                            </LocalizationProvider>
                            {errors.joiningDate && (
                              <p className="text-red-500 text-[12px] mt-6 mb-[-25px] caret-transparent">
                                {errors.joiningDate}
                              </p>
                            )}
                          </div>
                          <div className="mt-7">
                            <p>End Date</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={endDate}
                                format="DD/MM/YYYY"
                                onChange={(newDate) => {
                                  setEndDate(newDate);
                                  setErrors({});
                                }}
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
                    <div className="mt-[3%] ml-[3%]">
                      <p className="text-[20px] font-bold">Credential</p>
                      {/* table*/}
                      <div className="text-[14px] ml-[15px] border-l border-b border-r w-[95%] mb-5">
                        <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden caret-transparent border-gray-200 border">
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
                                <FileUpload
                                  fileType="photoID"
                                  selectedEmployee={selectedEmployee}
                                  setSelectedFile={(file) =>
                                    setSelectedFiles((prev) => ({
                                      ...prev,
                                      photoID: file,
                                    }))
                                  }
                                />
                              </td>
                              <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                <div className="text-left w-[240px]  ">
                                  {" "}
                                  {selectedFiles.photoID && (
                                    <a
                                      href={URL.createObjectURL(
                                        selectedFiles.photoID
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      Preview Photo ID
                                    </a>
                                  )}
                                </div>
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
                                <FileUpload
                                  fileType="certificate"
                                  selectedEmployee={selectedEmployee}
                                  setSelectedFile={(file) =>
                                    setSelectedFiles((prev) => ({
                                      ...prev,
                                      certificate: file,
                                    }))
                                  }
                                />
                              </td>
                              <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                <div className="text-left w-[240px]  ">
                                  {selectedFiles.certificate && (
                                    <a
                                      href={URL.createObjectURL(
                                        selectedFiles.certificate
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      Preview Certificate
                                    </a>
                                  )}
                                </div>
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
                                <FileUpload
                                  fileType="graduationCertificate"
                                  selectedEmployee={selectedEmployee}
                                  setSelectedFile={(file) =>
                                    setSelectedFiles((prev) => ({
                                      ...prev,
                                      graduationCertificate: file,
                                    }))
                                  }
                                />
                              </td>
                              <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                <div className="text-left w-[240px]  ">
                                  {selectedFiles.graduationCertificate && (
                                    <a
                                      href={URL.createObjectURL(
                                        selectedFiles.graduationCertificate
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      Preview Graduation Certificate
                                    </a>
                                  )}
                                </div>
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
                                <FileUpload
                                  fileType="order"
                                  selectedEmployee={selectedEmployee}
                                  setSelectedFile={(file) =>
                                    setSelectedFiles((prev) => ({
                                      ...prev,
                                      order: file,
                                    }))
                                  }
                                />
                              </td>
                              <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                                <div className="text-left w-[240px]">
                                  {selectedFiles.order && (
                                    <a
                                      href={URL.createObjectURL(
                                        selectedFiles.order
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      Preview Order
                                    </a>
                                  )}
                                </div>
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
                    <div className="bg-gray-300 w-[110%] h-0.5 mt-[2%] mb-[1%] ml-[-5%]"></div>
                    <div className="flex justify-end mr-[10px] mb-[-2%]">
                      <button
                        onClick={closeModal}
                        className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleCreate();
                        }}
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
              <div className="mt-[10px] text-[14px] ml-[15px]">
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
                        Email Company
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
                        <td className="truncate px-1 py-6 border-b border-gray-200 text-[#252C58] text-left">
                          {item.employeeID}
                        </td>
                        <td className="px-6 py-6 border-b border-gray-200 text-[#252C58] truncate text-left">
                          {`${item.firstName} ${item.lastName}`}
                        </td>
                        <td className="px-4 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%] truncate text-left">
                          {item.jobTitle}
                        </td>
                        <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%] truncate text-left">
                          {item.department}
                        </td>
                        <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%] truncate">
                          <div className="truncate text-left w-[260px]">
                            {item.emailCompany}
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMoreOptions(null);
                                      verifyDelete(item._id);
                                    }}
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
            <PaginationFooter
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={data.length}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
