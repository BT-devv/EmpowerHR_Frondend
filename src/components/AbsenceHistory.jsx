import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import PaginationFooter from "./PaginationFooter";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import { jwtDecode } from "jwt-decode";
import SortableHeader from "../components/SortableHeader";

// icon
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
const AbsenceHistory = () => {
  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [dataHistory, setDataHistory] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    date: "",
    status: "",
  });

  const clearFilters = () => {
    setFilters({
      name: "",
      date: "",
      status: "",
    });
  };

  const isFiltering = filters.name || filters.date || filters.status;

  const filteredData = isFiltering
    ? dataHistory.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const itemDate = new Date(item.date);
        const status = item.status || "";
        const nameMatch =
          !filters.name || name.includes(filters.name.toLowerCase());
        const statusMatch = filters.status ? status === filters.status : true;
        const filterDate = filters.date ? new Date(filters.date) : null;
        const dateMatch =
          !filterDate || itemDate.toDateString() === filterDate.toDateString();

        return nameMatch && dateMatch && statusMatch;
      })
    : dataHistory;

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsHistory = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    const sorted = [...currentItemsHistory];
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
  }, [currentItemsHistory, sortConfig]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // Get all history
  useEffect(() => {
    const fetchPendingAndHistory = async () => {
      try {
        const [pendingRes, historyRes] = await Promise.all([
          axios.get(apiRoutes.absence.listPending, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get(apiRoutes.absence.history, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        const pendingRequests = pendingRes.data.absences.filter(
          (req) => req.employeeID === decodedToken.employeeID
        );

        const historyRequests = historyRes.data.absences.filter(
          (req) => req.employeeID === decodedToken.employeeID
        );
        const combined = [...pendingRequests, ...historyRequests];
        setDataHistory(combined);
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    };

    fetchPendingAndHistory();
  }, []);

  return (
    <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] mb-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
        {/* History Title */}
        <div>
          <p className="text-[#252C58] text-[20px] font-light">History</p>
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
        <div className="relative flex items-center min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
          <CiCalendarDate className="absolute left-4 w-[20px] h-[20px]" />
          <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
            {currentDate}
          </div>
        </div>

        {/* Filter Button */}
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
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="mb-3 w-full border px-3 py-2 rounded h-[50px]"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Approved">Approved</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="flex-1 border px-2 py-1 w-full rounded h-[50px]"
        />

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
      {/* List */}
      {dataHistory.length > 0 ? (
        <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
          <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
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
                  label="Date"
                  sortKey="createdAt"
                  sortConfig={sortConfig}
                  onSort={requestSort}
                  className="px-5 py-5 border-b border-gray-300 text-gray-500"
                />
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Status
                </th>
                <th className="px-14 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Absence
                </th>
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                >
                  <td className="px-1 py-6 border-b border-gray-200 text-left w-[12%]">
                    {item.employeeID}
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[25%]">
                    {item.name}
                  </td>

                  <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[20%]">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200 w-[15%]">
                    <div
                      className={`text-center p-4 border rounded-md w-fit h-[40px] flex items-center justify-center ${
                        item.status === "Pending"
                          ? "text-[#0764E6] bg-[#E6EFFC]"
                          : ""
                      } ${
                        item.status === "Rejected"
                          ? "text-[#AA0000] bg-[#FFE5EE]"
                          : ""
                      } ${
                        item.status === "Approved"
                          ? "text-[#D5B500] bg-[#FFF8E7]"
                          : ""
                      }`}
                    >
                      {item.status}
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200 text-center w-[15%]">
                    {item.type}
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200 w-[-15%]">
                    <div className="flex items-center space-x-3 text-left w-[130px] ">
                      <div
                        className="bg-[#D8DDE3] w-[30%] rounded-[6px] p-2 cursor-pointer ml-[10%]"
                        onClick={() => (
                          setSelectedEmployee(item), setIsDetailModalOpen(true)
                        )}
                      >
                        <IoEyeOutline className="w-[20px] h-[20px] text-[#727C9A]" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              className={`bg-white rounded-tl-[20px] border-l-2 border-t-2 border-gray-200 w-[30%] h-[92%] mt-[4%] flex flex-col ${
                isAnimating
                  ? "animate-slideOutToRight"
                  : "animate-slideInFromRight"
              }`}
              overlayClassName="fixed inset-0 bg-opacity-50 flex justify-end items-center"
            >
              <div className="flex p-3 ml-[2%]">
                <div className="flex justify-between">
                  <IoIosArrowRoundBack
                    className="w-[40px] h-[40px] cursor-pointer mt-[2%]"
                    onClick={() => {
                      setIsAnimating(true);
                      setTimeout(() => {
                        setIsAnimating(false);
                        setIsDetailModalOpen(false);
                      }, 500);
                    }}
                  />
                </div>
                <p className="mt-[2%] ml-[2%] font-bold">Detail Request</p>
              </div>

              <div className="bg-gray-100 w-[100%] h-0.5 mt-[1%] mb-[1%] "></div>

              <div className="text-[14px] flex-grow ml-[10%] caret-transparent">
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">ID Employee:</p>
                  <p className="w-2/3">{selectedEmployee.employeeID}</p>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Employee:</p>
                  <p className="w-2/3">{selectedEmployee.name}</p>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Line Manager:</p>
                  <p className="w-2/3">
                    {selectedEmployee.lineManagers || "---"}
                  </p>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Date:</p>
                  <p className="w-2/3">
                    {formatDate(selectedEmployee.createdAt)}
                  </p>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Time:</p>
                  <p className="w-2/3">
                    {formatDate(selectedEmployee.dateFrom)}{" "}
                    <span className="ml-[5%] mr-[5%]">-</span>
                    {formatDate(selectedEmployee.dateTo)}
                  </p>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Reason:</p>
                  <div
                    className="w-2/3 prose"
                    dangerouslySetInnerHTML={{
                      __html: selectedEmployee.reason,
                    }}
                  ></div>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Status:</p>
                  <p
                    className={`w-2/3 ${
                      selectedEmployee.status === "Pending"
                        ? "text-[#0764E6]"
                        : ""
                    } ${
                      selectedEmployee.status === "Rejected"
                        ? "text-[#AA0000]"
                        : ""
                    } ${
                      selectedEmployee.status === "Approved"
                        ? "text-[#D5B500]"
                        : ""
                    }`}
                  >
                    {selectedEmployee.status}
                  </p>
                </div>
                {selectedEmployee.status === "Rejected" ? (
                  <div className="flex flex-col mt-[8%] h-full">
                    <p className="font-bold w-1/3">Reason of Rejcted:</p>
                    <p className="bg-gray-200 rounded-[10px] h-[20%] p-3 w-[90%] mt-[2%] ">
                      {selectedEmployee.rejectReason}
                    </p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </Modal>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-gray-500 text-lg flex-grow mx-auto">
          <img
            alt="logo"
            src="src/assets/Image.png"
            className="w-[380px] h-[280px]"
          />
          <div className="mt-[10%] text-center">
            <p className="font-bold">No History Found</p>
            <p>{`You haven't submitted any absence requests yet.`}</p>
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
  );
};
export default AbsenceHistory;
