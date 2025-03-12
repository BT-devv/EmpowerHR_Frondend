import { useState } from "react";
import RichTextEditor from "../components/RichTextEditor";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { format } from "date-fns";
// icon
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";

const Absence = () => {
  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [selectedTab, setSelectedTab] = useState("absence");
  const [reason, setReason] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
        <div className="flex space-x-8 items-center mt-[2%] ml-[2%] text-[#1C1C1C]">
          <p
            className={`cursor-pointer pb-5 ${
              selectedTab === "absence"
                ? "font-bold border-b-2 border-black "
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("absence")}
          >
            Absent Form
          </p>
          <p
            className={`cursor-pointer pb-5 ${
              selectedTab === "approval"
                ? "font-bold border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("approval")}
          >
            Approval Manager
          </p>
          <p
            className={`cursor-pointer pb-5 ${
              selectedTab === "history"
                ? "font-bold border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("history")}
          >
            History
          </p>
        </div>
      </div>
      {selectedTab === "absence" && (
        <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[10px] w-[calc(100vw-340px)] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-grow ml-[5%]">
            <div className="mt-[3%] w-full">
              <p>Absence Type</p>
              <input
                type="text"
                className="border-gray-200 rounded-[5px] border-[2px] w-[91%] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                // value={firstName}
                placeholder="Select Type"
                // onChange={(e) => {
                //   setFirstName(e.target.value);
                // }}
              />
            </div>
            <div className="mt-[3%] w-full">
              <p>Manager Approval</p>
              <input
                type="text"
                className="border-gray-200 rounded-[5px] border-[2px] w-[91%] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                // value={firstName}
                placeholder="Select Manager"
                // onChange={(e) => {
                //   setFirstName(e.target.value);
                // }}
              />
            </div>
          </div>
          <div className="flex ml-[5%] mt-[3%]">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="w-full">
                <p className="mb-2">From</p>
                <DatePicker
                  value={from}
                  onChange={setFrom}
                  format="DD/MM/YYYY"
                  className="border-gray-200 rounded-[5px] border-[1px] w-[91%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </div>
              <div className="w-full">
                <p className="mb-2">To</p>
                <DatePicker
                  value={to}
                  onChange={setTo}
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
                // onClick={handleSubmit}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTab === "approval" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex w-full items-center ml-[1%] mt-[2%]">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                Absent Requrest
              </p>
            </div>
            {/* Search */}
            <div className="relative ml-[10%] flex items-center">
              <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Quick Search"
                className="h-[50px] w-[424px] pl-12 rounded-[10px] border-[1px] bg-[#FFFFFF] border-gray-300 focus:outline-none text-[13px] focus:border-[#2EB67D] hover:border-[#2EB67D] placeholder:text-[#252C58] placeholder:font-light placeholder:opacity-100"
              />
            </div>
            {/* Calendar */}
            <div className="relative mr-[20px] flex items-center caret-transparent cursor-default ml-[2%]">
              <CiCalendarDate className="absolute left-4 w-[20px] h-[20px]" />
              <div className="h-[50px] w-[169px] pl-12 rounded-[12px] border-2 bg-[#D5D9DD] border-gray-300 focus:outline-none text-[15px] text-black flex items-center font-light">
                {currentDate}
              </div>
            </div>
            {/* Button View */}

            <div className="flex space-x-4 items-center mr-[15px] text-white font-normal h-[50px] p-3 w-[10%] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
              <VscSettings className="text-white w-[25px] h-[25px]" />
              <p>Filter</p>
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
          <div className="flex w-full items-center ml-[1%] mt-[2%]">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">History</p>
            </div>
            {/* Search */}
            <div className="relative ml-[10%] flex items-center">
              <CiSearch className="absolute left-4 w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Quick Search"
                className="h-[50px] w-[424px] pl-12 rounded-[10px] border-[1px] bg-[#FFFFFF] border-gray-300 focus:outline-none text-[13px] focus:border-[#2EB67D] hover:border-[#2EB67D] placeholder:text-[#252C58] placeholder:font-light placeholder:opacity-100"
              />
            </div>
            {/* Calendar */}
            <div className="relative mr-[20px] flex items-center caret-transparent cursor-default ml-[2%]">
              <CiCalendarDate className="absolute left-4 w-[20px] h-[20px]" />
              <div className="h-[50px] w-[169px] pl-12 rounded-[12px] border-2 bg-[#D5D9DD] border-gray-300 focus:outline-none text-[15px] text-black flex items-center font-light">
                {currentDate}
              </div>
            </div>
            {/* Button View */}

            <div className="flex space-x-4 items-center mr-[15px] text-white font-normal h-[50px] p-3 w-[10%] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
              <VscSettings className="text-white w-[25px] h-[25px]" />
              <p>Filter</p>
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
