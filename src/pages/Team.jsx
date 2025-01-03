import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { LuSquareArrowLeft } from "react-icons/lu";
import { LuSquareArrowRight } from "react-icons/lu";

const Team = () => {
  //Sample employees
  const employees = [
    {
      employee: "John Doe",
      role: "Project Manager",
      type: "Full-Time",
      status: "Active",
      email: "john.doe@example.com",
      phoneNumber: "(+84) 355 8588 8181 888",
      view: "",
      avatar: "https://via.placeholder.com/50",
    },
    {
      employee: "Jane Smith",
      role: "Software Engineer",
      type: "Part-Time",
      status: "Inactive",
      email: "jane.smith@example.com",
      phoneNumber: "(+84) 987 6543 210",
      view: "",
    },
    {
      employee: "Samuel Wilson",
      role: "UX Designer",
      type: "Part-Time",
      status: "Active",
      email: "samuel.wilson@example.com",
      phoneNumber: "(+84) 123 4567 890",
      view: "",
    },
    {
      employee: "Emily Davis",
      role: "Data Scientist",
      type: "Full-Time",
      status: "Active",
      email: "emily.davis@example.com",
      phoneNumber: "(+84) 321 7654 098",
      view: "",
    },
    {
      employee: "Michael Brown",
      role: "DevOps Engineer",
      type: "Part-Time",
      status: "Inactive",
      email: "michael.brown@example.com",
      phoneNumber: "(+84) 246 8101 920",
      view: "",
    },
    {
      employee: "Sophia Green",
      role: "QA Tester",
      type: "Part-Time",
      status: "Active",
      email: "sophia.green@example.com",
      phoneNumber: "(+84) 654 3210 876",
      view: "",
    },
    {
      employee: "Liam Johnson",
      role: "Backend Developer",
      type: "Full-Time",
      status: "Inactive",
      email: "liam.johnson@example.com",
      phoneNumber: "(+84) 987 1234 567",
      view: "",
    },
    {
      employee: "Olivia Martinez",
      role: "Frontend Developer",
      type: "Part-Time",
      status: "Active",
      email: "olivia.martinez@example.com",
      phoneNumber: "(+84) 567 8901 234",
      view: "",
    },
  ];
  const currentPage = 1;
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, employees.length);

  return (
    <div className="flex ">
      <Slidebar />
      <div className="flex flex-col flex-grow">
        <Navbar className="w-full" />
        {/* more */}
        <div className="flex p-4 mt-[15px]">
          {/* search */}
          <div className="relative mr-[25px]">
            <CiSearch className="absolute top-[50%] left-4 transform -translate-y-1/2 w-[20px] h-[20px]" />
            <input
              type="text"
              placeholder="Search by name, role, department..."
              className="h-[50px] w-[331px] pl-12 rounded-[12px] border-2 bg-white border-gray-200 focus:outline-none text-[15px] text-black"
            />
          </div>
          {/* filter */}
          <div className="relative mr-[100px]">
            <button className="flex items-center justify-between h-[50px] w-[113px] px-4 rounded-[12px] border-2 bg-white border-gray-200 focus:outline-none text-[15px] ">
              <span className="ml-[10px]">Filter</span>
              <IoFilterOutline className="w-[20px] h-[20px]" />
            </button>
          </div>
          {/* all department */}
          <div className="relative mr-[25px]">
            <button className="flex items-center justify-between h-[50px] w-[196px] px-4 rounded-[12px] border-2 bg-white border-gray-200 focus:outline-none text-[15px] ">
              <span className="ml-[10px]">All Departments</span>
              <IoIosArrowDown className="w-[20px] h-[20px]" />
            </button>
          </div>

          {/* Calendar */}
          <div className="relative mr-[25px]">
            <CiCalendarDate className="absolute top-[50%] left-4 transform -translate-y-1/2 w-[20px] h-[20px]" />
            <div className="flex items-center top-[50%] h-[50px] w-[169px] pl-12 rounded-[12px] border-2 bg-white border-gray-200 focus:outline-none text-[15px] text-black">
              13 Jan, 2024
            </div>
          </div>
          {/* button add */}
          <div className="mr-[15px]">
            <button className="h-[50px] w-[180px] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none text-[15px]">
              Add new employee
            </button>
          </div>
        </div>
        {/* list employees */}
        <div className="overflow-x-auto mt-[20px] text-[15px] ml-[15px] w-full">
          <table className="border-collapse bg-white rounded-[20px] overflow-hidden">
            <thead>
              <tr className="bg-[#E2E2E2] text-left">
                <th className="px-6 py-4 border-b border-gray-300">
                  <input
                    type="checkbox"
                    disabled
                    className="h-5 w-5 mt-[8px] border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-4 border-b border-gray-300">Employee</th>
                <th className="px-6 py-4 border-b border-gray-300">Role</th>
                <th className="px-6 py-4 border-b border-gray-300 ">
                  Employment Type
                </th>
                <th className="px-6 py-4 border-b border-gray-300">Status</th>
                <th className="px-6 py-4 border-b border-gray-300">Email</th>
                <th className="px-6 py-4 border-b border-gray-300">
                  Phone number
                </th>
                <th className="px-6 py-4 border-b border-gray-300">View</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((item) => (
                <tr key={item.employee} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-400 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={item.avatar}
                        alt={item.avatar}
                        className="mr-[10px] rounded-[50px] w-[40px] h-[40px]"
                      />
                      {item.employee}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="truncate w-[130px]"> {item.role}</div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span
                      className={`px-2 py-1 border rounded-md text-sm
                      ${
                        item.type === "Full-Time"
                          ? "text-[#534FEB] border-[#534FEB] bg-[#534FEB] bg-opacity-10"
                          : ""
                      }
                      ${
                        item.type === "Part-Time"
                          ? "text-[#1C6CE5] border-[#1C6CE5] bg-[#1C6CE5] bg-opacity-10"
                          : ""
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span
                      className={`px-2 py-1 border rounded-md text-sm
                      ${
                        item.status === "Active"
                          ? "text-[#069855] border-[#069855] bg-[#069855] bg-opacity-10"
                          : ""
                      }
                      ${
                        item.status === "Inactive"
                          ? "text-[#D39C1D] border-[#D39C1D] bg-[#D39C1D] bg-opacity-10"
                          : ""
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 ">
                    <div className="truncate w-[150px]">{item.email}</div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="truncate w-[130px]">{item.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {item.view}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* infor bottom */}
        <div className="mt-[40px] ml-[35px] flex items-center gap-[40%]">
          <p>
            Showing{" "}
            <b>
              {startIndex} to {endIndex} of {employees.length}
            </b>{" "}
            employees
          </p>
          <div className="flex items-center space-x-2 ml-[100px]">
            <div className="bg-[#000000] bg-opacity-5 w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3]">
              <LuSquareArrowLeft />
            </div>
            <div className="bg-[#000000] bg-opacity-5 w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3]">
              <p>1</p>
            </div>
            <div className="bg-[#F5F5F5] bg-opacity-5 w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3]">
              <p>2</p>
            </div>
            <div className="bg-[#F5F5F5] bg-opacity-5 w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3]">
              <p>...</p>
            </div>
            <div className="bg-[#F5F5F5] bg-opacity-5 w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3]">
              <p>24</p>
            </div>
            <div className="bg-[#000000] bg-opacity-5 w-[50px] h-[50px] rounded-[12px] flex items-center justify-center border border-[#B0BAC3]">
              <LuSquareArrowRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
