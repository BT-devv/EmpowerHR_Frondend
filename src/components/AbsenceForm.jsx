import { IoIosArrowDown } from "react-icons/io";
import apiRoutes from "../../apiRoutes";
import { useState, useEffect } from "react";
import RichTextEditor from "../components/RichTextEditor";

import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const AbsenceForm = () => {
  const [progress, setProgress] = useState(false);
  const [reason, setReason] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [type, setType] = useState("Select Type");
  const typeData = ["Full Day", "Half Day", "Leave Desk"];
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [lineManagers, setLineManagers] = useState([]);
  const [isTeammateOpen, setIsTeammateOpen] = useState(false);
  const [teammates, setTeammates] = useState([]);
  const [datamanagers, setDatamanagers] = useState([]);
  const [datateammates, setDatateammates] = useState([]);
  const [isDayTypeOpen, setIsDayTypeOpen] = useState(false);
  const [timeFrom, setTimeFrom] = useState(null);
  const [timeTo, setTimeTo] = useState(null);
  const [dayType, setDayType] = useState("Select Day Type");
  const dayTypeData = ["Morning", "Afternoon"];

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  // create request
  const handleSubmit = async () => {
    if (!type || !lineManagers || !reason) {
      Swal.fire({
        text: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        icon: "warning",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (type === "Full Day" && (!dateFrom || !dateTo)) {
      Swal.fire({
        text: "Vui lòng nhập ngày bắt đầu và kết thúc",
        icon: "warning",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (type === "Half Day" && (!dateFrom || !dateTo || !dayType)) {
      Swal.fire({
        text: "Vui lòng nhập ngày và buổi nghỉ",
        icon: "warning",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (type === "Leave Desk" && (!timeFrom || !timeTo)) {
      Swal.fire({
        text: "Vui lòng nhập thời gian rời bàn",
        icon: "warning",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const formattedTimeFrom = new Date(timeFrom).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const formattedTimeTo = new Date(timeTo).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let formData = {
      lineManagers: lineManagers.map((item) => item.id),
      teammates: teammates.map((item) => item.id),
      reason,
      type,
    };

    if (type === "Full Day") {
      formData = {
        ...formData,
        dateFrom,
        dateTo,
      };
    } else if (type === "Half Day") {
      formData = {
        ...formData,
        dateFrom,
        dateTo,
        session: dayType,
      };
    } else if (type === "Leave Desk") {
      formData = {
        ...formData,
        leaveFromTime: formattedTimeFrom,
        leaveToTime: formattedTimeTo,
      };
    }
    setProgress(true);
    try {
      const response = await axios.post(apiRoutes.absence.request, formData, {
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
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setLineManagers([]);
        setTeammates([]);
        setDateFrom(null);
        setDateTo(null);
        setType("Select Type");
        setDayType("Select Day Type");
        setReason("");
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } finally {
      setProgress(false);
    }
  };

  // Dropdown selection of type
  const toggleTypeDropdown = () => setIsTypeOpen(!isTypeOpen);
  const handleOptionClick2 = (option) => {
    setType(option);
    setIsTypeOpen(false);

    if (option === "Full Time") {
      setDayType("");
      setTimeFrom("");
      setTimeTo("");
    } else if (option === "Half Day") {
      setTimeFrom("");
      setTimeTo("");
    } else if (option === "Leave Desk") {
      setDateFrom("");
      setDateTo("");
      setDayType("");
    }
  };

  // Dropdown selection of teammate
  const toggleTeammateDropdown = () => setIsTeammateOpen(!isTeammateOpen);
  const handleOptionClick4 = (name, id) => {
    setTeammates((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      } else {
        return [...prev, { id, name }];
      }
    });
  };

  // Dropdown selection of datetype
  const toggleDayTypeDropdown = () => setIsDayTypeOpen(!isDayTypeOpen);
  const handleOptionClick3 = (option) => {
    setDayType(option);
    setIsDayTypeOpen(false);
  };

  // Dropdown selection of manager name
  const toggleManagerDropdown = () => setIsManagerOpen(!isManagerOpen);
  const handleOptionClick1 = (name, id) => {
    setLineManagers((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      } else {
        return [...prev, { id, name }];
      }
    });
  };

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
        const filteredManagers = response.data.filter(
          (user) => user._id !== decodedToken._id
        );

        const filteredTeammates = response.data.filter(
          (user) => user._id !== decodedToken._id
        );

        setDatamanagers(filteredManagers);
        setDatateammates(filteredTeammates);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  return (
    <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[10px] h-auto w-[calc(100vw-340px)] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] text-[14px] p-1">
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
      <div className="flex flex-grow ml-[4%]">
        <div className="mt-[2%] w-full">
          <p>Absence Type</p>
          <div className="relative inline-block text-left w-full ">
            <div className="relative">
              <div
                className="inline-flex w-[91%] border-gray-200 border-1 h-[45px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                onClick={toggleTypeDropdown}
              >
                <span className="text-[15px]">{type}</span>
                <IoIosArrowDown />
              </div>
            </div>
            {isTypeOpen && (
              <div className="absolute z-10 mt-2 w-[91%] bg-white rounded-md shadow-lg border border-gray-200">
                <ul className="py-1">
                  {typeData.map((option, index) => (
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
        <div className="mt-[2%] w-full">
          <p>Manager Approval</p>
          <div className="space-x-5">
            <div
              className="relative inline-block text-left w-full"
              // ref={dropdownRef}
            >
              <div className="relative">
                <div
                  className="inline-flex w-[91%] border-gray-200 border-1 h-[45px] items-center justify-between gap-x-1.5 rounded-[5px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                  onClick={toggleManagerDropdown}
                >
                  <p>
                    {lineManagers.length > 0
                      ? lineManagers.map((item) => item.name).join(", ")
                      : "Select Manager"}
                  </p>
                  <IoIosArrowDown />
                </div>
              </div>
              {isManagerOpen && (
                <div className="absolute z-10 mt-2 w-[91%] bg-white rounded-md shadow-lg border border-gray-200 max-h-[250px] overflow-y-auto">
                  <ul className="py-1">
                    {datamanagers
                      .filter(
                        (option) =>
                          !teammates.some(
                            (teammate) => teammate.id === option.employeeID
                          )
                      )
                      .map((option, index) => {
                        const fullName = `${option.firstName} ${option.lastName}`;
                        const isSelected = lineManagers.some(
                          (item) => item.id === option.employeeID
                        );

                        return (
                          <li
                            key={index}
                            onClick={() =>
                              handleOptionClick1(fullName, option.employeeID)
                            }
                            className={`px-4 py-2 text-[13px] cursor-pointer flex ${
                              isSelected
                                ? "bg-[#2EB67D] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <img
                              alt="avatar"
                              src={apiRoutes.file.avatar(option.avatar)}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "src/assets/avatar.png";
                              }}
                              className="w-[50px] h-[50px] object-cover border border-gray-100"
                            />
                            <div className="ml-5 mt-2">
                              <div className="text-gray-800">
                                {`${option.firstName} ${option.lastName}`}
                              </div>
                              <div className="text-gray-500">
                                {option.emailCompany}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {type !== "Leave Desk" && (
        <div className="flex ml-[4%] mt-3">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="w-full">
              <p className="mb-2">From</p>
              <DatePicker
                value={dateFrom}
                onChange={setDateFrom}
                format="DD/MM/YYYY"
                className="border-gray-200 rounded-[5px] border-[1px] w-[91%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </div>{" "}
            <div className="w-full">
              <p className="mb-2">To</p>
              <DatePicker
                value={dateTo}
                onChange={setDateTo}
                format="DD/MM/YYYY"
                className="border-gray-200 rounded-[5px] border-[1px] w-[91%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </div>
          </LocalizationProvider>
        </div>
      )}
      {type === "Half Day" && (
        <div className="flex ml-[4%] mt-7 w-full">
          <div className="w-full">
            <p className="mb-2">Day Type</p>
            <div
              className="relative inline-block text-left w-full "
              // ref={dropdownRef}
            >
              <div className="relative">
                <div
                  className="inline-flex w-[91%] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                  onClick={toggleDayTypeDropdown}
                >
                  <span className="text-[15px]">{dayType}</span>
                  <IoIosArrowDown />
                </div>
              </div>
              {isDayTypeOpen && (
                <div className="absolute z-10 mt-2 w-[91%] bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1">
                    {dayTypeData.map((option, index) => (
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
        </div>
      )}
      {type === "Leave Desk" && (
        <div className="flex ml-[4%] mt-3">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="w-full">
              <p className="mb-2">Leave From</p>
              <TimePicker
                value={timeFrom}
                onChange={setTimeFrom}
                views={["hours", "minutes"]}
                format="hh:mm"
                renderInput={(params) => <TextField {...params} fullWdth />}
                className="border-gray-200 rounded-[5px] border-[1px] w-[91%] h-[40px] mt-[5px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
              />
            </div>
            <div className="w-full">
              <p className="mb-2">Leave To</p>
              <TimePicker
                value={timeTo}
                onChange={setTimeTo}
                views={["hours", "minutes"]}
                format="hh:mm"
                renderInput={(params) => <TextField {...params} fullWdth />}
                className="border-gray-200 rounded-[5px] border-[1px] w-[91%] h-[40px] mt-[5px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
              />
            </div>
          </LocalizationProvider>
        </div>
      )}
      <div className="mt-7 ml-[4%] w-full">
        <p>Teammate</p>
        <div className="space-x-5">
          <div
            className="relative inline-block text-left w-full"
            // ref={dropdownRef}
          >
            <div className="relative">
              <div
                className="inline-flex w-[91%] border-gray-200 border-1 h-[45px] items-center justify-between gap-x-1.5 rounded-[5px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                onClick={toggleTeammateDropdown}
              >
                <p>
                  {teammates.length > 0
                    ? teammates.map((item) => item.name).join(", ")
                    : "Select Teammate"}
                </p>
                <IoIosArrowDown />
              </div>
            </div>
            {isTeammateOpen && (
              <div className="absolute z-10 mt-2 w-[91%] bg-white rounded-md shadow-lg border border-gray-200 max-h-[250px] overflow-y-auto">
                <ul className="py-1">
                  {datateammates
                    .filter(
                      (option) =>
                        !lineManagers.some(
                          (manager) => manager.id === option.employeeID
                        )
                    )
                    .map((option, index) => {
                      const fullName = `${option.firstName} ${option.lastName}`;
                      const isSelected = teammates.some(
                        (item) => item.id === option.employeeID
                      );

                      return (
                        <li
                          key={index}
                          onClick={() =>
                            handleOptionClick4(fullName, option.employeeID)
                          }
                          className={`flex px-4 py-2 text-[13px] cursor-pointer ${
                            isSelected
                              ? "bg-[#2EB67D] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <img
                            alt="avatar"
                            src={apiRoutes.file.avatar(option.avatar)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "src/assets/avatar.png";
                            }}
                            className="w-[50px] h-[50px] object-cover border border-gray-100"
                          />
                          <div className="ml-5 mt-2">
                            <div className="text-gray-800">
                              {`${option.firstName} ${option.lastName}`}
                            </div>
                            <div className="text-gray-500">
                              {option.emailCompany}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-[3%] ml-[4%] w-[96%]">
        <p>Reason</p>
        <div className="mt-[1%]">
          <RichTextEditor value={reason} onChange={setReason} />
        </div>

        <div className="flex items-center justify-center mb-5">
          <button
            type="submit"
            className="mt-5 bg-[#2EB67D] text-white outline-none w-[15%] text-[18px] focus:outline-none"
            onClick={handleSubmit}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbsenceForm;
