import { useState, useEffect } from "react";
import TabSelector from "../components/TabSelector";
import { useNavigate } from "react-router-dom";
import UsePermission from "../components/UsePermission";
import SettingRole from "../components/SettingRole";
import SettingDepartment from "../components/SettingDepartment";
import SettingJobtitle from "../components/SettingJobtitle";
import SettingPermission from "../components/SettingPermission";
import SettingHoliday from "../components/SettingHoliday";

const Setting = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("setting.read");
  const { hasPermission: canReadRole } = UsePermission("setting.read.role");
  const { hasPermission: canReadPermission } = UsePermission(
    "setting.read.permission"
  );
  const { hasPermission: canReadDepartment } = UsePermission(
    "setting.read.department"
  );
  const { hasPermission: canReadJobTitle } = UsePermission(
    "setting.read.jobtitle"
  );
  const { hasPermission: canReadHoliday } = UsePermission(
    "setting.read.holiday"
  );

  const [selectedTab, setSelectedTab] = useState("role");

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  const hasAnySettingPermission =
    canReadRole ||
    canReadPermission ||
    canReadDepartment ||
    canReadJobTitle ||
    canReadHoliday;

  if (!hasAnySettingPermission) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="text-[30px] font-light"
      >{`You don't have the required permissions to view any of the settings sections.`}</div>
    );
  }

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <TabSelector
          tabs={[
            canReadRole && { key: "role", label: "Setting Role" },
            canReadPermission && {
              key: "permission",
              label: "Setting Permission",
            },
            canReadDepartment && {
              key: "department",
              label: "Setting Department",
            },
            canReadJobTitle && { key: "job", label: "Setting Job Title" },
            canReadHoliday && { key: "holiday", label: "Setting Holiday" },
          ].filter(Boolean)}
          selectedTab={selectedTab}
          onTabSelect={(key) => setSelectedTab(key)}
          wrapperClassName="gap-10 md:gap-10 text-[#1C1C1C] ml-7"
        />
      </div>
      {selectedTab === "role" && <SettingRole />}
      {selectedTab === "permission" && <SettingPermission />}
      {selectedTab === "department" && <SettingDepartment />}
      {selectedTab === "job" && <SettingJobtitle />}
      {selectedTab === "holiday" && <SettingHoliday />}
    </div>
  );
};

export default Setting;
