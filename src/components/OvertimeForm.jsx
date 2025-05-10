import RichTextEditor from "../components/RichTextEditor";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { jwtDecode } from "jwt-decode";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";

// icon
import { IoIosArrowDown } from "react-icons/io";
const OvertimeForm = () => {
  const [progress, setProgress] = useState(false);

  const [projectManager, setprojectManager] = useState("");
  const [managerName, setManagerName] = useState("Select Manager");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [reason, setReason] = useState("");
  const [datamanagers, setDatamanagers] = useState([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

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

        setDatamanagers(filteredManagers);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Dropdown selection of manager name
  const toggleManagerDropdown = () => setIsManagerOpen(!isManagerOpen);

  const handleOptionClick1 = (option, id) => {
    setManagerName(option);
    setprojectManager(id);
    setIsManagerOpen(false);
  };

  const handleSubmit = async () => {
    if (!projectManager || !date || !startTime || !endTime || !reason) {
      Swal.fire({
        text: "Vui lòng nhập đầy đủ thông tin",
        icon: "warning",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    const formattedStartTime = dayjs(startTime).format("HH:mm");
    const formattedEndTime = dayjs(endTime).format("HH:mm");

    const formData = {
      projectManager,
      date,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      reason,
    };
    console.log(formData);
    setProgress(true);
    try {
      const response = await axios.post(apiRoutes.overtime.request, formData, {
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
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setprojectManager([]);
        setDate(null);
        setStartTime(null);
        setEndTime(null);
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
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setProgress(false);
    }
  };

  return (
    <div className="bg-white ml-[3%] mt-[2%] rounded-[10px] h-auto w-[calc(100vw-340px)] text-left shadow-md mb-[1%] p-6 text-[14px]">
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
      <div className="ml-[3%]">
        <p>Manager Approval</p>
        <div className="space-x-5">
          <div
            className="relative inline-block text-left w-full"
            // ref={dropdownRef}
          >
            <div className="relative">
              <div
                className="inline-flex w-[97%] border-gray-200 border-1 h-[45px] items-center justify-between gap-x-1.5 rounded-[5px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                onClick={toggleManagerDropdown}
              >
                <span className="text-[15px]">{managerName}</span>
                <IoIosArrowDown />
              </div>
            </div>
            {isManagerOpen && (
              <div className="absolute z-10 mt-2 w-[97%] bg-white rounded-md shadow-lg border border-gray-200">
                <ul className="py-1 max-h-[250px] overflow-y-auto">
                  {datamanagers.map((option, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleOptionClick1(
                          `${option.firstName} ${option.lastName}`,
                          option.employeeID
                        )
                      }
                      className="flex px-4 py-2 text-[13px] text-gray-500 cursor-pointer hover:bg-gray-100"
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
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-[1%] ml-[3%]">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="w-full">
            <p className="mb-2">Date</p>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
              format="DD/MM/YYYY"
              renderInput={(params) => <TextField {...params} fullWidth />}
              className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
            />
          </div>
        </LocalizationProvider>
      </div>

      <div className="flex mt-[3%] ml-[3%]">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="w-full">
            <p className="mb-2">From</p>
            <TimePicker
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              views={["hours", "minutes"]}
              format="hh:mm"
              renderInput={(params) => <TextField {...params} fullWidth />}
              className="border-gray-200 rounded-[5px] border-[1px] w-[95%] h-[40px] mt-[5px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
            />
          </div>
          <div className="w-full">
            <p className="mb-2">To</p>
            <TimePicker
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              views={["hours", "minutes"]}
              format="hh:mm"
              renderInput={(params) => <TextField {...params} fullWidth />}
              className="border-gray-200 rounded-[5px] border-[1px] w-[95%] h-[40px] mt-[5px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
            />
          </div>
        </LocalizationProvider>
      </div>

      <div className="mt-[3%] ml-[3%] w-full">
        <p className="mb-2">Reason</p>
        <RichTextEditor value={reason} onChange={setReason} />
      </div>

      <div className="flex justify-center">
        <button
          className="mt-5 bg-[#2EB67D] text-white outline-none w-[15%] text-[18px] focus:outline-none"
          onClick={handleSubmit}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};
export default OvertimeForm;
