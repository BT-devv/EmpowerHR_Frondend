import { useState, useEffect, useRef } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import RichTextEditor from "../components/RichTextEditor";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
// import dayjs from "dayjs";
import { format } from "date-fns";
import Swal from "sweetalert2";
// icon
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";

const Absence = () => {
  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [selectedTab, setSelectedTab] = useState("absence");
  const [reason, setReason] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [type, setType] = useState("Select Type");
  const typeData = ["Full Day", "Half Day", "Leave Desk"];

  const [data, setData] = useState([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [lineManagers, setLineManagers] = useState("");
  const [managerName, setManagerName] = useState("Select Manager");

  const dropdownRef = useRef(null);

  // Dropdown selection of type
  const toggleTypeDropdown = () => setIsTypeOpen(!isTypeOpen);
  const handleOptionClick2 = (option) => {
    setType(option);
    setIsTypeOpen(false);
  };

  // Dropdown selection of manager name
  const toggleManagerDropdown = () => setIsManagerOpen(!isManagerOpen);
  const handleOptionClick1 = (option, id) => {
    setManagerName(option);
    setLineManagers(id);
    setIsManagerOpen(false);
  };

  // Get all users
  useEffect(() => {
    axios
      .get(apiRoutes.user.getAll)
      .then((response) => {
        setData(response.data);
        console.log(JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Prevent click outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsManagerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!lineManagers || !dateTo || !dateFrom || !reason || !type) {
      Swal.fire({ text: "Vui lòng nhập đầy đủ thông tin", icon: "warning" });
      return;
    }
    const formData = {
      lineManagers,
      dateTo,
      dateFrom,
      type,
      reason,
    };
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
        });
        window.location.reload();
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <div className="flex gap-10 md:gap-10 text-[#1C1C1C] ml-7">
          {[
            { key: "absence", label: "Absent Form" },
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

      {selectedTab === "absence" && (
        <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[10px] w-[calc(100vw-340px)] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-grow ml-[5%]">
            <div className="mt-[3%] w-full">
              <p>Absence Type</p>
              <div
                className="relative inline-block text-left w-full "
                ref={dropdownRef}
              >
                <div className="relative">
                  <div
                    className="inline-flex w-[91%] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
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
            <div className="mt-[3%] w-full">
              <p>Manager Approval</p>
              <div className="space-x-5">
                <div
                  className="relative inline-block text-left w-full"
                  ref={dropdownRef}
                >
                  <div className="relative">
                    <div
                      className="inline-flex w-[91%] border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[5px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                      onClick={toggleManagerDropdown}
                    >
                      <span className="text-[15px]">{managerName}</span>
                      <IoIosArrowDown />
                    </div>
                  </div>
                  {isManagerOpen && (
                    <div className="absolute z-10 mt-2 w-[91%] bg-white rounded-md shadow-lg border border-gray-200">
                      <ul className="py-1">
                        {data.map((option, index) => (
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
            </div>
          </div>
          <div className="flex ml-[5%] mt-[3%]">
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
              </div>
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
          <div className="flex ml-[5%] mt-[3%]">
            <input type="checkbox" className="w-[15px]" />
            <p className="text-[#657081] ml-[1%]">Half Day</p>
          </div>
          <div className="mt-[2%] ml-[5%]">
            <p>Teammate</p>
            <input
              type="text"
              className="border-gray-200 rounded-[5px] border-[2px] w-[95%] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
              // value={firstName}
              placeholder="Select Type"
              // onChange={(e) => {
              //   setFirstName(e.target.value);
              // }}
            />
          </div>
          <div className="mt-[3%] ml-[5%] ">
            <p>Reason</p>
            <div className="mt-[1%]">
              <RichTextEditor value={reason} onChange={setReason} />
            </div>
            <div className="flex items-center justify-center mb-[3%]">
              <button
                type="submit"
                className="mt-[3%] bg-[#2EB67D] text-white outline-none w-[15%] text-[18px] focus:outline-none"
                onClick={handleSubmit}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTab === "approval" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            {/* Overtime Request Title */}
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                Absent Request
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

export default Absence;
