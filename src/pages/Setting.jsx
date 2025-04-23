import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Setting = () => {
  const [dataRole, setDataRole] = useState([]);
  const [dataRoleA, setDataRoleA] = useState([]);
  const [dataRoleE, setDataRoleE] = useState([]);

  const [selectedTab, setSelectedTab] = useState("role");

  // Get all role
  useEffect(() => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRole(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all role admin
  useEffect(() => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRoleA(response.data[0].permissions);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all role employee
  useEffect(() => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRoleE(response.data[1].permissions);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <div className="flex gap-10 md:gap-10 text-[#1C1C1C] ml-7">
          {[
            { key: "role", label: "Setting Role" },
            { key: "permission", label: "Setting Permission" },
            { key: "department", label: "Setting Department" },
            { key: "job", label: "Setting Job Title" },
            { key: "notification", label: "Setting Notification" },
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

      {selectedTab === "role" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            {/* Overtime Request Title */}
            <div>
              <p className="text-[#252C58] text-[20px] font-light">List Role</p>
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

            {/* Filter Button */}
            <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
              <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
              <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
                Filter
              </div>
            </div>

            {/* Add Role */}
            <div className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
              <p>Add Role</p>
            </div>
          </div>
          {/* List */}
          {dataRole.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      No
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Name
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Permission
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataRole.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                    >
                      <td className="px-3 py-6 border-b border-gray-200 text-left w-[20%]">
                        {index + 1}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[40%]">
                        {item.name}
                      </td>

                      <td className="px-10 py-6 border-b border-gray-200 truncate text-left w[40%]">
                        {item.name === "admin"
                          ? dataRoleA.length + "+"
                          : dataRoleE.length + "+"}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          // onClick={() => {
                          //   setMoreOptions1(moreOptions1 === 1 ? null : 1);
                          // }}
                        />
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
              <button
                className="text-white font-normal mt-[10%] h-[50px] w-[180px] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
                // onClick={() => setModalIsOpen(true)}
              >
                + Employee
              </button>
            </div>
          )}
          {/* page */}
          <div className="flex flex-wrap items-center w-full justify-between text-[#9A9A9A] caret-transparent p-4 gap-4 md:gap-6 mt-2">
            Page 1 of 100
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
