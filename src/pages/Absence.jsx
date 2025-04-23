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
import Modal from "react-modal";
// icon
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineNotInterested } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";

const Absence = () => {
  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [selectedTab, setSelectedTab] = useState("absence");
  const [reason, setReason] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [reasonReject, setReasonReject] = useState("");
  const [reasonBorder, setReasonBorder] = useState(false);
  const [reasonError, setReasonError] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isModalReject, setIsModalReject] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [type, setType] = useState("Select Type");
  const typeData = ["Full Day", "Half Day", "Leave Desk"];

  const [data, setData] = useState([]);
  const [dataPending, setDataPending] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  // Get all pending
  useEffect(() => {
    axios
      .get(apiRoutes.absence.listPending, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataPending(response.data.absences);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all history
  useEffect(() => {
    axios
      .get(apiRoutes.absence.history, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDataHistory(response.data.absences);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // button reject
  const handleReject = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (!reasonReject) {
      setReasonError("Reason is required.");
      isValid = false;
      setReasonBorder(true);
    } else {
      setReasonError("");
      setReasonBorder(false);
    }
    if (!isValid) {
      return;
    }
    const token = localStorage.getItem("token");
    const data = {
      absenceID: selectedEmployee._id,
      status: updateStatus,
      rejectReason: reasonReject,
    };

    try {
      const response = await axios.post(apiRoutes.absence.updateStatus, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const { success, message } = response.data;
      alert(response.data.absence);
      if (success) {
        Swal.fire({
          text: message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          setIsModalReject(false), setIsDetailModalOpen(false);
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
          icon: "error",
        });
      }
    }
  };

  const handleApprove = async () => {
    const token = localStorage.getItem("token");
    const data = {
      absenceID: selectedEmployee._id,
      status: updateStatus,
    };
    try {
      const response = await axios.post(apiRoutes.absence.updateStatus, data, {
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
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          setIsModalReject(false), setIsDetailModalOpen(false);
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
          icon: "error",
        });
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleApproveClick = () => {
    setUpdateStatus("Approved");
    handleApprove();
  };

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <div className="flex gap-10 md:gap-10 text-[#1C1C1C] ml-7">
          {[
            { key: "absence", label: "Absence Form" },
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
        <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[10px] w-[calc(100vw-340px)] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] mb-[2%]">
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
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] mb-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            {/* Overtime Request Title */}
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                Overtime Request
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
          {/* List */}
          {dataPending.length > 0 ? (
            <div className="mt-[20px] text-[14px] ml-[15px]">
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
                      Date
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Status
                    </th>
                    <th className="px-14 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Absence
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataPending.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                    >
                      <td className="px-1 py-6 border-b border-gray-200 text-left w-[12%]">
                        {item.employeeID}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[25%]">
                        {item.name}
                      </td>

                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[20%]">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-3 py-6 border-b border-gray-200 w-[15%]">
                        <div
                          className={`text-center p-4 border rounded-md w-fit h-[40px] flex items-center justify-center ${
                            item.status === "Pending"
                              ? "text-[#0764E6] bg-[#E6EFFC]"
                              : ""
                          } ${
                            item.status === "Rejected"
                              ? "text-[#AA0000] bg-[#FFE5EE]"
                              : ""
                          } ${
                            item.status === "Approved"
                              ? "text-[#D5B500] bg-[#FFF8E7]"
                              : ""
                          }`}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="px-3 py-6 border-b border-gray-200 text-center w-[15%]">
                        {item.type}
                      </td>
                      <td className="px-3 py-6 border-b border-gray-200">
                        <div className="flex justify-center items-center space-x-3 text-left w-[130px] ">
                          <div
                            className="bg-[#FFF8E7] w-[30%] rounded-[6px] p-2 cursor-pointer"
                            onClick={() => {
                              handleApproveClick(), setSelectedEmployee(item);
                            }}
                          >
                            <MdOutlineDone className="w-[20px] h-[20px] text-[#D5B500]" />
                          </div>
                          <div
                            className="bg-[#FFE5EE] w-[30%] rounded-[6px] p-2 cursor-pointer"
                            onClick={() => (
                              setIsModalReject(true),
                              setSelectedEmployee(item),
                              setUpdateStatus("Rejected")
                            )}
                          >
                            <MdOutlineNotInterested className="w-[20px] h-[20px] text-[#AA0000]" />
                          </div>
                          <div
                            className="bg-[#D8DDE3] w-[30%] rounded-[6px] p-2 cursor-pointer"
                            onClick={() => (
                              setSelectedEmployee(item),
                              setIsDetailModalOpen(true)
                            )}
                          >
                            <IoEyeOutline className="w-[20px] h-[20px] text-[#727C9A]" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedEmployee && (
                <Modal
                  isOpen={isDetailModalOpen}
                  onRequestClose={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setIsAnimating(false);
                      setIsDetailModalOpen(false);
                    }, 500);
                  }}
                  contentLabel="Employee Details"
                  shouldCloseOnOverlayClick={false}
                  className={`bg-white rounded-tl-[20px] border-l-2 border-t-2 border-gray-200 w-[30%] h-[92%] mt-[4%] flex flex-col ${
                    isAnimating
                      ? "animate-slideOutToRight"
                      : "animate-slideInFromRight"
                  }`}
                  overlayClassName="fixed inset-0 bg-opacity-50 flex justify-end items-center "
                >
                  <div className="flex p-3 ml-[2%]">
                    <div className="flex justify-between">
                      <IoIosArrowRoundBack
                        className="w-[40px] h-[40px] cursor-pointer mt-[2%]"
                        onClick={() => {
                          setIsAnimating(true);
                          setTimeout(() => {
                            setIsAnimating(false);
                            setIsDetailModalOpen(false);
                          }, 500);
                        }}
                      />
                    </div>
                    <p className="mt-[2%] ml-[2%] font-bold">Detail Request</p>
                  </div>

                  <div className="bg-gray-100 w-[100%] h-0.5 mt-[1%] mb-[1%] "></div>

                  <div className="text-[14px] flex-grow ml-[10%]">
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">ID Employee:</p>
                      <p className="w-2/3">{selectedEmployee.employeeID}</p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Employee:</p>
                      <p className="w-2/3">{selectedEmployee.name}</p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Line Manager:</p>
                      <p className="w-2/3">
                        {selectedEmployee.projectManager || "---"}
                      </p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Type Absence:</p>
                      <p className="w-2/3">{selectedEmployee.type}</p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Time:</p>
                      <p className="w-2/3">
                        {formatDate(selectedEmployee.dateFrom)}{" "}
                        <span className="ml-[5%] mr-[5%]">-</span>
                        {formatDate(selectedEmployee.dateTo)}
                      </p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Reason:</p>
                      <p className="w-2/3">{selectedEmployee.reason}</p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Status:</p>
                      <p
                        className={`w-2/3 ${
                          selectedEmployee.status === "Pending"
                            ? "text-[#0764E6]"
                            : ""
                        } ${
                          selectedEmployee.status === "Rejected"
                            ? "text-[#AA0000]"
                            : ""
                        } ${
                          selectedEmployee.status === "Approved"
                            ? "text-[#D5B500]"
                            : ""
                        }`}
                      >
                        {selectedEmployee.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto bg-gray-200 w-full h-0.5"></div>
                  <div className="flex justify-end p-4">
                    <button
                      className="bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border border-[#C5C5C5]"
                      onClick={() => (
                        setIsModalReject(true), setUpdateStatus("Rejected")
                      )}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border border-[#C5C5C5] ml-4"
                      onClick={handleApproveClick}
                    >
                      Approve
                    </button>
                  </div>
                </Modal>
              )}
              {isModalReject && (
                <Modal
                  isOpen={isModalReject}
                  onRequestClose={() => setIsModalReject(false)}
                  contentLabel="Reason Reject"
                  shouldCloseOnOverlayClick={false}
                  className="bg-white rounded-[20px] border-gray-200 w-[35%] h-[35%] mt-[4%] flex flex-col justify-center items-center"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center "
                >
                  <p className="text-[30px] mt-2 font-semibold text-center text-[#FF6060]">
                    Reason
                  </p>

                  <input
                    type="reasonReject"
                    placeholder="Enter Reason"
                    value={reasonReject}
                    className={`text-black border-2 border-gray-200 h-[55px] rounded-[8px] w-[80%] px-[15px] mt-[5%] cursor-text outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] focus:border-2 hover:border-2 ${
                      reasonBorder ? "border-[2px] border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      setReasonReject(e.target.value);
                    }}
                  />
                  {reasonError && (
                    <p className=" text-red-500 text-[15px] text-left mt-2 caret-transparent">
                      {reasonError}
                    </p>
                  )}

                  <div className="flex justify-center p-4 mt-[2%]">
                    <button
                      className="bg-white text-[#FF6262] w-[150px] h-[45px] rounded-[10px] border border-[#C5C5C5]"
                      onClick={() => {
                        setIsModalReject(false);
                        setReasonError("");
                        setReasonBorder(false);
                        setReasonReject("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-[#FF0058] text-white w-[150px] h-[45px] rounded-[10px] border border-[#C5C5C5] ml-4"
                      onClick={handleReject}
                    >
                      Reject
                    </button>
                  </div>
                </Modal>
              )}
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
              <button className="text-white font-normal mt-[10%] h-[50px] w-[180px] rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 focus:outline-none hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]">
                + Employee
              </button>
            </div>
          )}

          {/* page */}
          <div className="mt-auto font-light text-[#252C58] text-[14px] ml-[1%]">
            Page 1 of 100
          </div>
        </div>
      )}
      {selectedTab === "history" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] mb-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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
          {/* List */}
          {dataHistory.length > 0 ? (
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
                      Date
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Status
                    </th>
                    <th className="px-14 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Absence
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataHistory.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                    >
                      <td className="px-1 py-6 border-b border-gray-200 text-left w-[12%]">
                        {item.employeeID}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200  truncate text-left w-[25%]">
                        {item.name}
                      </td>

                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[20%]">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-3 py-6 border-b border-gray-200 w-[15%]">
                        <div
                          className={`text-center p-4 border rounded-md w-fit h-[40px] flex items-center justify-center ${
                            item.status === "Pending"
                              ? "text-[#0764E6] bg-[#E6EFFC]"
                              : ""
                          } ${
                            item.status === "Rejected"
                              ? "text-[#AA0000] bg-[#FFE5EE]"
                              : ""
                          } ${
                            item.status === "Approved"
                              ? "text-[#D5B500] bg-[#FFF8E7]"
                              : ""
                          }`}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="px-3 py-6 border-b border-gray-200 text-center w-[15%]">
                        {item.type}
                      </td>
                      <td className="px-3 py-6 border-b border-gray-200 w-[-15%]">
                        <div className="flex items-center space-x-3 text-left w-[130px] ">
                          <div
                            className="bg-[#D8DDE3] w-[30%] rounded-[6px] p-2 cursor-pointer ml-[10%]"
                            onClick={() => (
                              setSelectedEmployee(item),
                              setIsDetailModalOpen(true)
                            )}
                          >
                            <IoEyeOutline className="w-[20px] h-[20px] text-[#727C9A]" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedEmployee && (
                <Modal
                  isOpen={isDetailModalOpen}
                  onRequestClose={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setIsAnimating(false);
                      setIsDetailModalOpen(false);
                    }, 500);
                  }}
                  contentLabel="Employee Details"
                  shouldCloseOnOverlayClick={false}
                  className={`bg-white rounded-tl-[20px] border-l-2 border-t-2 border-gray-200 w-[30%] h-[92%] mt-[4%] flex flex-col ${
                    isAnimating
                      ? "animate-slideOutToRight"
                      : "animate-slideInFromRight"
                  }`}
                  overlayClassName="fixed inset-0 bg-opacity-50 flex justify-end items-center"
                >
                  <div className="flex p-3 ml-[2%]">
                    <div className="flex justify-between">
                      <IoIosArrowRoundBack
                        className="w-[40px] h-[40px] cursor-pointer mt-[2%]"
                        onClick={() => {
                          setIsAnimating(true);
                          setTimeout(() => {
                            setIsAnimating(false);
                            setIsDetailModalOpen(false);
                          }, 500);
                        }}
                      />
                    </div>
                    <p className="mt-[2%] ml-[2%] font-bold">Detail Request</p>
                  </div>

                  <div className="bg-gray-100 w-[100%] h-0.5 mt-[1%] mb-[1%] "></div>

                  <div className="text-[14px] flex-grow ml-[10%] caret-transparent">
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">ID Employee:</p>
                      <p className="w-2/3">{selectedEmployee.employeeID}</p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Employee:</p>
                      <p className="w-2/3">{selectedEmployee.name}</p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Line Manager:</p>
                      <p className="w-2/3">
                        {selectedEmployee.projectManager || "---"}
                      </p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Date:</p>
                      <p className="w-2/3">
                        {formatDate(selectedEmployee.createdAt)}
                      </p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Time:</p>
                      <p className="w-2/3">
                        {formatDate(selectedEmployee.dateFrom)}{" "}
                        <span className="ml-[5%] mr-[5%]">-</span>
                        {formatDate(selectedEmployee.dateTo)}
                      </p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Reason:</p>
                      <p className="w-2/3">{selectedEmployee.reason}</p>
                    </div>
                    <div className="flex mt-[8%]">
                      <p className="font-bold w-1/3">Status:</p>
                      <p
                        className={`w-2/3 ${
                          selectedEmployee.status === "Pending"
                            ? "text-[#0764E6]"
                            : ""
                        } ${
                          selectedEmployee.status === "Rejected"
                            ? "text-[#AA0000]"
                            : ""
                        } ${
                          selectedEmployee.status === "Approved"
                            ? "text-[#D5B500]"
                            : ""
                        }`}
                      >
                        {selectedEmployee.status}
                      </p>
                    </div>
                    {selectedEmployee.status === "Rejected" ? (
                      <div className="flex flex-col mt-[8%] h-full">
                        <p className="font-bold w-1/3">Reason of Rejcted:</p>
                        <p className="bg-gray-200 rounded-[10px] h-[20%] p-3 w-[90%] mt-[2%] ">
                          {selectedEmployee.rejectReason}
                        </p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </Modal>
              )}
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
          <div className="mt-auto font-light text-[#252C58] text-[14px] ml-[1%]">
            Page 1 of 100
          </div>
        </div>
      )}
    </div>
  );
};

export default Absence;
