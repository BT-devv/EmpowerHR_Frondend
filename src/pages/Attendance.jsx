import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiRoutes from "../../apiRoutes";
import PaginationFooter from "../components/PaginationFooter";
import UsePermission from "../components/UsePermission";
import SortableHeader from "../components/SortableHeader";
import Modal from "react-modal";

// icon
import { PiClock } from "react-icons/pi";
import { IoBulbOutline } from "react-icons/io5";
import { MdWifiTetheringOff } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import { IoIosArrowRoundBack } from "react-icons/io";

Modal.setAppElement("#root");

const Attendance = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("attendance.read");
  // Get date
  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [data, setData] = useState([]);
  const [depart, setDepart] = useState([]);

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    department: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  const clearFilters = () => {
    setFilters({
      name: "",
      department: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
  };

  // Get all users
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(apiRoutes.attendance.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  // Get all department
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiRoutes.department.getAllDepartment, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDepart(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "absent":
        return "Absent";
      case "Work from office":
        return "Work from office";
      case "Work from home":
        return "Work from home";
      case "late":
        return "Late arrival";
      default:
        return status;
    }
  };

  const isFiltering =
    filters.name ||
    filters.department ||
    filters.status ||
    filters.fromDate ||
    filters.toDate;

  const filteredData = isFiltering
    ? data.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const department = item.department?.toLowerCase() || "";
        const status = item.status || "";
        const nameMatch = name.includes(filters.name.toLowerCase());
        const departmentMatch = department.includes(
          filters.department.toLowerCase()
        );
        const statusMatch = filters.status ? status === filters.status : true;

        const itemDate = new Date(item.date);
        const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
        const toDate = filters.toDate ? new Date(filters.toDate) : null;
        const dateMatch =
          (!fromDate || itemDate >= fromDate) &&
          (!toDate || itemDate <= toDate);

        return nameMatch && departmentMatch && statusMatch && dateMatch;
      })
    : data;

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    const sorted = [...currentItems];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || "";
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }
    return sorted;
  }, [currentItems, sortConfig]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const onTime = data.filter(
    (a) =>
      a.status === "Work from office" && new Date(a.checkInTime).getHours() < 9
  ).length;
  const late = data.filter((a) => a.status === "late").length;
  const overtime = data.filter(
    (a) => a.overtime === true || a.workDuration > 8
  ).length;

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative ">
      <div className="flex space-x-12 mt-[2%] justify-center">
        {/* on time */}
        <div className="bg-[#FFFFFF] w-[360px] h-[150px] rounded-[40px] relative flex items-center shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div>
            <div className="bg-[#FF527D] w-[100px] h-[100px] rounded-full opacity-[22%] absolute left-4 top-[50%] transform -translate-y-1/2"></div>
            <PiClock className="absolute text-[#4B5675] w-[44px] h-[44px] top-[50%] left-[19%] transform -translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="text-left ml-[40%]">
            <p className="text-[#C0BEBE]">On Time</p>
            <p className="font-bold text-[30px]">{onTime}</p>
            <div className="flex">
              <FaArrowTrendUp className="text-[#FF0404] mr-1 mt-1" />
              <p className="text-[#FF0404] mr-1">16%</p>
              <p className="font-bold">this month</p>
            </div>
          </div>
        </div>
        {/* late */}
        <div className="bg-[#FFFFFF] w-[360px] h-[150px] rounded-[40px] relative flex items-center shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div>
            <div className="bg-[#FF527D] w-[100px] h-[100px] rounded-full opacity-[22%] absolute left-4 top-[50%] transform -translate-y-1/2"></div>
            <MdWifiTetheringOff className="absolute text-[#4B5675] w-[44px] h-[44px] top-[50%] left-[19%] transform -translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="text-left ml-[40%]">
            <p className="text-[#C0BEBE]">Late</p>
            <p className="font-bold text-[30px]">{late}</p>
            <div className="flex">
              <FaArrowTrendUp className="text-[#FF0404] mr-1 mt-1" />
              <p className="text-[#FF0404] mr-1">16%</p>
              <p className="font-bold">this month</p>
            </div>
          </div>
        </div>
        {/* overtime */}
        <div className="bg-[#FFFFFF] w-[360px] h-[150px] rounded-[40px] relative flex items-center shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div>
            <div className="bg-[#FF527D] w-[100px] h-[100px] rounded-full opacity-[22%] absolute left-4 top-[50%] transform -translate-y-1/2"></div>
            <IoBulbOutline className="absolute text-[#4B5675] w-[44px] h-[44px] top-[50%] left-[19%] transform -translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="text-left ml-[40%]">
            <p className="text-[#C0BEBE]">Overtime</p>
            <p className="font-bold text-[30px]">{overtime}</p>
            <div className="flex">
              <FaArrowTrendUp className="text-[#FF0404] mr-1 mt-1" />
              <p className="text-[#FF0404] mr-1">16%</p>
              <p className="font-bold">this month</p>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] mb-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
        <div className="flex w-full flex-wrap items-center gap-4 px-4 py-6">
          {/* Total Employee */}
          <div>
            <p className="text-[#252C58] text-[20px] font-light">
              Total Employee
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

          {/* Calendar */}
          <div className="relative flex items-center caret-transparent cursor-default min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
            <CiCalendarDate className="absolute left-4 w-[20px] h-[20px]" />
            <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
              {currentDate}
            </div>
          </div>

          {/* Button View */}
          <div
            onClick={() => setShowFilterModal(true)}
            className="flex items-center justify-center h-[50px] px-4 text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px] cursor-pointer"
          >
            <VscSettings className="w-[25px] h-[25px]" />
            <p className="ml-2 caret-transparent">Filter</p>
          </div>
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
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="mt-5 mb-3 w-full border px-3 py-2 rounded h-[50px]"
          />

          <select
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            className="w-full border px-3 py-2 rounded-md h-[50px] mb-3"
          >
            <option value="">All Department</option>
            {depart.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="mb-3 w-full border px-3 py-2 rounded h-[50px]"
          >
            <option value="">All Status</option>
            <option value="Work from office">Work from office</option>
            <option value="Work from home">Work from home</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>

          <div className="flex gap-2 mb-3">
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
              className="flex-1 border px-2 py-1 rounded h-[50px]"
            />
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
              className="flex-1 border px-2 py-1 rounded h-[50px]"
            />
          </div>
          <div className="flex justify-end">
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

        {/* list */}
        {data.length > 0 ? (
          <div className="mt-[20px] text-[14px] ml-[15px]">
            <table className="border-collapse bg-white w-[calc(100vw-400px)]">
              <thead>
                <tr className="border-gray-300 border-t border-b-2 text-left">
                  <SortableHeader
                    label="ID"
                    sortKey="employeeID"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-1 py-5 border-b border-gray-300 text-gray-500"
                  />
                  <SortableHeader
                    label="Employee"
                    sortKey="firstName"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-5 py-5 border-b border-gray-300 text-gray-500"
                  />
                  <SortableHeader
                    label="Department"
                    sortKey="department"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-1 py-5 border-b border-gray-300 text-gray-500"
                  />
                  <SortableHeader
                    label="Date"
                    sortKey="date"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-5 py-5 border-b border-gray-300 text-gray-500"
                  />
                  <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Status
                  </th>
                  <SortableHeader
                    label="Check-in"
                    sortKey="checkIn"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-5 py-5 border-b border-gray-300 text-gray-500"
                  />
                  <th className="px-0 py-5 border-b border-gray-300 caret-transparent"></th>
                  <SortableHeader
                    label="Check-out"
                    sortKey="checkOut"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-5 py-5 border-b border-gray-300 text-gray-500"
                  />
                  <SortableHeader
                    label="Overtime"
                    sortKey="overtimeHours"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-5 py-5 border-b border-gray-300 text-gray-500"
                  />
                  <SortableHeader
                    label="Work hours"
                    sortKey="workingHours"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    className="px-5 py-5 border-b border-gray-300 text-gray-500"
                  />
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                  >
                    <td className="px-1 py-6 border-b border-gray-200 truncate text-left">
                      {item.employeeID}
                    </td>
                    <td className="px-5 py-6 border-b border-gray-200">
                      <div className="truncate text-left w-[130px] ">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%]">
                      {item.department}
                    </td>
                    <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%]">
                      <div className="truncate text-left w-[100px] ">
                        {formatDate(item.date)}
                      </div>
                    </td>
                    <td className="px-3 py-6 border-b border-gray-200">
                      <div
                        className={`text-center p-3 rounded-[6px] font-light w-fit h-[40px] flex items-center justify-center ${
                          item.status === "Work from office"
                            ? "text-[#0764E6] bg-[#E6EFFC]"
                            : ""
                        } ${
                          item.status === "absent"
                            ? "text-[#AA0000] bg-[#FFE5EE]"
                            : ""
                        } ${
                          item.status === "late"
                            ? "text-[#D5B500] bg-[#FFF8E7]"
                            : ""
                        } ${
                          item.status === "Work from home"
                            ? "text-[#8A8A8A] bg-[#EFEFEF]"
                            : ""
                        }`}
                      >
                        {getStatusDisplay(item.status)}
                      </div>
                    </td>
                    <td className="px-3 py-6 border-b border-gray-200">
                      <div
                        className={`text-center w-[70px] ${
                          item.status === "Work from office"
                            ? "text-[#0764E6] "
                            : ""
                        } ${
                          item.status === "absent" ? "text-[#AA0000] " : ""
                        } ${item.status === "late" ? "text-[#D5B500] " : ""} ${
                          item.status === "Work from home"
                            ? "text-[#8A8A8A] "
                            : ""
                        }`}
                      >
                        {item.checkIn ? item.checkIn.slice(0, 5) : "00:00"}
                      </div>
                    </td>
                    <td className="px-0 py-6 border-b border-gray-200 text-gray-400 text-center">
                      ----
                    </td>
                    <td className="px-4 py-6 border-b border-gray-200">
                      <div
                        className={`text-center w-[70px] ${
                          item.status === "Work from office"
                            ? "text-[#0764E6] "
                            : ""
                        } ${
                          item.status === "absent" ? "text-[#AA0000] " : ""
                        } ${item.status === "late" ? "text-[#D5B500] " : ""} ${
                          item.status === "Work from home"
                            ? "text-[#8A8A8A] "
                            : ""
                        }`}
                      >
                        {item.checkOut ? item.checkOut.slice(0, 5) : "00:00"}
                      </div>
                    </td>
                    <td className="px-5 py-6 border-b border-gray-200">
                      <div
                        className={`text-center w-[70px] ${
                          item.status === "absent" ? "text-[#AA0000] " : ""
                        } `}
                      >
                        {item.overtimeHours ? item.overtimeHours : "0m"}
                      </div>
                    </td>
                    <td className="px-3 py-6 border-b border-gray-200">
                      <div
                        className={`text-center w-[70px] ${
                          item.status === "absent" ? "text-[#AA0000] " : ""
                        } `}
                      >
                        {item.workingHours ? item.workingHours : "0m"}
                      </div>
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
              <p className="font-bold">Empty Attendance</p>
              <p>Add your first Attendance manually</p>
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
    </div>
  );
};

export default Attendance;
