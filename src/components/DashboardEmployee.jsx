import { useEffect, useState } from "react";
import { format, addDays, startOfWeek, eachDayOfInterval } from "date-fns";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import { jwtDecode } from "jwt-decode";
import alert from "./Alert";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// icon
import { IoIosArrowRoundForward } from "react-icons/io";
import { PiCalendarDotDuotone } from "react-icons/pi";
import { PiNumberEight } from "react-icons/pi";

const tasks = [
  {
    id: 1,
    title: "Prepare company welcome kit",
    status: "Overdue",
    time: "23:59 - 23 Oct 2023",
    isComplete: false,
  },
  {
    id: 2,
    title: "Collect Documents - Hard Copies",
    status: "Upcoming",
    time: "23:59 - 31 Oct 2023",
    isComplete: false,
  },
];

const DashboardEmployee = () => {
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const [todoList, setTodoList] = useState(tasks);
  const [eventsByDay, setEventsByDay] = useState({});
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [dataPendingA, setDataPendingA] = useState([]);
  const [dataPendingO, setDataPendingO] = useState([]);

  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Get all attendance
  useEffect(() => {
    axios
      .get(apiRoutes.attendance.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const allData = response.data.data;
        const today = dayjs().format("YYYY-MM-DD");
        const absentToday = allData.filter(
          (item) =>
            dayjs(item.date).format("YYYY-MM-DD") === today &&
            item.status === "absent"
        );
        setData(absentToday);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  // Get all pending
  useEffect(() => {
    axios
      .get(apiRoutes.overtime.listPending, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const allRequests = response.data.data;
        const filtered = allRequests.filter(
          (req) => req.projectManager === decodedToken.employeeID
        );
        const sorted = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataPendingO(sorted);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

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
        const allUsers = response.data;
        const today = dayjs().format("YYYY-MM-DD");
        const joinedToday = allUsers.filter(
          (user) => dayjs(user.joiningDate).format("YYYY-MM-DD") === today
        );

        setUser(joinedToday);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  // Get all pending
  useEffect(() => {
    axios
      .get(apiRoutes.absence.listPending, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const allRequests = response.data.absences;
        const filtered = allRequests
          .map((req) => {
            const managerList =
              req.lineManagers?.[0]?.split(",").map((id) => id.trim()) || [];
            return {
              ...req,
              lineManagers: managerList,
            };
          })
          .filter((req) => req.lineManagers.includes(decodedToken.employeeID))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setDataPendingA(filtered);
        console.log(filtered);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const daysSince = (date) => {
    const createdDate = new Date(date);
    const today = new Date();
    const difference = Math.abs(today - createdDate);
    return Math.floor(difference / (1000 * 60 * 60 * 24)); // chuyển đổi từ mili giây sang ngày
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(apiRoutes.holiday.getAllHolidays);
        const events = response.data;

        let result = {};
        events.forEach((event) => {
          const days = eachDayOfInterval({
            start: new Date(event.startDate),
            end: new Date(event.endDate),
          });

          days.forEach((d) => {
            const key = format(d, "yyyy-MM-dd");
            if (!result[key]) result[key] = [];
            result[key].push({
              name: event.name,
              type: "holiday",
            });
          });
        });

        setEventsByDay(result);
      } catch (error) {
        console.error("Lỗi khi gọi API sự kiện:", error);
      }
    };

    fetchEvents();
  }, []);

  // Get all role
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiRoutes.role.getRole, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  const role = roleData.find((r) => r._id === decodedToken.role)?.name;

  const days = [...Array(7)].map((_, i) => addDays(weekStart, i));
  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative font-light">
      <div className="flex flex-col lg:flex-row mx-3 gap-2">
        {/* Left */}
        <div className="basis-2/3">
          {/* Block 1 */}
          <div className="p-4 border rounded-lg shadow-md bg-white max-w-5xl mx-auto mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <div className="flex items-center gap-2 text-sm">
                <button
                  className="p-2 border rounded"
                  onClick={() => setWeekStart((prev) => addDays(prev, -7))}
                >
                  ←
                </button>
                <span>
                  {format(weekStart, "d MMM")} -{" "}
                  {format(addDays(weekStart, 6), "d MMM yyyy")}
                </span>
                <button
                  className="p-2 border rounded"
                  onClick={() => setWeekStart((prev) => addDays(prev, 7))}
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7">
              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDay[key] || [];

                return (
                  <div key={key} className="border p-2 min-h-[150px] ">
                    <div className="text-sm font-medium mb-2 text-gray-700">
                      {format(day, "EEE d")}
                    </div>
                    {dayEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 text-sm mb-1"
                      >
                        <span className="w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center"></span>
                        <span>{event.name}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-black rounded-full mr-2"></span>{" "}
                Holiday
              </div>
            </div>
          </div>
          {/* Block 2 */}
          {role === "Project manager" && (
            <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-5xl mx-auto mt-6 h-fit">
              <div className="flex space-x-4">
                <h2 className="text-lg text-left font-semibold">
                  Pending Approval
                </h2>
                <div className="bg-[#FFD800] text-white rounded-full w-8 h-8 flex items-center justify-center">
                  <p>{dataPendingA.length + dataPendingO.length}</p>
                </div>
              </div>
              <div className="flex gap-10 w-full">
                {/* Cột 1 */}
                <div className="flex-1 flex flex-col space-y-4 mt-5 h-[200px] overflow-y-auto scroll-hidden">
                  <div className="flex justify-between font-semibold">
                    <p>Absence Request</p>
                    <p>{dataPendingA.length} pending</p>
                  </div>
                  {dataPendingA.length > 0 ? (
                    dataPendingA.map((person) => (
                      <div
                        key={person._id}
                        className="flex items-center space-x-4 w-full"
                      >
                        <img
                          alt="avatar"
                          src={apiRoutes.file.avatar(person.avatar)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "src/assets/avatar.png";
                          }}
                          className="w-[40px] mr-[10px] rounded-full object-cover"
                        />
                        <div className="flex justify-between w-full">
                          <p className="truncate w-[50%] text-left">
                            {person.name}
                          </p>
                          <p>• {daysSince(person.createdAt)} day</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500  mt-5 text-center">
                      No absent request.
                    </p>
                  )}
                </div>

                {/* Đường kẻ ngăn */}
                <div className="border-l h-auto border-gray-300"></div>

                {/* Cột 2 */}
                <div className="flex-1 flex flex-col space-y-4 mt-5 h-[200px] overflow-y-auto scroll-hidden">
                  <div className="flex justify-between font-semibold">
                    <p>Overtime Request</p>
                    <p>{dataPendingO.length} pending</p>
                  </div>
                  {dataPendingO.length > 0 ? (
                    dataPendingO.map((person) => (
                      <div
                        key={person._id}
                        className="flex items-center space-x-4 w-full"
                      >
                        <img
                          alt="avatar"
                          src={apiRoutes.file.avatar(person.avatar)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "src/assets/avatar.png";
                          }}
                          className="w-[40px] mr-[10px] rounded-full object-cover"
                        />
                        <div className="flex justify-between w-full">
                          <p className="truncate w-[50%] text-left">
                            {person.name}
                          </p>
                          <p>• {daysSince(person.createdAt)} day</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500  mt-5 text-center">
                      No absent request.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Block 3 */}
          <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-5xl mx-auto mt-6 h-fit">
            <div className="flex justify-between">
              <h2 className="text-lg text-left font-semibold">News</h2>
              <h2
                onClick={alert}
                className="text-lg text-left font-semibold cursor-pointer"
              >
                View all
              </h2>
            </div>
            <div className="border rounded-[10px] h-[20%] p-5 mt-5">
              <p className="text-left font-semibold text-[18px]">
                Use of Company Property Policy
              </p>
              <div className="flex mt-2 space-x-8">
                <PiCalendarDotDuotone size={25} />
                <p>25 Sep 2023</p>
                <div className="border-l h-5 border-gray-300"></div>
                <p>John Doe</p>
              </div>
            </div>
            <div className="border rounded-[10px] h-[20%] p-5 mt-5">
              <p className="text-left font-semibold text-[18px]">
                Use of Company Property Policy
              </p>
              <div className="flex mt-2 space-x-8">
                <PiCalendarDotDuotone size={25} />
                <p>25 Sep 2023</p>
                <div className="border-l h-5 border-gray-300"></div>
                <p>John Doe</p>
              </div>
            </div>
            <div className="border rounded-[10px] h-[20%] p-5 mt-5">
              <p className="text-left font-semibold text-[18px]">
                Use of Company Property Policy
              </p>
              <div className="flex mt-2 space-x-8">
                <PiCalendarDotDuotone size={25} />
                <p>25 Sep 2023</p>
                <div className="border-l h-5 border-gray-300"></div>
                <p>John Doe</p>
              </div>
            </div>
          </div>
          {/* Block 4 */}
          <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-5xl mx-auto mt-6 h-fit mb-6">
            <div className="flex justify-between text-lg text-left font-semibold">
              <h2>Payroll</h2>
              <h2 onClick={alert} className="cursor-pointer">
                View details
              </h2>
            </div>
            <p className="font-semibold text-[30px] text-left mt-5">
              25,567.00
            </p>
            <p className="text-left mt-2">
              Total compensation on 01 Jan 2024 - 3 Feb 2024
            </p>
          </div>
        </div>
        {/* Right */}
        <div className="basis-1/3">
          {/* Block 5 */}
          <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-5xl mx-auto mt-6 h-fit">
            <div className="flex justify-between text-lg text-left font-semibold">
              <h2>Clock In/Out</h2>
              <h2>--:-- - 27 Oct</h2>
            </div>
            <div className="flex justify-between mt-5">
              <div className="flex text-lg text-left space-x-4">
                <h2>First in</h2>
                <h2>--:--</h2>
              </div>
              <div className="flex text-lg text-left space-x-4">
                <h2>Last out</h2>
                <h2>--:--</h2>
              </div>
            </div>
            <div
              className="flex p-3 w-full mt-5 justify-center"
              onClick={alert}
            >
              <button className="flex items-center justify-center w-full gap-2 text-[15px] font-medium text-white bg-[#2EB67D] px-4 py-3 rounded transition">
                <IoIosArrowRoundForward size={25} />
                Clock in 0h 0m 0s
              </button>
            </div>
          </div>
          {/* Block 6 */}
          <div
            onClick={alert}
            className="p-4 border rounded-lg shadow-md bg-white w-full max-w-5xl mx-auto mt-6 h-fit"
          >
            <div className="flex justify-between text-lg font-semibold">
              <h2>To-dos</h2>
              <h2>
                {todoList.filter((task) => !task.isComplete).length} incomplete
              </h2>
            </div>
            <div className="mt-4 space-y-2">
              {todoList.map((task) => (
                <div key={task.id} className="flex items-center gap-5 p-2">
                  <div className="w-5 h-5 border-2 rounded-full"></div>
                  <div>
                    <p className="font-bold">{task.title}</p>
                    <div
                      className={`flex space-x-4 ${
                        task.status === "Overdue"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      <p>
                        {task.status === "Overdue" ? "Overdue" : "Upcoming"}
                      </p>
                      <p>{task.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Block 7 */}
          <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-5xl mx-auto mt-6 h-fit">
            <div className="flex justify-between text-lg text-left font-semibold">
              <h2>{`Who's Off Today`}</h2>
              <h2
                onClick={() => navigate("/attendance")}
                className=" cursor-pointer"
              >
                View all
              </h2>
            </div>
            <div className="flex flex-col h-[200px] overflow-y-auto scroll-hidden">
              {data.length > 0 ? (
                data.map((person) => (
                  <div key={person._id} className="flex items-center mt-5 ml-5">
                    <img
                      alt="avatar"
                      src={apiRoutes.file.avatar(person.avatar)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "src/assets/avatar.png";
                      }}
                      className="w-[40px] mr-[10px] rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="font-bold text-[13px] text-left">
                        {person.name}
                      </p>
                      <p className="text-[13px] mt-1 font-light text-left">
                        ID: {person.employeeID}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500  mt-5 text-center">
                  Nobody is absent today.
                </p>
              )}
            </div>
          </div>
          {/* Block 8 */}
          <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-5xl mx-auto mt-6 h-fit">
            <div className=" text-lg text-left font-semibold">
              <h2>New Members Today</h2>
            </div>
            <div className="flex flex-col h-[200px] overflow-y-auto">
              {user.length > 0 ? (
                user.map((person) => (
                  <div key={person._id} className="flex items-center mt-5 ml-5">
                    <img
                      alt="avatar"
                      src={apiRoutes.file.avatar(person.avatar)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "src/assets/avatar.png";
                      }}
                      className="w-[40px] mr-[10px] rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="font-bold text-[13px] text-left">
                        {person.name}
                      </p>
                      <p className="text-[13px] mt-1 font-light text-left">
                        ID: {person.employeeID}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 mt-5 text-center">
                  No New Members Today.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardEmployee;
