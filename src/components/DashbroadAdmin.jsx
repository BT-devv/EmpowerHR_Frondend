import AttendanceOverview from "./AttendanceOverview";
import EmployeeChart from "./EmployeeChart";
import { useNavigate } from "react-router-dom";
import apiRoutes from "../../apiRoutes";
import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import axios from "axios";
import alert from "./Alert";

// icon
import { BsPatchCheck } from "react-icons/bs";
import { GoCodeSquare } from "react-icons/go";
import { AiOutlineDollar } from "react-icons/ai";
import { HiOutlineTicket } from "react-icons/hi2";
const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [job, setJob] = useState([]);
  const [depart, setDepart] = useState([]);
  const [user, setUser] = useState([]);
  const [totalWFOLate, setTotalWFOLate] = useState("");

  const colors = ["#4880FF", "#FFC179", "#FF0000"];

  const bgColors = [
    "bg-[#E6EFFC] text-[#0764E6]",
    "bg-[#FFE5EE] text-[#AA0000]",
    "bg-[#FFF8E7] text-[#D5B500]",
    "bg-[#EFEFEF] text-[#8A8A8A]",
    "bg-[#E0F7FA] text-[#006064]",
    "bg-[#E8F5E9] text-[#2E7D32]",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomColorBg = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };

  // Get all holiday
  useEffect(() => {
    axios
      .get(apiRoutes.holiday.getAllHolidays)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem holiday.");
        }
      });
  }, []);

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
        setUser(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  // Get data dropdown
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [departments, positions] = await Promise.all([
          axios.get(apiRoutes.department.getAllDepartment),
          axios.get(apiRoutes.jobtitle.getAllJobtitle),
        ]);

        setDepart(departments.data);
        setJob(positions.data);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Get all attendance
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
        const today = new Date().toISOString().split("T")[0];
        const attendanceData = response.data.data;
        const todayWFOLate = attendanceData.filter(
          (item) =>
            (item.status === "Work from office" || item.status === "late") &&
            item.date?.startsWith(today)
        ).length;
        setTotalWFOLate(todayWFOLate);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem attendance.");
        }
      });
  }, []);

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative mb-5 font-light">
      <div className="flex flex-col lg:flex-row mx-8 mt-6 gap-2">
        {/* Left side */}
        <div className="flex-1">
          <div className="grid grid-cols sm:grid-cols-2 gap-6">
            {/* Attendance */}
            <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-md w-[75%]">
              <BsPatchCheck className="w-10 h-10 text-[#2EB67D] mb-4" />
              <p className="text-gray-500">Attendance</p>
              <p className="text-3xl font-bold mt-1">{`${
                totalWFOLate === "" ? "0" : totalWFOLate
              } / ${user.length}`}</p>
              <p
                className="text-sm text-gray-500 mt-2 cursor-pointer"
                onClick={() => navigate("/attendance")}
              >
                View details
              </p>
            </div>

            {/* Projects */}
            <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-md w-[75%] ml-[-20%]">
              <GoCodeSquare className="w-10 h-10 text-[#FFC179] mb-4" />
              <p className="text-gray-500">Projects</p>
              <p className="text-3xl font-bold mt-1">27</p>
              <p
                className="text-sm text-gray-500 mt-2 cursor-pointer"
                onClick={alert}
              >
                View details
              </p>
            </div>

            {/* Profits */}
            <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-md w-[75%]">
              <AiOutlineDollar className="w-10 h-10 text-[#FF0000] mb-4" />
              <p className="text-gray-500">Profits this month</p>
              <p className="text-3xl font-bold mt-1">$7200</p>
              <p
                className="text-sm text-gray-500 mt-2 cursor-pointer"
                onClick={alert}
              >
                View details
              </p>
            </div>

            {/* Budgets */}
            <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-md w-[75%] ml-[-20%]">
              <HiOutlineTicket className="w-10 h-10 text-[#4880FF] mb-4" />
              <p className="text-gray-500">Budgets</p>
              <p className="text-3xl font-bold mt-1">$3700</p>
              <p
                onClick={alert}
                className="text-sm text-gray-500 mt-2 cursor-pointer"
              >
                View details
              </p>
            </div>

            {/* Events */}
            <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-md col-span-2 min-h-[470px] w-[79%] mb-6">
              <h2 className="text-2xl font-semibold mb-2">Upcoming events</h2>

              {/* Divider */}
              <div className="bg-black opacity-60 w-full h-0.5 mt-2 mb-2" />
              {/* Holidays Section */}
              <div className="w-full">
                <ul>
                  {data.length > 0 ? (
                    data.map((holiday, index) => {
                      const today = new Date();
                      const endDate = new Date(holiday.endDate);
                      const daysLeft = differenceInDays(endDate, today);
                      const randomColor = getRandomColor();

                      let daysLeftText = "";
                      if (daysLeft === 0) {
                        daysLeftText = "Today";
                      } else if (daysLeft < 0) {
                        daysLeftText = "Expired";
                      } else {
                        daysLeftText = `${daysLeft} day${
                          daysLeft !== 1 ? "s" : ""
                        } left`;
                      }

                      return (
                        <li key={index} className="w-full">
                          <div className="flex justify-between w-full">
                            <p className="text-[18px] font-semibold mt-2">
                              {holiday.name}
                            </p>
                            <p
                              className="text-[30px] font-semibold text-[#4880FF]"
                              style={{ color: randomColor }}
                            >
                              {format(
                                new Date(holiday.startDate),
                                "EEE, dd/MM"
                              )}
                            </p>
                          </div>

                          <div className="flex justify-between w-full items-center">
                            <p className="text-sm text-gray-600"></p>
                            <div className="text-right">
                              <p className="text-base ">{daysLeftText}</p>
                            </div>
                          </div>

                          <div className="bg-gray-200 w-full h-0.5 mt-2" />
                        </li>
                      );
                    })
                  ) : (
                    <p>No upcoming holidays.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col gap-6 ml-[-8%] font-light">
          {/* Attendance Card */}
          <div className="flex flex-col items-start bg-white p-5 rounded-lg shadow-md h-auto">
            <p className="font-semibold text-[16px]">Attendance Overview</p>
            <AttendanceOverview />
          </div>

          {/* Attendance Card */}
          <div className="flex flex-col items-start bg-white p-6 rounded-lg shadow-md min-h-[250px]">
            <p className="font-semibold text-[16px]">Employees by Department</p>
            <EmployeeChart />
          </div>

          <div className="flex-1 bg-white p-6 rounded-lg shadow-md mb-6">
            {/* Employees */}
            <div className="flex flex-col items-start mb-6 w-full">
              <p className="font-semibold text-2xl">Employees Overview</p>

              {/* List */}
              {user.length > 0 ? (
                <div className="mt-[20px] text-[14px] h-[290px] overflow-y-auto scroll-hidden">
                  <table className=" bg-white table-fixed w-full">
                    <thead>
                      <tr className="border-gray-300 border-t border-b-2 text-left">
                        <th className="px-1 py-3 border-b border-gray-300 caret-transparent text-gray-500">
                          Name
                        </th>
                        <th className="px-5 py-3 border-b border-gray-300 caret-transparent text-gray-500">
                          Department
                        </th>
                        <th className="px-5 py-3 border-b border-gray-300 caret-transparent text-gray-500">
                          Employee Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="h-[200px]">
                      {user.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                        >
                          <td className="px-1 py-5 border-b border-gray-200 text-left">
                            <div className="flex">
                              <img
                                alt="avatar"
                                src={apiRoutes.file.avatar(item.avatar)}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "src/assets/avatar.png";
                                }}
                                className="w-[40px] mr-[10px] rounded-full object-cover"
                              />
                              <div className="ml-3">
                                <p className="font-bold text-[13px]">{`${item.firstName} ${item.lastName}`}</p>
                                <p className="text-[13px] mt-1 font-light">
                                  {
                                    job.find((r) => r._id === item.jobtitle)
                                      ?.name
                                  }
                                </p>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`px-5 py-5 border-b border-gray-200 truncate text-left text-[13px] font-light`}
                          >
                            <div
                              className={`text-center p-3 rounded-[6px] w-fit h-[40px] flex items-center justify-center ${getRandomColorBg()}`}
                            >
                              {
                                depart.find((r) => r._id === item.department)
                                  ?.name
                              }
                            </div>
                          </td>
                          <td
                            className={`px-5 py-5 border-b border-gray-200 truncate text-left text-[13px] font-light`}
                          >
                            <div
                              className={`text-center p-3 rounded-[6px] w-fit h-[40px] flex items-center justify-center ${getRandomColorBg()}`}
                            >
                              {item.employeeType}
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
                  <button className="text-white font-normal mt-[10%] h-[50px] w-[180px] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
                    + Employee
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardAdmin;
