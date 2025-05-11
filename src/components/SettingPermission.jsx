import { Fragment } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

const SettingPermission = () => {
  const [permission, setPermission] = useState([]);

  // Get all permission
  const fetchPermission = () => {
    axios
      .get(apiRoutes.permission.getPermission)
      .then((response) => {
        setPermission(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  };
  useEffect(() => {
    fetchPermission();
  }, []);

  const moduleTitleMap = {
    dashboard: "Dashboard",
    user: "Employee",
    calendar: "Calendar",
    absence: "Absence report",
    overtime: "Overtime report",
    attendance: "Attendance",
    message: "Message",
    payroll: "Payroll",
    qr: "QR",
    setting: "Setting",
  };

  const groupedData = {};

  permission.forEach((item) => {
    const [module] = item.name.split(".");
    const title = moduleTitleMap[module] || module;
    console.log(title);

    if (!groupedData[title]) {
      groupedData[title] = [];
    }
    groupedData[title].push(item);
  });

  return (
    <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
        <div>
          <p className="text-[#252C58] text-[20px] font-light">
            List Permission
          </p>
        </div>
      </div>
      {/* List */}
      {permission.length > 0 ? (
        <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
          <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
            <thead>
              <tr className="border-gray-300 border-t border-b-2 text-left">
                <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Permission
                </th>
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Sub-Permission
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedData).map(([title, items], groupIndex) => (
                <Fragment key={groupIndex}>
                  {items.map((item, itemIndex) => (
                    <Fragment key={item._id}>
                      <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]">
                        {itemIndex === 0 ? (
                          <td className="px-3 py-6 text-left font-semibold text-[16px] w-[25%]">
                            {title}
                          </td>
                        ) : (
                          <td className="px-3 py-6 w-[25%]" />
                        )}
                        <td className="px-5 py-6 truncate text-left w-[40%] capitalize">
                          {item.description}
                        </td>
                      </tr>
                      {itemIndex === items.length - 1 && (
                        <tr className="border-b border-gray-200">
                          <td></td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </Fragment>
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
    </div>
  );
};
export default SettingPermission;
