import PaginationFooter from "../components/PaginationFooter";
import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import { format } from "date-fns";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

// icon
import { CiSearch } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineNotInterested } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
const OvertimeApproval = () => {
  const [progress, setProgress] = useState(false);

  const currentDate = format(new Date(), "dd MMM, yyyy");
  const [isModalReject, setIsModalReject] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [data, setData] = useState([]);
  const [dataPending, setDataPending] = useState([]);
  const [updateStatus, setUpdateStatus] = useState("");
  const [reasonReject, setReasonReject] = useState("");
  const [reasonBorder, setReasonBorder] = useState(false);
  const [reasonError, setReasonError] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  // Get all pending
  const fetchPending = () => {
    if (!data) return;
    axios
      .get(apiRoutes.overtime.listPending, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
        const allRequests = response.data.data;
        const filtered = allRequests.filter(
          (req) => req.projectManager === decodedToken.employeeID
        );
        setDataPending(filtered);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsPending = dataPending.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // convert hours
  const convertToHoursMinutes = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    if (hours === 0) return `${minutes}m`; // Nếu giờ = 0, chỉ hiển thị phút
    if (minutes === 0) return `${hours}h`;

    return `${hours}h ${minutes < 10 ? "0" : ""}${minutes}m`;
  };

  const handleApproveClick = () => {
    setUpdateStatus("Approved");
    handleApprove();
  };
  const handleApprove = async () => {
    const data = {
      overtimeID: selectedEmployee._id,
      status: updateStatus,
    };
    setProgress(true);
    try {
      const response = await axios.put(apiRoutes.overtime.updateStatus, data, {
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
        fetchPending();
        setIsModalReject(false);
        setIsDetailModalOpen(false);
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
    } finally {
      setProgress(false);
    }
  };
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
    const data = {
      overtimeID: selectedEmployee._id,
      status: updateStatus,
      rejectReason: reasonReject,
    };
    setProgress(true);
    try {
      const response = await axios.put(apiRoutes.overtime.updateStatus, data, {
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
        fetchPending();
        setIsModalReject(false);
        setIsDetailModalOpen(false);
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
    } finally {
      setProgress(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] mb-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)] ">
      {progress && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress size={80} style={{ color: "#069855" }} />
        </div>
      )}
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
                  Overtime
                </th>
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItemsPending.map((item) => (
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
                    {formatDate(item.date)}
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
                    {convertToHoursMinutes(item.duration)}
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
                          setIsModalReject(true), setUpdateStatus("Rejected")
                        )}
                      >
                        <MdOutlineNotInterested className="w-[20px] h-[20px] text-[#AA0000]" />
                      </div>
                      <div
                        className="bg-[#D8DDE3] w-[30%] rounded-[6px] p-2 cursor-pointer"
                        onClick={() => (
                          setSelectedEmployee(item), setIsDetailModalOpen(true)
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
                  <p className="font-bold w-1/3">Date:</p>
                  <p className="w-2/3">{formatDate(selectedEmployee.date)}</p>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Time:</p>
                  <p className="w-2/3">
                    {selectedEmployee.startTime} - {selectedEmployee.endTime}
                  </p>
                </div>
                <div className="flex mt-[8%]">
                  <p className="font-bold w-1/3">Reason:</p>
                  <div
                    className="w-2/3 prose"
                    dangerouslySetInnerHTML={{
                      __html: selectedEmployee.reason,
                    }}
                  ></div>
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
            <p className="font-bold">No Overtime Requests</p>
            <p>There are no pending overtime requests assigned to you.</p>
          </div>
        </div>
      )}

      {/* infor bottom */}
      <PaginationFooter
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={dataPending.length}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};
export default OvertimeApproval;
