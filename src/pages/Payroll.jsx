import { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import TabSelector from "../components/TabSelector";
import { useNavigate } from "react-router-dom";
import UsePermission from "../components/UsePermission";
import axios from "axios";
import dayjs from "dayjs";
import apiRoutes from "../../apiRoutes";
import Swal from "sweetalert2";
import PaginationFooter from "../components/PaginationFooter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { jwtDecode } from "jwt-decode";
import { CircularProgress } from "@mui/material";
import alert from "../components/Alert";
import SortableHeader from "../components/SortableHeader";

// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { IoIosArrowRoundBack, IoIosArrowDown } from "react-icons/io";

Modal.setAppElement("#root");
const Payroll = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("payroll.read");

  const [progress, setProgress] = useState(false);

  const [payroll, setPayroll] = useState([]);
  const [baseSalary, setBaseSalary] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("payroll");
  const [selectedTab2, setSelectedTab2] = useState("base");
  const [modalSalaryIsOpen, setModalSalaryIsOpen] = useState(false);
  const [modalBaseIsOpen, setModalBaseIsOpen] = useState(false);
  const [modalAddBaseIsOpen, setModalAddBaseIsOpen] = useState(false);
  const [modalAddSalaryIsOpen, setModalAddSalaryIsOpen] = useState(false);

  const [moreOptions1, setMoreOptions1] = useState(null);
  const [moreOptions2, setMoreOptions2] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployee1, setSelectedEmployee1] = useState(null);

  const [department, setDepartment] = useState("Department");
  const [isDepartOpen, setIsDepartOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [departData, setDepartData] = useState([]);
  const [jobTitle, setJobTitle] = useState("Position");
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);
  const [positionData, setPositionData] = useState([]);

  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const [isNameOpen, setIsNameOpen] = useState(false);
  const [name, setName] = useState("Select Employee");
  const [nameBase, setNameBase] = useState("");
  const [amount, setAmount] = useState("");

  const [netSalary, setNetSalary] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [ot, setOt] = useState("");
  const [unpaid, setUnpaid] = useState("");
  const [income, setIncome] = useState("");
  const [advance, setAdvance] = useState("");
  const [subtraction, setSubtraction] = useState("");

  const [nameID, setNameID] = useState("");
  const [bonus, setBonus] = useState("");
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  const mergedData = payroll.map((salary) => {
    const user = data.find((emp) => emp.employeeID === salary.employeeID);
    const employeeName = user ? `${user.firstName} ${user.lastName}` : "";
    return {
      ...salary,
      employeeName,
      email: user?.emailPersonal || "",
      department: user?.department || "",
      type: user?.employeeType || "",
      joiningDate: user?.joiningDate || "",
    };
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState({
    employeeName: "",
    joiningDate: "",
    type: "",
    department: "",
  });

  const clearFilters = () => {
    setFilters({
      employeeName: "",
      joiningDate: "",
      type: "",
      department: "",
    });
  };

  const isFiltering =
    filters.employeeName ||
    filters.joiningDate ||
    filters.type ||
    filters.department;

  const filteredData = isFiltering
    ? mergedData.filter((item) => {
        const name = item.employeeName?.toLowerCase() || "";
        const nameMatch =
          !filters.employeeName ||
          name.includes(filters.employeeName.toLowerCase());

        const itemDate = item.joiningDate ? new Date(item.joiningDate) : null;
        const filterDate = filters.joiningDate
          ? new Date(filters.joiningDate)
          : null;
        const dateMatch =
          !filterDate ||
          (itemDate && itemDate.toDateString() === filterDate.toDateString());
        const departmentMatch =
          !filters.department ||
          item.department?.toString() === filters.department;
        const typeMatch =
          !filters.type ||
          String(item.type).toLowerCase() === filters.type.toLowerCase();

        return nameMatch && dateMatch && departmentMatch && typeMatch;
      })
    : mergedData;

  useEffect(() => {
    if (selectedEmployee1) {
      setNameBase(selectedEmployee1.name || "");
      setAmount(selectedEmployee1.amount || "");
      setJobTitle(selectedEmployee1.department?.jobtitle || []);
      setDepartment(selectedEmployee1.department?.name || "");
    }
  }, [selectedEmployee1]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (selectedEmployee) {
      setName(selectedEmployee.employeeName || "");
      setNetSalary(selectedEmployee.netSalary || "");
      setBasicSalary(selectedEmployee.baseSalary || []);
      setOt(selectedEmployee.otPay || "");
      setUnpaid(selectedEmployee.unpaidLeave || "");
      setIncome(selectedEmployee.personalIncomeTax || "");
      setAdvance(selectedEmployee.salaryAdvance || "");
      setSubtraction(selectedEmployee.salarySubtraction || "");
    }
  }, [selectedEmployee]);

  const closeModalSalary = () => {
    setModalSalaryIsOpen(false);
  };

  const closeModalBase = () => {
    setModalBaseIsOpen(false);
    setJobTitle("Position");
    setSelectedJobTitles([]);
    setDepartment("Department");
  };

  const closeModalAddBase = () => {
    setModalAddBaseIsOpen(false);
    setDepartment("Department");
    setJobTitle("Position");
    setSelectedJobTitles([]);
    setAmount("");
    setNameBase("");
  };

  const closeModalAddSalary = () => {
    setModalAddSalaryIsOpen(false);
    setSelectedEmployee(null);
    setBonus("");
    setAdvance("");
    setSubtraction("");
    setMonth(null);
    setYear(null);
  };

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const [datausers, setDatausers] = useState([]);

  // Get all users
  useEffect(() => {
    axios
      .get(apiRoutes.user.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
        const filteredUser = response.data.filter(
          (user) => user._id !== decodedToken._id
        );

        setDatausers(filteredUser);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Dropdown selection of manager name
  const toggleNameDropdown = () => setIsNameOpen(!isNameOpen);
  const handleOptionClick1 = (option, id) => {
    setName(option);
    setNameID(id);
    setIsNameOpen(false);
  };

  const fetchPayroll = () => {
    axios
      .get(apiRoutes.payroll.getAllPayrolls)
      .then((response) => {
        setPayroll(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  };

  // Update salary
  const handleUpdateSalary = async (id) => {
    const formData = {
      employeeID: nameID,
      employeeName: name,
      otPay: ot,
      bonus: bonus,
      unpaidLeave: unpaid,
      personalIncomeTax: income,
      salaryAdvance: advance,
      salarySubtraction: subtraction,
      netSalary: netSalary,
    };
    fetchPayroll();
    setProgress(true);
    try {
      const response = await axios.put(
        apiRoutes.payroll.updatePayroll(id),
        formData
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Update Salary Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalBaseIsOpen(false);
      } else {
        Swal.fire({
          text: "Update Salary Failed",
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

  const handleTabSelect = async (key) => {
    if (key === "payslip") {
      alert();
    }
    if (key === "payroll" || key === "payitems") {
      setSelectedTab(key);
    }
  };

  // Delete salary
  const verifyDeleteSalary = async (id) => {
    setProgress(true);

    try {
      const response = await axios.delete(apiRoutes.payroll.deletePayroll(id));

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Salary Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        fetchPayroll();
      } else {
        Swal.fire({
          text: "Delete Salary Fail",
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

  // Get all base salary
  const fetchBase = () => {
    axios
      .get(apiRoutes.basesalary.getAllBaseSalaries)
      .then((response) => {
        setBaseSalary(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  };

  useEffect(() => {
    fetchPayroll();
    fetchBase();
  }, []);

  // Create Base salary
  const handleCreateBasealary = async () => {
    let isValid = true;

    if (!isValid) {
      return;
    }

    const formData = {
      name: nameBase,
      amount,
      departmentId: selectedDepartmentId,
      jobtitleIds: selectedJobTitles,
    };
    setProgress(true);

    try {
      const response = await axios.post(
        apiRoutes.basesalary.createBaseSalary,
        formData
      );

      if (response.status === 201) {
        Swal.fire({
          text: "Add Base Salary Successfully",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,

          showConfirmButton: false,
        });
        fetchBase();
        setModalAddSalaryIsOpen(false);
      } else {
        Swal.fire({
          text: "Add Base Salary Fail",
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

  // Create salary
  const handleCreateSalary = async () => {
    let isValid = true;

    if (!isValid) {
      return;
    }

    const formData = {
      employeeID: nameID,
      bonus: bonus,
      salaryAdvance: advance,
      salarySubtraction: subtraction,
      month,
      year,
    };
    setProgress(true);
    fetchPayroll();
    try {
      const response = await axios.post(
        apiRoutes.payroll.createPayroll,
        formData
      );

      if (response.status === 201) {
        Swal.fire({
          text: "Add Salary Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalAddSalaryIsOpen(false);
      } else {
        Swal.fire({
          text: "Add Salary Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
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

  // Update base salary
  const handleUpdateBaseSalary = async (id) => {
    const formData = {
      name: nameBase,
      amount,
      departmentId: selectedDepartmentId,
      jobtitleIds: selectedJobTitles,
    };
    fetchBase();
    setProgress(true);
    try {
      const response = await axios.put(
        apiRoutes.basesalary.updateBaseSalary(id),
        formData
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Update Base Salary Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalBaseIsOpen(false);
      } else {
        Swal.fire({
          text: "Update Base Salary Failed",
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

  // Delete base salary
  const verifyDeleteBase = async (id) => {
    setProgress(true);

    try {
      const response = await axios.delete(
        apiRoutes.basesalary.deleteBaseSalary(id)
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Base Salary Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        fetchBase();
      } else {
        Swal.fire({
          text: "Delete Base Salary Fail",
          icon: "error",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2000,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    } finally {
      setProgress(false);
    }
  };

  // Dropdown selection of position
  const togglePossitionDropdown = () => setIsPositionOpen(!isPositionOpen);

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
  };

  // Get data dropdown
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [departments, positions] = await Promise.all([
          axios.get(apiRoutes.department.getAllDepartment),
          axios.get(apiRoutes.jobtitle.getAllJobtitle),
        ]);

        setDepartData(departments.data);
        setPositionData(positions.data);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems1 = baseSalary.slice(indexOfFirstItem, indexOfLastItem);

  const [sortConfig1, setSortConfig1] = useState({
    key: null,
    direction: "asc",
  });
  const [sortConfig2, setSortConfig2] = useState({
    key: null,
    direction: "asc",
  });

  const requestSort1 = (key) => {
    let direction = "asc";
    if (sortConfig1.key === key && sortConfig1.direction === "asc") {
      direction = "desc";
    }
    setSortConfig1({ key, direction });
  };

  const requestSort2 = (key) => {
    let direction = "asc";
    if (sortConfig2.key === key && sortConfig2.direction === "asc") {
      direction = "desc";
    }
    setSortConfig2({ key, direction });
  };

  const sortedItems1 = useMemo(() => {
    const sorted = [...currentItems1];
    if (sortConfig1.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig1.key];
        const bVal = b[sortConfig1.key];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig1.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = aVal?.toString().toLowerCase() || "";
        const bStr = bVal?.toString().toLowerCase() || "";

        return sortConfig1.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }
    return sorted;
  }, [currentItems1, sortConfig1]);

  const sortedItems2 = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig2.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig2.key]?.toString().toLowerCase() || "";
        const bVal = b[sortConfig2.key]?.toString().toLowerCase() || "";
        return sortConfig2.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }
    return sorted;
  }, [filteredData, sortConfig2]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <TabSelector
          tabs={[
            { key: "payroll", label: "Payroll" },
            { key: "payitems", label: "Pay Items" },
            { key: "payslip", label: "Pay Slip" },
          ]}
          selectedTab={selectedTab}
          onTabSelect={handleTabSelect}
          wrapperClassName="gap-10 md:gap-10 text-[#1C1C1C] ml-7"
        />
      </div>

      {selectedTab === "payroll" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            {/* Overtime Request Title */}
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                Employee Salary List
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
            <div
              onClick={() => setShowFilterModal(true)}
              className="flex items-center justify-center h-[50px] px-4 text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px] cursor-pointer"
            >
              <BiFilterAlt className="w-[25px] h-[25px]" />
              <p className="ml-2 caret-transparent">Filter</p>
            </div>
            <Modal
              isOpen={showFilterModal}
              onRequestClose={() => setShowFilterModal(false)}
              shouldCloseOnOverlayClick={false}
              className="bg-white rounded-[20px] shadow-lg w-auto max-w-[40%] p-12 transition-all duration-500 max-h-[85%] overflow-y-auto no-scrollbar mt-10"
              overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
            >
              <div className="flex flex-col mt-[-3%]">
                <div className="flex items-center mb-2">
                  <IoIosArrowRoundBack
                    className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                    onClick={() => setShowFilterModal(false)}
                  />
                  <p className="text-[20px] font-bold ">Filters</p>
                </div>
                <div className="bg-gray-300 w-[110%] h-0.5 mt-[1%] mb-[1%] ml-[-5%]"></div>
              </div>
              <input
                type="text"
                placeholder="Input Employee Name"
                value={filters.employeeName}
                onChange={(e) =>
                  setFilters({ ...filters, employeeName: e.target.value })
                }
                className="mt-5 mb-3 w-full border px-3 py-2 rounded h-[50px]"
              />

              <select
                value={filters.department}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    department: selectedValue,
                  }));
                }}
                className="w-full border px-3 py-2 rounded-md h-[50px] mb-3"
              >
                <option value="">All Department</option>
                {departData.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="mb-3 w-full border px-3 py-2 rounded h-[50px]"
              >
                <option value="">All Type</option>
                <option value="Fulltime">Fulltime</option>
                <option value="Partime">Partime</option>
                <option value="Collab">Collab</option>
                <option value="Intern">Intern</option>
              </select>

              <input
                type="date"
                value={filters.joiningDate}
                onChange={(e) =>
                  setFilters({ ...filters, joiningDate: e.target.value })
                }
                className="flex-1 border px-2 py-1 w-full rounded h-[50px]"
              />

              <div className="flex justify-end mt-5">
                <p
                  onClick={() => {
                    setShowFilterModal(false);
                    clearFilters();
                  }}
                  className="mt-1 -mb-10 text-red-500 w-fit ml-[10px] cursor-pointer"
                >
                  Clear Filter
                </p>
              </div>
            </Modal>

            {/* Add Salary */}
            <div
              onClick={() => setModalAddSalaryIsOpen(true)}
              className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
            >
              <p>Add Salary</p>
            </div>
          </div>
          <Modal
            isOpen={modalAddSalaryIsOpen}
            onRequestClose={() => setModalAddSalaryIsOpen(false)}
            shouldCloseOnOverlayClick={false}
            className="bg-white mt-10 rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
            overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
          >
            <div className="flex flex-col mt-[-5%] ml-[-5%]">
              <div className="flex items-center mb-2">
                <IoIosArrowRoundBack
                  className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                  onClick={closeModalAddSalary}
                />
                <p className="text-[20px] font-bold ">Add Salary Employee</p>
              </div>
              <div className="bg-gray-200 w-[120%] h-0.5 mt-[1%] mb-[1%] ml-[-10%]"></div>
            </div>
            <div>
              <div className="flex gap-8 mt-3">
                <div className="flex-1">
                  <p className="mb-2">Employee Name</p>
                  <div className="relative">
                    <div
                      className="w-[91%] h-[50px] border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between cursor-pointer hover:border-[#2EB67D] focus-within:border-[#2EB67D]"
                      onClick={toggleNameDropdown}
                    >
                      <span className="text-[15px] text-gray-700">
                        {name || "Select name"}
                      </span>
                      <IoIosArrowDown />
                    </div>
                    {isNameOpen && (
                      <div className="absolute z-10 mt-2 w-[91%] bg-white rounded-md shadow-lg border border-gray-200 max-h-[250px] overflow-y-auto">
                        <ul className="py-1">
                          {datausers.map((option, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleOptionClick1(
                                  `${option.firstName} ${option.lastName}`,
                                  option.employeeID
                                )
                              }
                              className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                            >
                              {`${option.firstName} ${option.lastName}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bonus Input */}
                <div className="flex-1">
                  <p className="mb-2">Bonus</p>
                  <input
                    type="text"
                    name="bonus"
                    value={bonus}
                    onChange={(e) =>
                      setBonus(e.target.value.replace(/[a-zA-Z]/g, ""))
                    }
                    className="w-[91%] h-[50px] border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex space-x-16 mt-5">
                <div>
                  <p>Salary Advance</p>
                  <input
                    type="text"
                    value={advance}
                    onChange={(e) =>
                      setAdvance(e.target.value.replace(/[a-zA-Z]/g, ""))
                    }
                    className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                  />
                </div>
                <div>
                  <p>Salary Subtraction</p>
                  <input
                    type="text"
                    value={subtraction}
                    onChange={(e) =>
                      setSubtraction(e.target.value.replace(/[a-zA-Z]/g, ""))
                    }
                    className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                  />
                </div>
              </div>
              <div className="flex space-x-14 mt-5 ">
                <div className="w-[43%]">
                  <p>Month</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={["month"]}
                      value={month ? dayjs().month(month - 1) : null} // chuyển số tháng về dayjs để hiển thị
                      onChange={(newDate) => {
                        if (newDate) {
                          const monthNumber = newDate.month() + 1; // từ 1 đến 12
                          setMonth(monthNumber);
                        }
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="w-[43%]">
                  <p>Year</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={["year"]}
                      value={year ? dayjs().year(year) : null}
                      onChange={(newDate) => {
                        if (newDate) {
                          const yearNumber = newDate.year();
                          setYear(yearNumber);
                        }
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="flex flex-col mt-5 mb-5">
                <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                  <button
                    onClick={closeModalAddSalary}
                    className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCreateSalary()}
                    className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          {/* List */}
          {payroll.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <SortableHeader
                      label="ID"
                      sortKey="employeeID"
                      sortConfig={sortConfig2}
                      onSort={requestSort2}
                      className="px-1 py-5 border-b border-gray-300 text-gray-500"
                    />
                    <SortableHeader
                      label="Employee"
                      sortKey="firstName"
                      sortConfig={sortConfig2}
                      onSort={requestSort2}
                      className="px-5 py-5 border-b border-gray-300 text-gray-500"
                    />
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Email
                    </th>
                    <SortableHeader
                      label="Department"
                      sortKey="department"
                      sortConfig={sortConfig2}
                      onSort={requestSort2}
                      className="px-5 py-5 border-b border-gray-300 text-gray-500"
                    />
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Employee Type
                    </th>
                    <SortableHeader
                      label="Joining Date"
                      sortKey="joiningDate"
                      sortConfig={sortConfig2}
                      onSort={requestSort2}
                      className="px-1 py-5 border-b border-gray-300 text-gray-500"
                    />
                    <SortableHeader
                      label="Salary"
                      sortKey="total"
                      sortConfig={sortConfig2}
                      onSort={requestSort2}
                      className="px-1 py-5 border-b border-gray-300 text-gray-500"
                    />
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems2.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px] text-left"
                    >
                      <td className="px-1 py-5 border-b border-gray-200 w-[10%]">
                        {item.employeeID}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200">
                        <div className="truncate text-left w-full ">
                          {item.employeeName}
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 truncate w-[20%]">
                        {item.email}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 w-[15%]">
                        {departData.find((r) => r._id === item.department)
                          ?.name || "--"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 w-[15%]">
                        {item.type}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 w-[13%]">
                        {formatDate(item.joiningDate)}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 w-[20%]">
                        {`${item.total.toLocaleString("vi-VN")} VNĐ`}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 relative cursor-pointer">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          onClick={() => {
                            setMoreOptions1(
                              moreOptions1 === item.employeeID
                                ? null
                                : item.employeeID
                            );
                          }}
                        />
                      </td>
                      {moreOptions1 === item.employeeID && (
                        <div
                          className="absolute bg-white right-5 z-10 mt-2 w-[200%] origin-top-right rounded-[20px] focus:outline-none font-normal"
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
                                  setMoreOptions1(null);
                                  setSelectedEmployee(item);
                                  setNameID(item.employeeID);
                                  setModalSalaryIsOpen(true);
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
                                  setMoreOptions1(null);
                                  verifyDeleteSalary(item._id);
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
                      <Modal
                        isOpen={modalSalaryIsOpen}
                        onRequestClose={() => setModalSalaryIsOpen(false)}
                        shouldCloseOnOverlayClick={false}
                        className="bg-white mt-10 rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                        overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
                      >
                        <div className="flex flex-col mt-[-5%] ml-[-5%]">
                          <div className="flex items-center mb-2">
                            <IoIosArrowRoundBack
                              className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                              onClick={closeModalSalary}
                            />
                            <p className="text-[20px] font-bold ">
                              Edit Salary Employee
                            </p>
                          </div>
                          <div className="bg-gray-200 w-[120%] h-0.5 mt-[1%] mb-[1%] ml-[-10%]"></div>
                        </div>
                        <div>
                          <div className="flex space-x-20 mt-3">
                            <div className="w-[39%]">
                              <p>Employee Name</p>
                              <div className="relative mt-2">
                                <div
                                  className="w-[118%] h-[50px] border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between cursor-pointer hover:border-[#2EB67D] focus-within:border-[#2EB67D]"
                                  onClick={toggleNameDropdown}
                                >
                                  <span className="text-[15px] text-gray-700">
                                    {name || "Select name"}
                                  </span>
                                  <IoIosArrowDown />
                                </div>
                                {isNameOpen && (
                                  <div className="absolute z-10 mt-2 w-[118%] bg-white rounded-md shadow-lg border border-gray-200 max-h-[250px] overflow-y-auto">
                                    <ul className="py-1">
                                      {datausers.map((option, index) => (
                                        <li
                                          key={index}
                                          onClick={() =>
                                            handleOptionClick1(
                                              `${option.firstName} ${option.lastName}`,
                                              option.employeeID
                                            )
                                          }
                                          className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                        >
                                          {`${option.firstName} ${option.lastName}`}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <p>Net Salary</p>
                              <input
                                type="text"
                                name="firstName"
                                value={netSalary}
                                onChange={(e) => setNetSalary(e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <p className="font-bold">Earning</p>
                            <p className="text-[#09C06C] cursor-pointer caret-transparent">
                              + Add New
                            </p>
                          </div>
                          <div className="flex space-x-14 mt-3">
                            <div>
                              <p>Basic Salary</p>
                              <input
                                type="text"
                                name="firstName"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                            <div>
                              <p>Overtime (OT)</p>
                              <input
                                type="text"
                                name="firstName"
                                value={ot}
                                onChange={(e) => setOt(e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <p className="font-bold">Deduct</p>
                            <p className="text-[#09C06C] cursor-pointer caret-transparent">
                              + Add New
                            </p>
                          </div>
                          <div className="flex space-x-14 mt-3">
                            <div>
                              <p>Unpaid leave</p>
                              <input
                                type="text"
                                name="firstName"
                                value={unpaid}
                                onChange={(e) => setUnpaid(e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                            <div>
                              <p>Personal Income Tax</p>
                              <input
                                type="text"
                                name="firstName"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                          <div className="flex space-x-14 mt-5">
                            <div>
                              <p>Salary Advance</p>
                              <input
                                type="text"
                                name="firstName"
                                value={advance}
                                onChange={(e) => setAdvance(e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                            <div>
                              <p>Salary Subtraction</p>
                              <input
                                type="text"
                                name="firstName"
                                value={subtraction}
                                onChange={(e) => setSubtraction(e.target.value)}
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col mt-5 mb-5">
                            <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                            <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                              <button
                                onClick={closeModalSalary}
                                className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateSalary(selectedEmployee._id)
                                }
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
                <p className="font-bold">Empty Attendance</p>
                <p>Add your first Payroll manually</p>
              </div>
            </div>
          )}
          {/* infor bottom */}
          <PaginationFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}

      {selectedTab === "payitems" && (
        <>
          <TabSelector
            tabs={[{ key: "base", label: "Base Salary" }]}
            selectedTab={selectedTab2}
            onTabSelect={(key) => setSelectedTab2(key)}
            type="button"
            wrapperClassName="flex gap-10 md:gap-5 text-[#1C1C1C] ml-[3%] mt-[2%] text-center"
          />

          {selectedTab2 === "base" && (
            <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
                <div>
                  <p className="text-[#252C58] text-[20px] font-light">
                    Base Salary List
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
                  <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
                    Filter
                  </div>
                </div>

                {/* Add Salary */}
                <div
                  onClick={() => setModalAddBaseIsOpen(true)}
                  className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
                >
                  <p>Add Item</p>
                </div>
              </div>
              <Modal
                isOpen={modalAddBaseIsOpen}
                onRequestClose={() => setModalAddBaseIsOpen(false)}
                shouldCloseOnOverlayClick={false}
                className="bg-white mt-10 rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
              >
                <div className="flex flex-col mt-[-5%] ml-[-5%]">
                  <div className="flex items-center mb-2">
                    <IoIosArrowRoundBack
                      className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                      onClick={closeModalAddBase}
                    />
                    <p className="text-[20px] font-bold ">Add Base Salary</p>
                  </div>
                  <div className="bg-gray-200 w-[120%] h-0.5 mt-[1%] mb-[1%] ml-[-10%]"></div>
                </div>
                <div>
                  <div className="flex space-x-14 mt-3">
                    <div className="w-[50%]">
                      <div className="flex">
                        <p>Name</p>
                        <p className="text-[#E03137] ml-1">*</p>
                      </div>
                      <input
                        type="text"
                        name="nameBase"
                        value={nameBase}
                        placeholder="Input Name"
                        onChange={(e) => {
                          setNameBase(e.target.value);
                        }}
                        className="border border-gray-300 rounded-md p-3 w-full mt-2"
                      />
                    </div>
                    <div className="w-[50%]">
                      <div className="flex">
                        <p>Amount</p>
                        <p className="text-[#E03137] ml-1">*</p>
                      </div>
                      <input
                        type="text"
                        name="amount"
                        value={amount}
                        placeholder="Input Amount"
                        onChange={(e) => {
                          setAmount(e.target.value);
                        }}
                        className="border border-gray-300 rounded-md p-3 w-full mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-14 mt-3">
                    <div className="w-[50%]">
                      <div className="flex">
                        <p>Department</p>
                        <p className="text-[#E03137] ml-1">*</p>
                      </div>
                      <div className="relative w-full">
                        <div
                          className={`inline-flex z-10 w-full border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2`}
                          onClick={toggleDepartDropdown}
                        >
                          <span className="text-[15px]">{department}</span>
                          <IoIosArrowDown />
                        </div>
                        {isDepartOpen && (
                          <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                              {departData.map((option, index) => (
                                <li
                                  key={index}
                                  onClick={() => {
                                    handleOptionClick4(option.name);
                                    setSelectedDepartmentId(option._id);
                                  }}
                                  className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                >
                                  {option.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-[50%]">
                      <div className="flex">
                        <p>Job Title</p>
                        <p className="text-[#E03137] ml-1">*</p>
                      </div>
                      <div className="relative w-full">
                        <div
                          className={`inline-flex w-full border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2`}
                          onClick={togglePossitionDropdown}
                        >
                          <span className="text-[15px] truncate">
                            {selectedJobTitles
                              .map(
                                (id) =>
                                  filteredJobTitles.find(
                                    (job) => job._id === id
                                  )?.name || "(Không tìm thấy)"
                              )
                              .join(", ")}
                          </span>
                          <IoIosArrowDown />
                        </div>
                        {isPositionOpen && (
                          <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-[200px] overflow-y-auto">
                            <ul className="py-1">
                              {filteredJobTitles.map((option, index) => {
                                const isSelected = selectedJobTitles.includes(
                                  option._id
                                );
                                return (
                                  <li
                                    key={index}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedJobTitles((prev) =>
                                          prev.filter((id) => id !== option._id)
                                        );
                                      } else {
                                        setSelectedJobTitles((prev) => [
                                          ...prev,
                                          option._id,
                                        ]);
                                      }
                                    }}
                                    className={`px-4 py-2 text-[15px] cursor-pointer ${
                                      isSelected
                                        ? "bg-[#2EB67D] text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    {option.name}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col mt-5 mb-5">
                    <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                    <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                      <button
                        onClick={closeModalAddBase}
                        className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleCreateBasealary()}
                        className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
              {/* List */}
              {baseSalary.length > 0 ? (
                <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
                  <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                    <thead>
                      <tr className="border-gray-300 border-t border-b-2 text-left">
                        <th className="px-1 py-5 border-b border-gray-300 text-gray-500">
                          No
                        </th>
                        <SortableHeader
                          label="Name"
                          sortKey="name"
                          sortConfig={sortConfig1}
                          onSort={requestSort1}
                          className="px-1 py-5 border-b border-gray-300 text-gray-500"
                        />
                        <SortableHeader
                          label="Department"
                          sortKey="department"
                          sortConfig={sortConfig1}
                          onSort={requestSort1}
                          className="px-1 py-5 border-b border-gray-300 text-gray-500"
                        />
                        <SortableHeader
                          label="Jobtitle"
                          sortKey="department.jobtitle.length"
                          sortConfig={sortConfig1}
                          onSort={requestSort1}
                          className="px-1 py-5 border-b border-gray-300 text-gray-500"
                        />
                        <SortableHeader
                          label="Amount"
                          sortKey="amount"
                          sortConfig={sortConfig1}
                          onSort={requestSort1}
                          className="px-1 py-5 border-b border-gray-300 text-gray-500"
                        />
                        <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                          Unit
                        </th>
                        <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedItems1.map((item, index) => (
                        <tr
                          key={item._id}
                          className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px] font-bold"
                        >
                          <td className="px-1 py-6 border-b border-gray-200 text-left w-[10%]">
                            {index + 1}
                          </td>
                          <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[20%]">
                            {item.name}
                          </td>
                          <td className="px-5 py-6 border-b border-gray-200 w-[25%] text-left">
                            {item.department.name}
                          </td>
                          <td className="px-5 py-6 border-b border-gray-200 w-[15%] text-left">
                            {item.department.jobtitle.length}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 w-[15%] text-left">
                            {item.amount.toLocaleString("vi-VN")}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 w-[15%] text-left">
                            VNĐ
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 relative cursor-pointer">
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
                              className="absolute bg-white right-5 z-10 mt-2 w-[200%] origin-top-right rounded-[20px] focus:outline-none font-normal"
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
                                      setMoreOptions2(null);
                                      setSelectedEmployee1(item);
                                      setModalBaseIsOpen(true);
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
                                      setMoreOptions2(null);
                                      verifyDeleteBase(item._id);
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
                          <Modal
                            isOpen={modalBaseIsOpen}
                            onRequestClose={() => setModalBaseIsOpen(false)}
                            shouldCloseOnOverlayClick={false}
                            className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                            overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
                          >
                            <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                              <div className="flex items-center mb-2">
                                <IoIosArrowRoundBack
                                  className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                                  onClick={closeModalBase}
                                />
                                <p className="text-[20px] font-bold ">
                                  Edit Base Salary
                                </p>
                              </div>
                              <div className="bg-gray-200 w-[120%] h-0.5 mt-[1%] mb-[1%] ml-[-10%]"></div>
                            </div>
                            <div>
                              <div className="flex space-x-14 mt-3">
                                <div>
                                  <p>Name</p>
                                  <input
                                    type="text"
                                    name="firstName"
                                    value={nameBase}
                                    placeholder="Input name"
                                    className="border capitalize border-gray-300 rounded-md p-3 w-full mt-2 "
                                    onChange={(e) =>
                                      setNameBase(e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <p>Amount</p>
                                  <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Input Amount"
                                    className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                                  />
                                </div>
                              </div>
                              <div className="flex space-x-14 mt-3 w-full">
                                <div className="w-[50%]">
                                  <p>Department</p>
                                  <div className="relative w-full">
                                    <div
                                      className={`inline-flex z-10 w-full border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2`}
                                      onClick={toggleDepartDropdown}
                                    >
                                      <span className="text-[15px]">
                                        {department}
                                      </span>
                                      <IoIosArrowDown />
                                    </div>
                                    {isDepartOpen && (
                                      <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200">
                                        <ul className="py-1">
                                          {departData.map((option, index) => (
                                            <li
                                              key={index}
                                              onClick={() => {
                                                handleOptionClick4(option.name);
                                                setSelectedDepartmentId(
                                                  option._id
                                                );
                                              }}
                                              className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                                            >
                                              {option.name}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="w-[50%]">
                                  <p>Job Title</p>
                                  <div className="relative w-full">
                                    <div
                                      className={`inline-flex w-full border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2`}
                                      onClick={togglePossitionDropdown}
                                    >
                                      <span className="text-[15px] truncate">
                                        {selectedJobTitles
                                          .map(
                                            (id) =>
                                              filteredJobTitles.find(
                                                (job) => job._id === id
                                              )?.name || "(Không tìm thấy)"
                                          )
                                          .join(", ")}
                                      </span>
                                      <IoIosArrowDown />
                                    </div>
                                    {isPositionOpen && (
                                      <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-[200px] overflow-y-auto">
                                        <ul className="py-1">
                                          {filteredJobTitles.map(
                                            (option, index) => {
                                              const isSelected =
                                                selectedJobTitles.includes(
                                                  option._id
                                                );
                                              return (
                                                <li
                                                  key={index}
                                                  onClick={() => {
                                                    if (isSelected) {
                                                      setSelectedJobTitles(
                                                        (prev) =>
                                                          prev.filter(
                                                            (id) =>
                                                              id !== option._id
                                                          )
                                                      );
                                                    } else {
                                                      setSelectedJobTitles(
                                                        (prev) => [
                                                          ...prev,
                                                          option._id,
                                                        ]
                                                      );
                                                    }
                                                  }}
                                                  className={`px-4 py-2 text-[15px] cursor-pointer ${
                                                    isSelected
                                                      ? "bg-[#2EB67D] text-white"
                                                      : "text-gray-700 hover:bg-gray-100"
                                                  }`}
                                                >
                                                  {option.name}
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col mt-5 mb-5">
                                <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                                <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                                  <button
                                    onClick={closeModalBase}
                                    className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateBaseSalary(
                                        selectedEmployee1._id
                                      )
                                    }
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
                    <p className="font-bold">Empty Base Salary</p>
                    <p>Add your first Base Salary manually</p>
                  </div>
                </div>
              )}
              {/* infor bottom */}
              <PaginationFooter
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={baseSalary.length}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Payroll;
