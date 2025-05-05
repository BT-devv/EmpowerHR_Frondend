import { useState, useEffect } from "react";
import TabSelector from "../components/TabSelector";
import { useNavigate } from "react-router-dom";
import UsePermission from "../components/UsePermission";
import OvertimeApproval from "../components/OvertimeApproval";
import OvertimeForm from "../components/OvertimeForm";
import OvertimeHistory from "../components/OvertimeHistory";

const Overtime = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("overtime.read");
  const [selectedTab, setSelectedTab] = useState("overtime");

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center ">
        <TabSelector
          tabs={[
            { key: "overtime", label: "Overtime Form" },
            { key: "approval", label: "Approval Manager" },
            { key: "history", label: "History" },
          ]}
          selectedTab={selectedTab}
          onTabSelect={(key) => setSelectedTab(key)}
          wrapperClassName="gap-10 md:gap-10 text-[#1C1C1C] ml-7"
        />
      </div>
      {selectedTab === "overtime" && <OvertimeForm />}

      {selectedTab === "approval" && <OvertimeApproval />}
      {selectedTab === "history" && <OvertimeHistory />}
    </div>
  );
};

export default Overtime;
