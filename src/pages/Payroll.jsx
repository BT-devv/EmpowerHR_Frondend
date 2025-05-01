import { useState, useEffect } from "react";
import Modal from "react-modal";
import TabSelector from "../components/TabSelector";
import { useNavigate } from "react-router-dom";
import UsePermission from "../components/UsePermission";
// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";

Modal.setAppElement("#root");
const Payroll = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("payroll.read");

  const [selectedTab, setSelectedTab] = useState("payroll");
  const [selectedTab2, setSelectedTab2] = useState("base");
  const [modalSalaryIsOpen, setModalSalaryIsOpen] = useState(false);
  const [modalBaseIsOpen, setModalBaseIsOpen] = useState(false);
  const [modalDeductionIsOpen, setModalDeductionIsOpen] = useState(false);

  const [moreOptions1, setMoreOptions1] = useState(null);
  const [moreOptions2, setMoreOptions2] = useState(null);
  const [moreOptions4, setMoreOptions4] = useState(null);

  const closeModalSalary = () => {
    setModalSalaryIsOpen(false);
  };
  const closeModalBase = () => {
    setModalBaseIsOpen(false);
  };
  const closeModalDeduction = () => {
    setModalDeductionIsOpen(false);
  };

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <TabSelector
          tabs={[
            { key: "payroll", label: "Payroll" },
            { key: "payitems", label: "Pay Items" },
            { key: "payslip", label: "Pay Slip" },
          ]}
          selectedTab={selectedTab}
          onTabSelect={(key) => setSelectedTab(key)}
          wrapperClassName="gap-10 md:gap-10 text-[#1C1C1C] ml-7"
        />
      </div>

      {selectedTab === "payroll" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            {/* Overtime Request Title */}
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                Employee Salary List
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

            {/* Filter Button */}
            <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
              <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
              <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
                Filter
              </div>
            </div>

            {/* Add Salary */}
            <div className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
              <p>Add Salary</p>
            </div>
          </div>
          {/* List */}
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
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Email
                  </th>
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Department
                  </th>
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Employee Type
                  </th>
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Joining Date
                  </th>
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Salary
                  </th>
                  <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]">
                  <td className="px-1 py-6 border-b border-gray-200 text-left w-[12%]">
                    sdvsv
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[25%]">
                    csdcsc
                  </td>

                  <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[20%]">
                    vdfvdfv
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 w-[15%]">
                    vdfvdfv
                  </td>
                  <td className="px-35 py-6 border-b border-gray-200 w-[15%]">
                    vdfvdfv
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 w-[15%]">
                    vdfvdfv
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 text-center w-[15%]">
                    vdfvdfv
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer">
                    <HiOutlineDotsHorizontal
                      className="text-[23px]"
                      onClick={() => {
                        setMoreOptions1(moreOptions1 === 1 ? null : 1);
                      }}
                    />
                  </td>
                  {moreOptions1 === 1 && (
                    <div
                      className="absolute bg-white right-5 z-10 mt-2 w-[200%] origin-top-right rounded-[20px] focus:outline-none font-normal"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                    >
                      <div className="absolute right-3 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                        <div className="flex flex-col divide-y divide-gray-200">
                          {/* View Detail */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setMoreOptions1(null);
                              // setSelectedEmployee(item);
                              setModalSalaryIsOpen(true);
                            }}
                            className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                            <span>View detail</span>
                          </div>
                          {/* Delete */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setMoreOptions1(null);
                              // verifyDelete(item._id);
                            }}
                            className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <IoTrashBinOutline className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                            <span>Delete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <Modal
                    isOpen={modalSalaryIsOpen}
                    onRequestClose={() => setModalSalaryIsOpen(false)}
                    shouldCloseOnOverlayClick={false}
                    className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                    overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
                  >
                    <div className="flex flex-col mt-[-5%] ml-[-5%]">
                      <div className="flex items-center mb-2">
                        <IoIosArrowRoundBack
                          className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                          onClick={closeModalSalary}
                        />
                        <p className="text-[20px] font-bold ">
                          Edit Salary Employee
                        </p>
                      </div>
                      <div className="bg-gray-200 w-[120%] h-0.5 mt-[1%] mb-[1%] ml-[-10%]"></div>
                    </div>
                    <div>
                      <div className="flex space-x-14 mt-3">
                        <div>
                          <p>Employee Name</p>
                          <input
                            type="text"
                            name="firstName"
                            value="Bui Trung Tuan"
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                        <div>
                          <p>Net Salary</p>
                          <input
                            type="text"
                            name="firstName"
                            value="10,000,000 VND"
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <p className="font-bold">Earning</p>
                        <p className="text-[#09C06C] cursor-pointer caret-transparent">
                          + Add New
                        </p>
                      </div>
                      <div className="flex space-x-14 mt-3">
                        <div>
                          <p>Basic Salary</p>
                          <input
                            type="text"
                            name="firstName"
                            value="10,000,000 VND"
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                        <div>
                          <p>Overtime (OT)</p>
                          <input
                            type="text"
                            name="firstName"
                            value=""
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <p className="font-bold">Deduct</p>
                        <p className="text-[#09C06C] cursor-pointer caret-transparent">
                          + Add New
                        </p>
                      </div>
                      <div className="flex space-x-14 mt-3">
                        <div>
                          <p>Unpaid leave</p>
                          <input
                            type="text"
                            name="firstName"
                            value="Bui Trung Tuan"
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                        <div>
                          <p>Personal Income Tax</p>
                          <input
                            type="text"
                            name="firstName"
                            value=""
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                      </div>
                      <div className="flex space-x-14 mt-5">
                        <div>
                          <p>Salary Advance</p>
                          <input
                            type="text"
                            name="firstName"
                            value="Bui Trung Tuan"
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                        <div>
                          <p>Salary Subtraction</p>
                          <input
                            type="text"
                            name="firstName"
                            value="10,000,000 VND"
                            className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                          />
                        </div>
                      </div>
                    </div>
                  </Modal>
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

      {selectedTab === "payitems" && (
        <>
          <TabSelector
            tabs={[
              { key: "base", label: "Base Salary" },
              { key: "additional", label: "Additional" },
              { key: "deduction", label: "Deduction" },
            ]}
            selectedTab={selectedTab2}
            onTabSelect={(key) => setSelectedTab2(key)}
            type="button"
            wrapperClassName="flex gap-10 md:gap-5 text-[#1C1C1C] ml-[3%] mt-[2%] text-center"
          />

          {selectedTab2 === "base" && (
            <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
                <div>
                  <p className="text-[#252C58] text-[20px] font-light">
                    Base Salary List
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

                {/* Filter Button */}
                <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
                  <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
                  <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
                    Filter
                  </div>
                </div>

                {/* Add Salary */}
                <div className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
                  <p>Add Item</p>
                </div>
              </div>
              {/* List */}
              <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
                <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                  <thead>
                    <tr className="border-gray-300 border-t border-b-2 text-left">
                      <th className="px-1 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        No
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Name
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Department
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Job Type
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Amount
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Unit
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px] font-bold">
                      <td className="px-1 py-6 border-b border-gray-200 text-left w-[10%]">
                        1
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[20%]">
                        base salary
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 w-[25%] text-left">
                        Front end
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 w-[15%] text-left">
                        Intern
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 w-[15%] text-left">
                        3.000.000
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 w-[15%] text-left">
                        VNĐ
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          onClick={() => {
                            setMoreOptions2(moreOptions2 === 1 ? null : 1);
                          }}
                        />
                      </td>
                      {moreOptions2 === 1 && (
                        <div
                          className="absolute bg-white right-5 z-10 mt-2 w-[200%] origin-top-right rounded-[20px] focus:outline-none font-normal"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                        >
                          <div className="absolute right-3 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                            <div className="flex flex-col divide-y divide-gray-200">
                              {/* View Detail */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMoreOptions2(null);
                                  // setSelectedEmployee(item);
                                  setModalBaseIsOpen(true);
                                }}
                                className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                <span>View detail</span>
                              </div>

                              {/* Delete */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMoreOptions2(null);
                                  // verifyDelete(item._id);
                                }}
                                className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                <IoTrashBinOutline className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                <span>Delete</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <Modal
                        isOpen={modalBaseIsOpen}
                        onRequestClose={() => setModalBaseIsOpen(false)}
                        shouldCloseOnOverlayClick={false}
                        className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                        overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
                      >
                        <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                          <div className="flex items-center mb-2">
                            <IoIosArrowRoundBack
                              className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                              onClick={closeModalBase}
                            />
                            <p className="text-[20px] font-bold ">
                              Edit Base Salary
                            </p>
                          </div>
                          <div className="bg-gray-200 w-[120%] h-0.5 mt-[1%] mb-[1%] ml-[-10%]"></div>
                        </div>
                        <div>
                          <div className="flex space-x-14 mt-3">
                            <div>
                              <p>Name</p>
                              <input
                                type="text"
                                name="firstName"
                                value=""
                                placeholder="Input name"
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                            <div>
                              <p>Net Salary</p>
                              <input
                                type="text"
                                name="firstName"
                                placeholder="Select Department"
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                          <div className="flex space-x-14 mt-3">
                            <div>
                              <p>Job Title</p>
                              <input
                                type="text"
                                name="firstName"
                                placeholder="Select Job Title"
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                            <div>
                              <p>Amount</p>
                              <input
                                type="text"
                                name="firstName"
                                placeholder="Input Amount"
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                          <div className="flex space-x-14 mt-3">
                            <div>
                              <p>Unit</p>
                              <input
                                type="text"
                                name="firstName"
                                placeholder="Select Unit"
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                        </div>
                      </Modal>
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

          {selectedTab2 === "deduction" && (
            <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-[77%] ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
              <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
                {/* Overtime Request Title */}
                <div>
                  <p className="text-[#252C58] text-[20px] font-light">
                    Deduction List
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

                {/* Filter Button */}
                <div className="relative flex items-center min-w-[100px] sm:min-w-[120px]">
                  <BiFilterAlt className="absolute left-4 w-[20px] h-[20px] text-[#2EB67D]" />
                  <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 text-[#252C5880] text-[15px] flex items-center font-light">
                    Filter
                  </div>
                </div>

                {/* Add Item */}
                <div className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
                  <p>Add Item</p>
                </div>
              </div>
              {/* List */}
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
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Email
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Department
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Employee Type
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Joining Date
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Salary
                      </th>
                      <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px] font-bold">
                      <td className="px-1 py-6 border-b border-gray-200 text-left w-[12%]">
                        sdvsv
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[25%]">
                        csdcsc
                      </td>

                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[20%]">
                        vdfvdfv
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 w-[15%]">
                        vdfvdfv
                      </td>
                      <td className="px-35 py-6 border-b border-gray-200 w-[15%]">
                        vdfvdfv
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 w-[15%]">
                        vdfvdfv
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 text-center w-[15%]">
                        vdfvdfv
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          onClick={() => {
                            setMoreOptions4(moreOptions4 === 1 ? null : 1);
                          }}
                        />
                      </td>
                      {moreOptions4 === 1 && (
                        <div
                          className="absolute bg-white right-5 z-10 mt-2 w-[200%] origin-top-right rounded-[20px] focus:outline-none font-normal"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                        >
                          <div className="absolute right-3 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                            <div className="flex flex-col divide-y divide-gray-200">
                              {/* View Detail */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMoreOptions4(null);
                                  // setSelectedEmployee(item);
                                  setModalDeductionIsOpen(true);
                                }}
                                className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                <span>View detail</span>
                              </div>

                              {/* Delete */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMoreOptions4(null);
                                  // verifyDelete(item._id);
                                }}
                                className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                <IoTrashBinOutline className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                                <span>Delete</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <Modal
                        isOpen={modalDeductionIsOpen}
                        onRequestClose={() => setModalDeductionIsOpen(false)}
                        shouldCloseOnOverlayClick={false}
                        className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                        overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
                      >
                        <div className="flex flex-col mt-[-5%] ml-[-5%]">
                          <div className="flex items-center m">
                            <IoIosArrowRoundBack
                              className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                              onClick={closeModalDeduction}
                            />
                            <p className="text-[20px] font-bold ">
                              Edit Salary Employee
                            </p>
                          </div>
                          <div className="bg-gray-200 w-[120%] h-0.5 mt-[1%] mb-[1%] ml-[-10%]"></div>
                        </div>
                        <div>
                          <div className="flex space-x-14 mt-3">
                            <div>
                              <p>Name</p>
                              <input
                                type="text"
                                name="firstName"
                                placeholder="Input name"
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                            <div>
                              <div>
                                <p>Amount</p>
                                <input
                                  type="text"
                                  name="firstName"
                                  placeholder="Input amount"
                                  className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-14 mt-3">
                            <div>
                              <p>Unit</p>
                              <input
                                type="text"
                                name="firstName"
                                placeholder="Select Unit"
                                className="border border-gray-300 rounded-md p-3 w-full mt-2 "
                              />
                            </div>
                          </div>
                        </div>
                      </Modal>
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
        </>
      )}
    </div>
  );
};

export default Payroll;
