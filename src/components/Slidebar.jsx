import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePermission from "../components/UsePermission";
// icon
import { CiDollar } from "react-icons/ci";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { BiMessageRounded } from "react-icons/bi";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { HiOutlineUserGroup, HiOutlineDocumentCheck } from "react-icons/hi2";

const Slidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);

  const permissions = {
    dashboard: usePermission("dashboard.read"),
    message: usePermission("message.read"),
    calendar: usePermission("calendar.read"),
    overtime: usePermission("overtime.read"),
    absence: usePermission("absence.read"),
    employee: usePermission("user.read"),
    payroll: usePermission("payroll.read"),
    attendance: usePermission("attendance.read"),
    qr: usePermission("qr.read"),
    settings: usePermission("setting.read"),
  };

  useEffect(() => {
    const pathToItem = {
      "/dashboard": "dashboard",
      "/message": "message",
      "/payroll": "payroll",
      "/calendar": "calendar",
      "/employee": "employee",
      "/attendance": "attendance",
      "/overtime": "overtime",
      "/absense": "absense",
      "/settings": "settings",
      "/qrscanner": "qrscanner",
    };
    setSelectedItem(pathToItem[location.pathname] || "");
  }, [location.pathname]);

  const toggleMenu = (item, path) => {
    setSelectedItem(item);

    if (item === "qrscanner") {
      window.open(path, "_blank");
      return;
    }
    navigate(path);
  };

  const renderMenuItem = (label, icon, key, path, newTab = false) => {
    const perm = permissions[key];
    if (perm.loading) return null;
    if (!perm.hasPermission) return null;

    return (
      <div className="flex" key={key}>
        <li
          className={`flex items-center w-[210px] rounded-[8px] h-[45px] cursor-pointer transition-transform duration-300 ${
            selectedItem === key
              ? "bg-[#2EB67D] text-white translate-x-2"
              : "bg-white text-[#979797]"
          }`}
          onClick={() => {
            setSelectedItem(key);
            if (newTab) {
              window.open(path, "_blank", "noopener,noreferrer");
            } else {
              navigate(path);
            }
          }}
        >
          {icon}
          {label}
        </li>
      </div>
    );
  };

  return (
    <div className="w-[250px] min-w-[250px] h-screen font-sans flex flex-col justify-between items-center text-[14px] caret-transparent">
      <div className="w-full flex flex-col items-start px-[10px]">
        <div>
          <img
            alt="logo"
            src="src/assets/logoapp.png"
            className="w-[80%] h-auto object-contain ml-5 mt-2"
          />
        </div>

        <div className="mt-2 ml-[10px]">
          <p className="flex font-bold">MENU</p>
          <ul className="flex flex-col mt-[5%]">
            {renderMenuItem(
              "Dashboard",
              <HiOutlineSquares2X2 className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "dashboard",
              "/dashboard"
            )}
            {renderMenuItem(
              "Message",
              <BiMessageRounded className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "message",
              "/message"
            )}
            {renderMenuItem(
              "Calendar",
              <IoCalendarOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "calendar",
              "/calendar"
            )}
            {renderMenuItem(
              "Overtime",
              <IoTimeOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "overtime",
              "/overtime"
            )}
            {renderMenuItem(
              "Absence",
              <IoCloseCircleOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "absence",
              "/absense"
            )}
          </ul>
        </div>

        <div className="mt-[10%] ml-[10px]">
          <p className="flex font-bold">ORGANIZATION</p>
          <ul className="flex flex-col mt-[5%]">
            {renderMenuItem(
              "Employee",
              <HiOutlineUserGroup className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "employee",
              "/employee"
            )}
            {renderMenuItem(
              "Payroll",
              <CiDollar className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "payroll",
              "/payroll"
            )}
            {renderMenuItem(
              "Attendance",
              <HiOutlineDocumentCheck className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "attendance",
              "/attendance"
            )}
            {renderMenuItem(
              "QR Scanner",
              <HiOutlineDocumentCheck className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />,
              "qr",
              "/qrscanner",
              true
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-between border-[#B8BDC5] border-2 rounded-[10px] mb-[5%]">
        {!permissions.settings.loading &&
          permissions.settings.hasPermission && (
            <li
              className="flex items-center w-[210px] rounded-[8px] h-[45px] cursor-pointer text-[#979797]"
              onClick={() => toggleMenu("setting", "/settings")}
            >
              <IoSettingsOutline className="h-[25px] w-[25px] mr-[20px] ml-[20px]" />
              Settings
            </li>
          )}
      </div>
    </div>
  );
};

export default Slidebar;
