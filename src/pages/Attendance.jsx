import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
// icon
import { PiClock } from "react-icons/pi";
import { IoBulbOutline } from "react-icons/io5";
import { MdWifiTetheringOff } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";

const Attendance = () => {
  const navigate = useNavigate();
  // Get date
  const currentDate = format(new Date(), "dd MMM, yyyy");

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
            <p
              className="ml-2 caret-transparent"
              onClick={() => navigate("/qrscanner")}
            >
              View Attendance
            </p>
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
    </div>
  );
};

export default Attendance;
