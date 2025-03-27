import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

// icon
import { PiClock } from "react-icons/pi";
import { IoBulbOutline } from "react-icons/io5";
import { MdWifiTetheringOff } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import { IoIosArrowForward } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";

const Attendance = () => {
  // Get date
  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [data, setData] = useState([]);

  // Get all users
  useEffect(() => {
    axios
      .get(apiRoutes.attendance.getAll)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, [data]);

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

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
    setData([]);
  }, [currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, data.length);

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
            <p className="font-bold text-[30px]">1,300</p>
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
            <p className="font-bold text-[30px]">1,300</p>
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
            <p className="font-bold text-[30px]">1,300</p>
            <div className="flex">
              <FaArrowTrendUp className="text-[#FF0404] mr-1 mt-1" />
              <p className="text-[#FF0404] mr-1">16%</p>
              <p className="font-bold">this month</p>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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
          <div className="flex items-center justify-center h-[50px] px-4 text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
            <VscSettings className="w-[25px] h-[25px]" />
            <p className="ml-2 caret-transparent">View Attendance</p>
          </div>
        </div>
        {/* list */}
        {data.length > 0 ? (
          <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
            <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] no-scrollbar">
              <thead>
                <tr className="border-gray-300 border-t border-b-2 text-left">
                  <th className="px-1 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    ID
                  </th>
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Employee
                  </th>
                  <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Department
                  </th>
                  <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Date
                  </th>
                  <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Status
                  </th>
                  <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Check-in
                  </th>
                  <th className="px-0 py-5 border-b border-gray-300 caret-transparent"></th>
                  <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Check-out
                  </th>
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Overtime
                  </th>
                  <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Work hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                  >
                    <td className="px-1 py-6 border-b border-gray-200">
                      <div className="truncate text-left w-[60px]">
                        {item.employeeID}
                      </div>
                    </td>
                    <td className="px-5 py-6 border-b border-gray-200">
                      <div className="truncate text-left w-[130px] ">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%]">
                      <div className="truncate text-left w-[130px] ">
                        IT Department
                      </div>
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
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
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
  );
};

export default Attendance;
