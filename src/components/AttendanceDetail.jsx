import axios from "axios";
import apiRoutes from "../../apiRoutes";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PaginationFooter from "./PaginationFooter";

// icon
import { MdOutlineWorkHistory } from "react-icons/md";
import { MdOutlineWorkOff } from "react-icons/md";
import { MdOutlineWorkOutline } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";

const AttendanceDetail = ({ employeeID }) => {
  const [data, setData] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const getStartAndEndOfCurrentMonth = () => {
    const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");

    return { startDate, endDate };
  };

  const fetchEmployeeSummary = async () => {
    if (!employeeID) return;
    const token = localStorage.getItem("token");

    const { startDate, endDate } = getStartAndEndOfCurrentMonth();

    try {
      const response = await axios.get(
        apiRoutes.attendance.getEmployeeSummary,
        {
          params: {
            employeeID,
            startDate,
            endDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Lỗi lấy thống kê chấm công:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeSummary();
  }, []);

  // Get all attendance
  useEffect(() => {
    if (!employeeID) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${apiRoutes.attendance.getAttendance}?employeeID=${employeeID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const allData = response.data.data;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const currentMonthData = allData.filter((a) => {
          const recordDate = new Date(a.date);
          return (
            recordDate.getMonth() === currentMonth &&
            recordDate.getFullYear() === currentYear
          );
        });

        setAttendance(currentMonthData);
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
      case "pending":
        return "Pending";
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendance.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
      <p className="text-[20px] font-bold p-5">Attendance Detail</p>
      <div className="w-[95%] bg-white border border-gray-200 rounded-[8px] shadow p-6 ml-[2.5%]">
        <div className="flex justify-between items-center">
          {/* PRESENT */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative w-[70px] h-[70px] flex items-center justify-center mb-3">
              <div className="bg-green-100 w-full h-full rounded-full absolute"></div>
              <MdOutlineWorkOutline className="text-green-500 w-8 h-8 relative z-10" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Present</p>
            <p className="text-2xl font-semibold text-green-600">
              {data.present}
            </p>
          </div>

          {/* Divider */}
          <div className="bg-gray-200 w-[1px] h-[100px] mx-4" />

          {/* LATE */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative w-[70px] h-[70px] flex items-center justify-center mb-3">
              <div className="bg-yellow-100 w-full h-full rounded-full absolute"></div>
              <MdOutlineWorkHistory className="text-yellow-500 w-8 h-8 relative z-10" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Late</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {data.late}
            </p>
          </div>

          {/* Divider */}
          <div className="bg-gray-200 w-[1px] h-[100px] mx-4" />

          {/* ABSENT */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative w-[70px] h-[70px] flex items-center justify-center mb-3">
              <div className="bg-red-100 w-full h-full rounded-full absolute"></div>
              <MdOutlineWorkOff className="text-red-500 w-8 h-8 relative z-10" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Absent</p>
            <p className="text-2xl font-semibold text-red-500">{data.absent}</p>
          </div>

          {/* Divider */}
          <div className="bg-gray-200 w-[1px] h-[100px] mx-4" />

          {/* WORKING HOURS */}
          <div className="flex flex-col items-center flex-1">
            <div className="relative w-[70px] h-[70px] flex items-center justify-center mb-3">
              <div className="bg-blue-100 w-full h-full rounded-full absolute"></div>
              <IoIosTimer className="text-blue-500 w-8 h-8 relative z-10" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Working Hours</p>
            <p className="text-2xl font-semibold text-blue-600">
              {data.totalWorkingHours}
            </p>
          </div>
        </div>
      </div>
      {attendance.length > 0 ? (
        <div className="mt-[3%] text-[14px] ml-[50px]">
          <table className=" bg-white table-fixed w-[calc(100vw-450px)]">
            <thead>
              <tr className="border-gray-300 border-t border-b-2 text-left">
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  No
                </th>
                <th className="px-1 py-3 border-b border-gray-300 caret-transparent text-gray-500">
                  Date
                </th>
                <th className="px-2 py-3 border-b border-gray-300 caret-transparent text-gray-500">
                  Check-In
                </th>
                <th className="px-2 py-3 border-b border-gray-300 caret-transparent text-gray-500">
                  Check-Out
                </th>
                <th className="px-2 py-3 border-b border-gray-300 caret-transparent text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                >
                  <td
                    className={`px-2 py-5 border-b border-gray-200 truncate text-left font-light`}
                  >
                    {index + 1}
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200 text-[#252C58] opacity-[50%]">
                    <div className="truncate text-left w-[100px] ">
                      {formatDate(item.date)}
                    </div>
                  </td>
                  <td
                    className={`px-2 py-5 border-b border-gray-200 truncate text-left font-light`}
                  >
                    {item.checkIn ? item.checkIn.slice(0, 5) : "00:00"}
                  </td>
                  <td
                    className={`px-2 py-5 border-b border-gray-200 truncate text-left font-light`}
                  >
                    {item.checkOut ? item.checkOut.slice(0, 5) : "00:00"}
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
                      } ${
                        item.status === "pending"
                          ? "text-[#2EB67D] bg-[#e1f1e7]"
                          : ""
                      }`}
                    >
                      {getStatusDisplay(item.status)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col justify-center mt-[3%] items-center text-gray-500 text-lg flex-grow mx-auto">
          <img
            alt="logo"
            src="src/assets/Image.png"
            className="w-[380px] h-[280px]"
          />
          <div className="mt-[3%] text-center">
            <p className="font-bold">Empty Attendance</p>
            <p>No attendance data available for this employee.</p>
          </div>
        </div>
      )}
      {/* infor bottom */}
      <PaginationFooter
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={attendance.length}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};
export default AttendanceDetail;
