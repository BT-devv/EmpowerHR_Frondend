import { useState } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import RichTextEditor from "../components/RichTextEditor";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { format } from "date-fns";
//logo
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";

const Overtime = () => {
  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [selectedTab, setSelectedTab] = useState("overtime");
  const [managerID, setManagerID] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [reason, setReason] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!managerID || !date || !startTime || !endTime || !reason) {
      Swal.fire({ text: "Vui lòng nhập đầy đủ thông tin", icon: "warning" });
      return;
    }
    const formData = { managerID, date, startTime, endTime, reason };
    alert(JSON.stringify(formData));

    try {
      const response = await axios.post(apiRoutes.overtime.request, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        text: response.data.message,
        icon: response.data.success ? "success" : "error",
      });
    } catch (error) {
      console.error("Lỗi gửi yêu cầu:", error);
      Swal.fire({ text: "Có lỗi xảy ra, vui lòng thử lại sau", icon: "error" });
    }
  };

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <div className="flex gap-10 md:gap-10 text-[#1C1C1C] ml-7">
          {[
            { key: "overtime", label: "Overtime Form" },
            { key: "approval", label: "Approval Manager" },
            { key: "history", label: "History" },
          ].map((tab) => (
            <p
              key={tab.key}
              className={`cursor-pointer py-6 border-b-2 transition-all ${
                selectedTab === tab.key
                  ? "font-bold border-black"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </p>
          ))}
        </div>
      </div>
      {selectedTab === "overtime" && (
        <div className="bg-white ml-[3%] mt-[2%] rounded-[10px] w-[calc(100vw-340px)] text-left shadow-md p-6">
          <div className="mt-[1%] ml-[3%]">
            <p>Manager Approval</p>
            <input
              type="text"
              className="border-gray-200 rounded-[5px] border-[2px] w-[97%] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
              value={managerID}
              placeholder="Select Manager"
              onChange={(e) => {
                setManagerID(e.target.value);
              }}
            />
          </div>
          <div className="mt-[2%] ml-[3%]">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="w-full">
                <p className="mb-2">Date</p>
                <DatePicker
                  value={date}
                  onChange={setDate}
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
                  onChange={setStartTime}
                  views={["hours", "minutes"]}
                  format="hh:mm"
                  renderInput={(params) => <TextField {...params} fullWdth />}
                  className="border-gray-200 rounded-[5px] border-[1px] w-[95%] h-[40px] mt-[5px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                />
              </div>
              <div className="w-full">
                <p className="mb-2">To</p>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
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

          <div className="flex justify-center mt-5">
            <button
              className="bg-[#2EB67D] text-white rounded-md px-6 py-2 text-lg hover:bg-[#249966]"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}

      {selectedTab === "approval" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            {/* Overtime Request Title */}
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                Overtime Request
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
            <div className="relative flex items-center min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
              <CiCalendarDate className="absolute left-4 w-[20px] h-[20px]" />
              <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
                {currentDate}
              </div>
            </div>

            {/* Filter Button */}
            <div className="flex items-center justify-center min-w-[120px] sm:min-w-[140px] h-[50px] px-4 text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
              <VscSettings className="text-white w-[25px] h-[25px]" />
              <p className="ml-2">Filter</p>
            </div>
          </div>

          {/* list */}
          <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
            <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
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
                <tr>
                  <td className="px-1 py-6 border-b border-gray-200">
                    <div className="text-left w-[60px]">2345672</div>
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200">
                    <div className="truncate text-left w-[130px] ">
                      Ahmed Rashdan
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="truncate text-left w-[130px] ">
                      IT Department
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="truncate text-left w-[100px] ">
                      29 July 2023
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="text-center p-1 border rounded-md w-[150px] h-[40px] flex items-center justify-center">
                      Work from office
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">00:00</div>
                  </td>
                  <td className="px-0 py-6 border-b border-gray-200 text-gray-400 text-center">
                    ----
                  </td>
                  <td className="px-4 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">00:00</div>
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">10h 2m</div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">10h 2m</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* page */}
          <div className="mt-auto font-light text-[#252C58] text-[14px] ml-[1%]">
            Page 1 of 100
          </div>
        </div>
      )}
      {selectedTab === "history" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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
            <div className="flex items-center justify-center min-w-[120px] sm:min-w-[140px] h-[50px] px-4 text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
              <VscSettings className="text-white w-[25px] h-[25px]" />
              <p className="ml-2">Filter</p>
            </div>
          </div>
          {/* list */}
          <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
            <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
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
                <tr>
                  <td className="px-1 py-6 border-b border-gray-200">
                    <div className="text-left w-[60px]">2345672</div>
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200">
                    <div className="truncate text-left w-[130px] ">
                      Ahmed Rashdan
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="truncate text-left w-[130px] ">
                      IT Department
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="truncate text-left w-[100px] ">
                      29 July 2023
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="text-center p-1 border rounded-md w-[150px] h-[40px] flex items-center justify-center">
                      Work from office
                    </div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">00:00</div>
                  </td>
                  <td className="px-0 py-6 border-b border-gray-200 text-gray-400 text-center">
                    ----
                  </td>
                  <td className="px-4 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">00:00</div>
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">10h 2m</div>
                  </td>
                  <td className="px-3 py-6 border-b border-gray-200">
                    <div className="text-center w-[70px] ">10h 2m</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* page */}
          <div className="mt-auto font-light text-[#252C58] text-[14px] ml-[1%]">
            Page 1 of 100
          </div>
        </div>
      )}
    </div>
  );
};

export default Overtime;
