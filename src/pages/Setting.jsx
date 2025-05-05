import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import TabSelector from "../components/TabSelector";
import { Fragment } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import PaginationFooter from "../components/PaginationFooter";
import { useNavigate } from "react-router-dom";
import UsePermission from "../components/UsePermission";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { CircularProgress } from "@mui/material";

// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const Setting = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("setting.read");
  const { hasPermission: canReadRole } = UsePermission("setting.read.role");
  const { hasPermission: canReadPermission } = UsePermission(
    "setting.read.permission"
  );
  const { hasPermission: canReadDepartment } = UsePermission(
    "setting.read.department"
  );
  const { hasPermission: canReadJobTitle } = UsePermission(
    "setting.read.jobtitle"
  );
  const { hasPermission: canReadHoliday } = UsePermission(
    "setting.read.holiday"
  );

  const [progress, setProgress] = useState(false);

  const [selectedTab, setSelectedTab] = useState("role");
  const [dataRole, setDataRole] = useState([]);
  const [permission, setPermission] = useState([]);
  const [department, setDepartment] = useState([]);
  const [jobTitle, setJobTitle] = useState([]);
  const [holiday, setHoliday] = useState([]);

  const [moreOptions1, setMoreOptions1] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalAddRole, setModalAddRole] = useState(false);
  const [modalEditRole, setModalEditRole] = useState(false);

  const [moreOptions2, setMoreOptions2] = useState(null);
  const [selectedDepart, setSelectedDepart] = useState(null);
  const [modalAddDepart, setModalAddDepart] = useState(false);
  const [modalEditDepart, setModalEditDepart] = useState(false);

  const [moreOptions3, setMoreOptions3] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalAddJob, setModalAddJob] = useState(false);
  const [modalEditJob, setModalEditJob] = useState(false);

  const [modalAddPermission, setModalAddPermission] = useState(false);

  const [moreOptions4, setMoreOptions4] = useState(null);
  const [modalAddHoliday, setModalAddHoliday] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [modalEditHoliday, setModalEditHoliday] = useState(false);

  const [nameHoliday, setNameHoliday] = useState("");
  // const [errors6, setErrors6] = useState("");
  const [startHoliday, setStartHoliday] = useState(null);
  // const [errors7, setErrors7] = useState("");
  const [endHoliday, setEndHoliday] = useState(null);
  // const [errors8, setErrors8] = useState("");

  const [nameRole, setNameRole] = useState("");
  const [errors, setErrors] = useState("");

  const [namePermission, setNamePermission] = useState("");
  const [desPermission, setDesPermission] = useState("");

  const [errors3, setErrors3] = useState("");
  const [errors5, setErrors5] = useState("");

  const [errors1, setErrors1] = useState("");
  const [nameDepart, setNameDepart] = useState("");

  const [errors2, setErrors2] = useState("");
  const [errors4, setErrors4] = useState("");
  const [nameJob, setNameJob] = useState("");

  const [isDepartOpen, setIsDepartOpen] = useState(false);
  const [departName, setDepartName] = useState("Select Department");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  const [expandedRoleId, setExpandedRoleId] = useState(null);

  const isPermissionAssigned = (role, permId) => {
    return role.permissions.some((p) => p._id === permId);
  };

  const handleTogglePermission = async (roleId, permissionId, isActive) => {
    setProgress(true);

    try {
      const url = isActive
        ? apiRoutes.permission.unassignPermission
        : apiRoutes.permission.assignPermission;

      const response = await axios.post(
        url,
        { roleId, permissionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSnackMessage(
          isActive ? "Permission removed" : "Permission assigned"
        );
        setSnackSeverity("success");
        setSnackOpen(true);

        const refreshedData = await axios.get(apiRoutes.role.getRole);
        setDataRole(refreshedData.data);
      }
    } catch (error) {
      setSnackMessage("Failed to update permission");
      setSnackSeverity("error");
      setSnackOpen(true);
      console.log(error);
    } finally {
      setProgress(false);
    }
  };

  const handleOptionClick1 = (option, id) => {
    setDepartName(option);
    setSelectedDepartmentId(id);
    setIsDepartOpen(false);
  };

  // Dropdown selection of manager name
  const toggleDepartDropdown = () => setIsDepartOpen(!isDepartOpen);

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataRole.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemsDepartment = department.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentItemsJobTitle = jobTitle.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentItemsHoliday = holiday.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const closeModalAddRole = () => {
    setModalAddRole(false);
    setNameRole("");
    setErrors("");
  };

  const closeModalEditHoliday = () => {
    setModalEditHoliday(false);
    setNameHoliday("");
    setStartHoliday(null);
    setEndHoliday(null);
    selectedHoliday("");
  };

  const closeModalAddHoliday = () => {
    setModalAddHoliday(false);
    setNameHoliday("");
    setStartHoliday(null);
    setEndHoliday(null);
  };

  const closeModalEditRole = () => {
    setModalEditRole(false);
    setNameRole("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get all role
  useEffect(() => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRole(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all permission
  useEffect(() => {
    axios
      .get(apiRoutes.permission.getPermission)
      .then((response) => {
        setPermission(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all holiday
  useEffect(() => {
    axios
      .get(apiRoutes.holiday.getAllHolidays)
      .then((response) => {
        setHoliday(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all department
  useEffect(() => {
    axios
      .get(apiRoutes.department.getAllDepartment)
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all jobTitle
  useEffect(() => {
    axios
      .get(apiRoutes.jobtitle.getAllJobtitle)
      .then((response) => {
        setJobTitle(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const moduleTitleMap = {
    dashboard: "Dashboard",
    user: "Employee",
    calendar: "Calendar",
    absence: "Absence report",
    overtime: "Overtime report",
    attendance: "Attendance",
    message: "Message",
    payroll: "Payroll",
    qr: "QR",
    setting: "Setting",
  };

  const groupedData = {};

  permission.forEach((item) => {
    const [module] = item.name.split(".");
    const title = moduleTitleMap[module] || module;
    console.log(title);

    if (!groupedData[title]) {
      groupedData[title] = [];
    }
    groupedData[title].push(item);
  });

  // Add role
  const handleCreate = async () => {
    let isValid = true;

    if (!nameRole) {
      setErrors("Name Role is required.");
      isValid = false;
    } else {
      setErrors("");
    }

    if (!isValid) return;

    setProgress(true);

    try {
      const response = await axios.post(
        apiRoutes.role.createRole,
        {
          name: nameRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          text: "Add Role Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalAddDepart(false);
      } else {
        Swal.fire({
          text: "Add Role Fail",
          icon: "error",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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

  // Add permission
  const handleCreatePermission = async () => {
    let isValid = true;

    if (!namePermission) {
      setErrors3("Name Permission is required.");
      isValid = false;
    } else {
      setErrors3("");
    }

    if (!desPermission) {
      setErrors5("Description Permission is required.");
      isValid = false;
    } else {
      setErrors5("");
    }

    if (!isValid) return;

    setProgress(true);

    try {
      const response = await axios.post(
        apiRoutes.permission.createPermission,
        {
          name: namePermission,
          description: desPermission,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          text: "Add Permission Successfully",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,

          showConfirmButton: false,
        });
        setModalAddPermission(false);
      } else {
        Swal.fire({
          text: "Add Permission Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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

  // Add holiday
  const handleCreateHoliday = async () => {
    let isValid = true;

    if (!nameHoliday) {
      setErrors3("Name is required.");
      isValid = false;
    } else {
      setErrors3("");
    }

    if (!startHoliday) {
      setErrors5("Start Holiday is required.");
      isValid = false;
    } else {
      setErrors5("");
    }

    if (!endHoliday) {
      setErrors5("End Date is required.");
      isValid = false;
    } else {
      setErrors5("");
    }

    if (!isValid) return;

    setProgress(true);

    try {
      const response = await axios.post(
        apiRoutes.holiday.createHoliday,
        {
          name: nameHoliday,
          startDate: startHoliday,
          endDate: endHoliday,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          text: "Add Holiday Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalAddHoliday(false);
      } else {
        Swal.fire({
          text: "Add Holiday Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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
  // Edit holiday
  const handleEditHoliday = async () => {
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.holiday.updateHoliday(selectedHoliday._id),
        {
          name: nameHoliday,
          startDate: startHoliday,
          enđate: endHoliday,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Edit Holiday Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalEditHoliday(false);
      } else {
        Swal.fire({
          text: "Edit Holiday Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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
  // Delete holiday
  const verifyDeleteHoliday = async (id) => {
    setProgress(true);

    try {
      const response = await axios.delete(apiRoutes.holiday.deleteHoliday(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Holiday Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          text: "Delete Holiday Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    } finally {
      setProgress(false);
    }
  };

  const closeModalAddPermission = () => {
    setModalAddPermission(false);
    setNamePermission("");
    setDesPermission("");
    setErrors3("");
    setErrors5("");
  };

  // Edit role
  const handleEditRole = async () => {
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.role.updateRole(selectedRole._id),
        {
          name: nameRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Edit Role Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalEditRole(false);
      } else {
        Swal.fire({
          text: "Edit Role Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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
  // Delete role
  const verifyDeleteRole = async (id) => {
    setProgress(true);
    try {
      const response = await axios.delete(apiRoutes.role.deleteRole(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Role Successfully",
          icon: "success",
          showConfirmButton: false,
          timerProgressBar: true,

          timer: 2000,
        });
      } else {
        Swal.fire({
          text: "Delete Role Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    } finally {
      setProgress(false);
    }
  };

  const closeModalAddDepart = () => {
    setModalAddDepart(false);
    setNameDepart("");
    setErrors1("");
  };

  const closeModalEditDepart = () => {
    setModalEditDepart(false);
    setNameDepart("");
  };

  // Add Department
  const handleCreateDepart = async () => {
    let isValid = true;

    if (!nameDepart) {
      setErrors("Name Department is required.");
      isValid = false;
    } else {
      setErrors("");
    }

    if (!isValid) {
      return;
    }
    setProgress(true);
    try {
      const response = await axios.post(
        apiRoutes.department.createDepartment,
        {
          name: nameDepart,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          text: "Add Department Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalAddDepart(false);
      } else {
        Swal.fire({
          text: "Add Department Fail",
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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
  // Edit role
  const handleEditDepart = async () => {
    setProgress(true);
    try {
      const response = await axios.put(
        apiRoutes.department.updatedDepartment(selectedDepart._id),
        {
          name: nameDepart,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Edit Department Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalEditDepart(false);
      } else {
        Swal.fire({
          text: "Edit Department Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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
  // Delete Department
  const verifyDeleteDepart = async (id) => {
    setProgress(true);
    try {
      const response = await axios.delete(
        apiRoutes.department.deleteDepartment(id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Department Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          text: "Delete Department Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    } finally {
      setProgress(false);
    }
  };

  const closeModalAddJob = () => {
    setModalAddJob(false);
    setNameJob("");
    setErrors2("");
  };

  const closeModalEditJob = () => {
    setModalEditJob(false);
    setNameJob("");
  };

  // Add JobTitle
  const handleCreateJob = async () => {
    let isValid = true;

    if (!nameJob) {
      setErrors2("Name Job Title is required.");
      isValid = false;
    } else {
      setErrors2("");
    }

    if (!selectedDepartmentId) {
      setErrors4("Department is required.");
      isValid = false;
    } else {
      setErrors4("");
    }

    if (!isValid) {
      return;
    }
    setProgress(true);
    try {
      const response = await axios.post(
        apiRoutes.jobtitle.createJobtitle,
        { name: nameJob },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const jobtitleId = response.data._id;

        const assignResponse = await axios.post(
          apiRoutes.jobtitle.assignJobtitle,
          {
            departmentId: selectedDepartmentId,
            jobtitleId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (assignResponse.status === 200) {
          Swal.fire({
            text: "Add and assign Job Title successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
          setModalAddJob(false);
        } else {
          Swal.fire({
            text: "Assign Job Title failed",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        }
      } else {
        Swal.fire({
          text: "Add Job Title failed",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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

  // Edit job
  const handleEditJob = async () => {
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.jobtitle.updatedJobtitle(selectedJob._id),
        {
          name: nameJob,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Edit Job Title Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalEditJob(false);
      } else {
        Swal.fire({
          text: "Edit Job Title Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
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

  const token = localStorage.getItem("token");
  // Delete Joj
  const verifyDeleteJob = async (id) => {
    setProgress(true);

    try {
      const response = await axios.delete(
        apiRoutes.jobtitle.deleteJobtitle(id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Job Title Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          text: "Delete Job Title Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    } finally {
      setProgress(false);
    }
  };

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success"); // success, error, warning, info

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="left" />;
  };

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  const hasAnySettingPermission =
    canReadRole ||
    canReadPermission ||
    canReadDepartment ||
    canReadJobTitle ||
    canReadHoliday;

  if (!hasAnySettingPermission) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="text-[30px] font-light"
      >{`You don't have the required permissions to view any of the settings sections.`}</div>
    );
  }

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
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <TabSelector
          tabs={[
            canReadRole && { key: "role", label: "Setting Role" },
            canReadPermission && {
              key: "permission",
              label: "Setting Permission",
            },
            canReadDepartment && {
              key: "department",
              label: "Setting Department",
            },
            canReadJobTitle && { key: "job", label: "Setting Job Title" },
            canReadHoliday && { key: "holiday", label: "Setting Holiday" },
          ].filter(Boolean)} // Loại bỏ các tab không có quyền
          selectedTab={selectedTab}
          onTabSelect={(key) => setSelectedTab(key)}
          wrapperClassName="gap-10 md:gap-10 text-[#1C1C1C] ml-7"
        />
      </div>
      {selectedTab === "role" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">List Role</p>
            </div>

            {/* Search */}
            <div className="relative flex items-center flex-1 min-w-[200px] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[400px] ml-14">
              <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Quick Search"
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

            {/* Add Role */}
            <div
              className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
              onClick={() => setModalAddRole(true)}
            >
              <p>Add Role</p>
            </div>
            {/* Add Permission */}
            <div
              className="flex items-center justify-center min-w-[130px] sm:min-w-[150px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
              onClick={() => setModalAddPermission(true)}
            >
              <p>Add Permission</p>
            </div>
            {/* Add Role */}
            <Modal
              isOpen={modalAddRole}
              onRequestClose={() => setModalAddRole(false)}
              shouldCloseOnOverlayClick={false}
              className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
              overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                <div className="flex items-center mb-2">
                  <IoIosArrowRoundBack
                    className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                    onClick={closeModalAddRole}
                  />
                  <p className="text-[20px] font-bold ">Add Role</p>
                </div>
                <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
              </div>
              <div className="mt-[5%]">
                <div>
                  <p>Name Role</p>
                  <input
                    type="text"
                    className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                      errors ? "border-[2px] border-red-500" : ""
                    }`}
                    value={nameRole}
                    placeholder="Input Name Role"
                    onChange={(e) => {
                      setNameRole(e.target.value);
                      setErrors("");
                    }}
                  />
                  {errors && (
                    <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                      {errors}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-5">
                  <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                  <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                    <button
                      onClick={closeModalAddRole}
                      className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreate()}
                      className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
            {/* Add Permission */}
            <Modal
              isOpen={modalAddPermission}
              onRequestClose={() => setModalAddPermission(false)}
              shouldCloseOnOverlayClick={false}
              className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
              overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                <div className="flex items-center mb-2">
                  <IoIosArrowRoundBack
                    className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                    onClick={closeModalAddPermission}
                  />
                  <p className="text-[20px] font-bold ">Add Permission</p>
                </div>
                <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
              </div>
              <div className="mt-[5%]">
                <div className="flex space-x-4">
                  <div>
                    <p>Name Permission</p>
                    <input
                      type="text"
                      className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                        errors3 ? "border-[2px] border-red-500" : ""
                      }`}
                      value={namePermission}
                      placeholder="Input Name Permission"
                      onChange={(e) => {
                        setNamePermission(e.target.value);
                        setErrors3("");
                      }}
                    />
                    {errors3 && (
                      <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                        {errors3}
                      </p>
                    )}
                  </div>
                  <div>
                    <p>Description Permission</p>
                    <input
                      type="text"
                      className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                        errors5 ? "border-[2px] border-red-500" : ""
                      }`}
                      value={desPermission}
                      placeholder="Input Description Permission"
                      onChange={(e) => {
                        setDesPermission(e.target.value);
                        setErrors5("");
                      }}
                    />
                    {errors5 && (
                      <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                        {errors5}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mt-5 mb-5">
                  <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                  <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                    <button
                      onClick={closeModalAddPermission}
                      className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreatePermission()}
                      className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          {/* List */}
          {dataRole.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      No
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Name
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Permission
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <Fragment key={item._id}>
                      <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]">
                        <td className="px-3 py-6 border-b border-gray-200 text-left w-[20%]">
                          {index + 1}
                        </td>
                        <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[40%] capitalize">
                          {item.name}
                        </td>

                        <td className="px-10 py-6 border-b border-gray-200 truncate text-left w-[40%]">
                          {item.permissions?.length + "+" || 0}
                        </td>
                        <td className="flex space-x-14 px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                          <HiOutlineDotsHorizontal
                            className="text-[23px]"
                            onClick={() => {
                              setMoreOptions1(
                                moreOptions1 === item._id ? null : item._id
                              );
                            }}
                          />
                          <IoIosArrowDown
                            className="text-xl cursor-pointer"
                            onClick={() =>
                              setExpandedRoleId(
                                expandedRoleId === item._id ? null : item._id
                              )
                            }
                          />
                        </td>
                        {moreOptions1 === item._id && (
                          <div
                            className="absolute bg-white right-[10%] z-10 mt-[-1%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                          >
                            <div className="absolute right-3 z-10  w-auto origin-top-right rounded-lg shadow-lg bg-white">
                              <div className="flex flex-col divide-y divide-gray-200">
                                {/* Edit */}
                                <div
                                  className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setMoreOptions1(null);
                                    setSelectedRole(item);
                                    setModalEditRole(true);
                                    setNameRole(item.name);
                                  }}
                                >
                                  <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                  <span>Edit</span>
                                </div>

                                {/* Delete */}
                                <div
                                  onClick={() => {
                                    setMoreOptions1(null);
                                    verifyDeleteRole(item._id);
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

                        {/* Edit Role */}
                        <Modal
                          isOpen={modalEditRole}
                          onRequestClose={() => setModalEditRole(false)}
                          shouldCloseOnOverlayClick={false}
                          className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                          overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                        >
                          <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                            <div className="flex items-center mb-2">
                              <IoIosArrowRoundBack
                                className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                                onClick={closeModalEditRole}
                              />
                              <p className="text-[20px] font-bold ">
                                Edit Role
                              </p>
                            </div>
                            <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                          </div>
                          <div className="mt-[5%]">
                            <div>
                              <p>Name Role</p>
                              <input
                                type="text"
                                className={`border capitalize border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                                value={nameRole}
                                onChange={(e) => {
                                  setNameRole(e.target.value);
                                }}
                              />
                            </div>
                            <div className="flex flex-col mt-5">
                              <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                              <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                                <button
                                  onClick={closeModalEditRole}
                                  className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleEditRole()}
                                  className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </Modal>
                      </tr>
                      {expandedRoleId === item._id && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-4 bg-gray-50 border-b border-gray-300"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {permission.map((perm) => {
                                const assigned = isPermissionAssigned(
                                  item,
                                  perm._id
                                );
                                return (
                                  <div
                                    key={perm._id}
                                    className="flex justify-between items-center border p-3 rounded bg-white"
                                  >
                                    <span className="text-sm">
                                      {perm.description}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleTogglePermission(
                                          item._id,
                                          perm._id,
                                          assigned
                                        )
                                      }
                                      className={`px-3 py-1 text-xs text-white rounded ${
                                        assigned ? "bg-red-500" : "bg-green-500"
                                      }`}
                                    >
                                      {assigned ? "Inactive" : "Active"}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
                // onClick={() => setModalIsOpen(true)}
              >
                + Employee
              </button>
            </div>
          )}
          <PaginationFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={dataRole.length}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
      {selectedTab === "permission" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                List Permission
              </p>
            </div>
          </div>
          {/* List */}
          {permission.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Permission
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Sub-Permission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedData).map(
                    ([title, items], groupIndex) => (
                      <Fragment key={groupIndex}>
                        {items.map((item, itemIndex) => (
                          <Fragment key={item._id}>
                            <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]">
                              {itemIndex === 0 ? (
                                <td className="px-3 py-6 text-left font-semibold text-[16px] w-[25%]">
                                  {title}
                                </td>
                              ) : (
                                <td className="px-3 py-6 w-[25%]" />
                              )}
                              <td className="px-5 py-6 truncate text-left w-[40%] capitalize">
                                {item.description}
                              </td>
                            </tr>
                            {itemIndex === items.length - 1 && (
                              <tr className="border-b border-gray-200">
                                <td></td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </Fragment>
                    )
                  )}
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
                // onClick={() => setModalIsOpen(true)}
              >
                + Employee
              </button>
            </div>
          )}
        </div>
      )}
      {selectedTab === "department" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                List Department
              </p>
            </div>

            {/* Search */}
            <div className="relative flex items-center flex-1 min-w-[200px] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[400px] ml-14">
              <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Quick Search"
                className="h-[50px] w-full pl-12 rounded-[10px] border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] placeholder:text-[#252C58] placeholder:opacity-100"
              />
            </div>

            {/* Filter Button */}
            <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
              <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
              <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 caret-transparent text-[#252C5880] text-[15px] flex items-center font-light">
                Filter
              </div>
            </div>

            {/* Add Department */}
            <div
              onClick={() => setModalAddDepart(true)}
              className="flex items-center justify-center min-w-[150px] sm:min-w-[150px] h-[50px] caret-transparent text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
            >
              <p>Add Department</p>
            </div>
            <Modal
              isOpen={modalAddDepart}
              onRequestClose={() => setModalAddDepart(false)}
              shouldCloseOnOverlayClick={false}
              className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
              overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                <div className="flex items-center mb-2">
                  <IoIosArrowRoundBack
                    className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                    onClick={closeModalAddDepart}
                  />
                  <p className="text-[20px] font-bold ">Add Department</p>
                </div>
                <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
              </div>
              <div className="mt-[5%]">
                <div>
                  <p>Name Department</p>
                  <input
                    type="text"
                    className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                      errors1 ? "border-[2px] border-red-500" : ""
                    }`}
                    value={nameDepart}
                    placeholder="Input Name Department"
                    onChange={(e) => {
                      setNameDepart(e.target.value);
                      setErrors1("");
                    }}
                  />
                  {errors1 && (
                    <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                      {errors1}
                    </p>
                  )}
                </div>
                <div className="flex flex-col mt-5">
                  <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                  <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                    <button
                      onClick={closeModalAddDepart}
                      className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreateDepart()}
                      className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          {/* List */}
          {department.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      No
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Name
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsDepartment.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                    >
                      <td className="px-3 py-6 border-b border-gray-200 text-left w-[45%]">
                        {index + 1}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[45%] capitalize">
                        {item.name}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          onClick={() => {
                            setMoreOptions2(
                              moreOptions2 === item._id ? null : item._id
                            );
                          }}
                        />
                      </td>
                      {moreOptions2 === item._id && (
                        <div
                          className="absolute bg-white right-[7%] z-10 mt-[4%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                        >
                          <div className="absolute right-10 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                            <div className="flex flex-col divide-y divide-gray-200">
                              {/* Edit */}
                              <div
                                className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setMoreOptions2(null);
                                  setSelectedDepart(item);
                                  setModalEditDepart(true);
                                  setNameDepart(item.name);
                                }}
                              >
                                <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                <span>Edit</span>
                              </div>

                              {/* Delete */}
                              <div
                                onClick={() => {
                                  setMoreOptions2(null);
                                  verifyDeleteDepart(item._id);
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
                      {/* Edit Depart */}
                      <Modal
                        isOpen={modalEditDepart}
                        onRequestClose={() => setModalEditDepart(false)}
                        shouldCloseOnOverlayClick={false}
                        className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                        overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                      >
                        <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                          <div className="flex items-center mb-2">
                            <IoIosArrowRoundBack
                              className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                              onClick={closeModalEditDepart}
                            />
                            <p className="text-[20px] font-bold ">Edit Role</p>
                          </div>
                          <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                        </div>
                        <div className="mt-[5%]">
                          <div>
                            <p>Name Department</p>
                            <input
                              type="text"
                              className={`border capitalize border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                              value={nameDepart}
                              onChange={(e) => {
                                setNameDepart(e.target.value);
                              }}
                            />
                          </div>
                          <div className="flex flex-col mt-5">
                            <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                            <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                              <button
                                onClick={closeModalEditDepart}
                                className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditDepart()}
                                className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </Modal>
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
                // onClick={() => setModalIsOpen(true)}
              >
                + Employee
              </button>
            </div>
          )}
          {/* infor bottom */}
          <PaginationFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={department.length}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
      {selectedTab === "job" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                List Job Title
              </p>
            </div>

            {/* Search */}
            <div className="relative flex items-center flex-1 min-w-[200px] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[400px] ml-14">
              <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Quick Search"
                className="h-[50px] w-full pl-12 rounded-[10px] border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] placeholder:text-[#252C58] placeholder:opacity-100"
              />
            </div>

            {/* Filter Button */}
            <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
              <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
              <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 caret-transparent text-[#252C5880] text-[15px] flex items-center font-light">
                Filter
              </div>
            </div>

            {/* Add Jobtitle */}
            <div
              onClick={() => setModalAddJob(true)}
              className="flex items-center justify-center min-w-[150px] sm:min-w-[150px] h-[50px] caret-transparent text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
            >
              <p>Add Job Title</p>
            </div>
            {/* Add Role */}
            <Modal
              isOpen={modalAddJob}
              onRequestClose={() => setModalAddJob(false)}
              shouldCloseOnOverlayClick={false}
              className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
              overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                <div className="flex items-center mb-2">
                  <IoIosArrowRoundBack
                    className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                    onClick={closeModalAddJob}
                  />
                  <p className="text-[20px] font-bold ">Add Job Title</p>
                </div>
                <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
              </div>
              <div className="mt-[5%]">
                <div className="flex space-x-4 w-full">
                  <div className="mt-[1%] w-[60%]">
                    <p>Department</p>
                    <div className="space-x-5">
                      <div
                        className="relative inline-block text-left w-full"
                        // ref={dropdownRef}
                      >
                        <div className="relative">
                          <div
                            className="inline-flex w-full border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[5px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                            onClick={toggleDepartDropdown}
                          >
                            <span className="text-[15px]">{departName}</span>
                            <IoIosArrowDown />
                          </div>
                        </div>
                        {isDepartOpen && (
                          <div className="absolute z-10 mt-2 w-[97%] bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                              {department.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    handleOptionClick1(option.name, option._id)
                                  }
                                  className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                >
                                  {option.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {errors4 && (
                          <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                            {errors4}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>Name Job Title</p>
                    <input
                      type="text"
                      className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                        errors2 ? "border-[2px] border-red-500" : ""
                      }`}
                      value={nameJob}
                      placeholder="Input Name Job Title"
                      onChange={(e) => {
                        setNameJob(e.target.value);
                        setErrors2("");
                      }}
                    />
                    {errors2 && (
                      <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                        {errors2}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mt-5 mb-5">
                  <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                  <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                    <button
                      onClick={closeModalAddJob}
                      className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreateJob()}
                      className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          {/* List */}
          {jobTitle.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      No
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Name
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsJobTitle.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                    >
                      <td className="px-3 py-6 border-b border-gray-200 text-left w-[45%]">
                        {index + 1}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[45%] capitalize">
                        {item.name}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          onClick={() => {
                            setMoreOptions3(
                              moreOptions3 === item._id ? null : item._id
                            );
                          }}
                        />
                      </td>
                      {moreOptions3 === item._id && (
                        <div
                          className="absolute bg-white right-[10%] z-10 mt-[4%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                        >
                          <div className="absolute right-3 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                            <div className="flex flex-col divide-y divide-gray-200">
                              {/* Edit */}
                              <div
                                className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setMoreOptions3(null);
                                  setSelectedJob(item);
                                  setModalEditJob(true);
                                  setNameJob(item.name);
                                }}
                              >
                                <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                <span>Edit</span>
                              </div>

                              {/* Delete */}
                              <div
                                onClick={() => {
                                  setMoreOptions3(null);
                                  verifyDeleteJob(item._id);
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
                      {/* Edit Job */}
                      <Modal
                        isOpen={modalEditJob}
                        onRequestClose={() => setModalEditJob(false)}
                        shouldCloseOnOverlayClick={false}
                        className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                        overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                      >
                        <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                          <div className="flex items-center mb-2">
                            <IoIosArrowRoundBack
                              className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                              onClick={closeModalEditJob}
                            />
                            <p className="text-[20px] font-bold ">Edit Role</p>
                          </div>
                          <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                        </div>
                        <div className="mt-[5%]">
                          <div>
                            <p>Name Job Title</p>
                            <input
                              type="text"
                              className={`border capitalize border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                              value={nameJob}
                              onChange={(e) => {
                                setNameJob(e.target.value);
                              }}
                            />
                          </div>

                          <div className="flex flex-col mt-5">
                            <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                            <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                              <button
                                onClick={closeModalEditJob}
                                className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditJob()}
                                className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </Modal>
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
                // onClick={() => setModalIsOpen(true)}
              >
                + Employee
              </button>
            </div>
          )}
          {/* infor bottom */}
          <PaginationFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={jobTitle.length}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
      {selectedTab === "holiday" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                List Holiday
              </p>
            </div>

            {/* Search */}
            <div className="relative flex items-center flex-1 min-w-[200px] sm:min-w-[300px] md:min-w-[350px] lg:min-w-[400px] ml-14">
              <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Quick Search"
                className="h-[50px] w-full pl-12 rounded-[10px] border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] placeholder:text-[#252C58] placeholder:opacity-100"
              />
            </div>

            {/* Filter Button */}
            <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
              <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
              <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 caret-transparent text-[#252C5880] text-[15px] flex items-center font-light">
                Filter
              </div>
            </div>

            {/* Add Jobtitle */}
            <div
              onClick={() => setModalAddHoliday(true)}
              className="flex items-center justify-center min-w-[150px] sm:min-w-[150px] h-[50px] caret-transparent text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
            >
              <p>Add Holiday</p>
            </div>
            {/* Add Role */}
            <Modal
              isOpen={modalAddHoliday}
              onRequestClose={() => setModalAddHoliday(false)}
              shouldCloseOnOverlayClick={false}
              className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
              overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                <div className="flex items-center mb-2">
                  <IoIosArrowRoundBack
                    className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                    onClick={closeModalAddHoliday}
                  />
                  <p className="text-[20px] font-bold ">Add Holiday</p>
                </div>
                <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
              </div>
              <div className="mt-[5%]">
                <div className="w-full">
                  <div className="w-full">
                    <p>Name Holiday</p>
                    <input
                      type="text"
                      className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                      value={nameHoliday}
                      placeholder="Input Name Holiday"
                      onChange={(e) => {
                        setNameHoliday(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex space-x-4 w-full mt-5">
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="w-full">
                        <p className="mb-2">Start Date</p>
                        <DatePicker
                          value={startHoliday}
                          onChange={setStartHoliday}
                          format="DD/MM/YYYY"
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                          className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                        />
                      </div>
                    </LocalizationProvider>
                  </div>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="w-full">
                        <p className="mb-2">End Date</p>
                        <DatePicker
                          value={endHoliday}
                          onChange={setEndHoliday}
                          format="DD/MM/YYYY"
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                          className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                        />
                      </div>
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="flex flex-col mt-5 mb-5">
                  <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                  <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                    <button
                      onClick={closeModalAddHoliday}
                      className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreateHoliday()}
                      className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          {/* List */}
          {holiday.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      No
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Name
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Start Date
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      End Date
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsHoliday.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                    >
                      <td className="px-3 py-6 border-b border-gray-200 text-left w-[25%]">
                        {index + 1}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[25%] capitalize">
                        {item.name}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[25%] capitalize">
                        {formatDate(item.startDate)}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[45%] capitalize">
                        {formatDate(item.endDate)}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          onClick={() => {
                            setMoreOptions4(
                              moreOptions4 === item._id ? null : item._id
                            );
                          }}
                        />
                      </td>
                      {moreOptions4 === item._id && (
                        <div
                          className="absolute bg-white right-[7%] z-10 mt-[4%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                        >
                          <div className="absolute right-3 z-10  w-auto origin-top-right rounded-lg shadow-lg bg-white">
                            <div className="flex flex-col divide-y divide-gray-200">
                              {/* Edit */}
                              <div
                                className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setMoreOptions4(null);
                                  setSelectedHoliday(item);
                                  setNameHoliday(item.name || "");
                                  setStartHoliday(
                                    item.startDate
                                      ? dayjs(item.startDate)
                                      : null
                                  );
                                  setEndHoliday(
                                    item.endDate ? dayjs(item.endDate) : null
                                  );
                                  setModalEditHoliday(true);
                                }}
                              >
                                <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                <span>Edit</span>
                              </div>

                              {/* Delete */}
                              <div
                                onClick={() => {
                                  setMoreOptions4(null);
                                  verifyDeleteHoliday(item._id);
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
                      {/* Edit Job */}
                      <Modal
                        isOpen={modalEditHoliday}
                        onRequestClose={() => setModalEditHoliday(false)}
                        shouldCloseOnOverlayClick={false}
                        className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                        overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                      >
                        <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                          <div className="flex items-center mb-2">
                            <IoIosArrowRoundBack
                              className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                              onClick={closeModalEditHoliday}
                            />
                            <p className="text-[20px] font-bold ">
                              Edit Holiday
                            </p>
                          </div>
                          <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                        </div>
                        <div className="mt-[5%]">
                          <div className="w-full">
                            <div className="w-full">
                              <p>Name Holiday</p>
                              <input
                                type="text"
                                className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                                value={nameHoliday}
                                placeholder="Input Name Holiday"
                                onChange={(e) => {
                                  setNameHoliday(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-4 w-full mt-5">
                            <div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div className="w-full">
                                  <p className="mb-2">Start Date</p>
                                  <DatePicker
                                    value={startHoliday}
                                    onChange={setStartHoliday}
                                    format="DD/MM/YYYY"
                                    renderInput={(params) => (
                                      <TextField {...params} fullWidth />
                                    )}
                                    className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  />
                                </div>
                              </LocalizationProvider>
                            </div>
                            <div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div className="w-full">
                                  <p className="mb-2">End Date</p>
                                  <DatePicker
                                    value={endHoliday}
                                    onChange={setEndHoliday}
                                    format="DD/MM/YYYY"
                                    renderInput={(params) => (
                                      <TextField {...params} fullWidth />
                                    )}
                                    className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                                  />
                                </div>
                              </LocalizationProvider>
                            </div>
                          </div>
                          <div className="flex flex-col mt-5 mb-5">
                            <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                            <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                              <button
                                onClick={closeModalEditHoliday}
                                className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditHoliday()}
                                className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </Modal>
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
                // onClick={() => setModalIsOpen(true)}
              >
                + Employee
              </button>
            </div>
          )}
          {/* infor bottom */}
          <PaginationFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={jobTitle.length}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 5 }}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          onClose={handleSnackClose}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Setting;
