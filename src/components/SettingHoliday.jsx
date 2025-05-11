import PaginationFooter from "./PaginationFooter";
import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import Modal from "react-modal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";

const SettingHoliday = () => {
  const [moreOptions4, setMoreOptions4] = useState(null);
  const [modalAddHoliday, setModalAddHoliday] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [modalEditHoliday, setModalEditHoliday] = useState(false);

  const [progress, setProgress] = useState(false);

  const closeModalAddHoliday = () => {
    setModalAddHoliday(false);
    setNameHoliday("");
    setStartHoliday(null);
    setEndHoliday(null);
  };
  const [holiday, setHoliday] = useState([]);

  const [nameHoliday, setNameHoliday] = useState("");
  // const [errors6, setErrors6] = useState("");
  const [startHoliday, setStartHoliday] = useState(null);
  // const [errors7, setErrors7] = useState("");
  const [endHoliday, setEndHoliday] = useState(null);
  // const [errors8, setErrors8] = useState("");
  const [errors3, setErrors3] = useState("");
  const [errors5, setErrors5] = useState("");

  const token = localStorage.getItem("token");

  // Get all holiday
  const fetchHoliday = () => {
    axios
      .get(apiRoutes.holiday.getAllHolidays)
      .then((response) => {
        setHoliday(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  };

  // Add holiday
  const handleCreateHoliday = async () => {
    let isValid = true;

    if (!nameHoliday) {
      setErrors3("Name is required.");
      isValid = false;
    } else {
      setErrors3("");
    }

    if (!startHoliday) {
      setErrors5("Start Holiday is required.");
      isValid = false;
    } else {
      setErrors5("");
    }

    if (!endHoliday) {
      setErrors5("End Date is required.");
      isValid = false;
    } else {
      setErrors5("");
    }

    if (!isValid) return;

    setProgress(true);

    try {
      const response = await axios.post(
        apiRoutes.holiday.createHoliday,
        {
          name: nameHoliday,
          startDate: startHoliday,
          endDate: endHoliday,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          text: "Add Holiday Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchHoliday();
        setModalAddHoliday(false);
      } else {
        Swal.fire({
          text: "Add Holiday Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } finally {
      setProgress(false);
    }
  };

  useEffect(() => {
    fetchHoliday();
  }, []);

  // Edit holiday
  const handleEditHoliday = async () => {
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.holiday.updateHoliday(selectedHoliday._id),
        {
          name: nameHoliday,
          startDate: startHoliday,
          enđate: endHoliday,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Edit Holiday Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchHoliday();
        setModalEditHoliday(false);
      } else {
        Swal.fire({
          text: "Edit Holiday Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          text: error.response.data.message,
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } finally {
      setProgress(false);
    }
  };
  // Delete holiday
  const verifyDeleteHoliday = async (id) => {
    setProgress(true);

    try {
      const response = await axios.delete(apiRoutes.holiday.deleteHoliday(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Holiday Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        fetchHoliday();
      } else {
        Swal.fire({
          text: "Delete Holiday Fail",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    } finally {
      setProgress(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsHoliday = holiday.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const closeModalEditHoliday = () => {
    setModalEditHoliday(false);
    setNameHoliday("");
    setStartHoliday(null);
    setEndHoliday(null);
    selectedHoliday("");
  };

  return (
    <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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
        <div>
          <p className="text-[#252C58] text-[20px] font-light">List Holiday</p>
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
          <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 caret-transparent text-[#252C5880] text-[15px] flex items-center font-light">
            Filter
          </div>
        </div>

        {/* Add Jobtitle */}
        <div
          onClick={() => setModalAddHoliday(true)}
          className="flex items-center justify-center min-w-[150px] sm:min-w-[150px] h-[50px] caret-transparent text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
        >
          <p>Add Holiday</p>
        </div>
        {/* Add Role */}
        <Modal
          isOpen={modalAddHoliday}
          onRequestClose={() => setModalAddHoliday(false)}
          shouldCloseOnOverlayClick={false}
          className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
          overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
        >
          <div className="flex flex-col mt-[-5%] ml-[-5%] ">
            <div className="flex items-center mb-2">
              <IoIosArrowRoundBack
                className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                onClick={closeModalAddHoliday}
              />
              <p className="text-[20px] font-bold ">Add Holiday</p>
            </div>
            <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
          </div>
          <div className="mt-[5%]">
            <div className="w-full">
              <div className="w-full">
                <p>Name Holiday</p>
                <input
                  type="text"
                  className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                  value={nameHoliday}
                  placeholder="Input Name Holiday"
                  onChange={(e) => {
                    setNameHoliday(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex space-x-4 w-full mt-5">
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="w-full">
                    <p className="mb-2">Start Date</p>
                    <DatePicker
                      value={startHoliday}
                      onChange={setStartHoliday}
                      format="DD/MM/YYYY"
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                    />
                  </div>
                </LocalizationProvider>
              </div>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="w-full">
                    <p className="mb-2">End Date</p>
                    <DatePicker
                      value={endHoliday}
                      onChange={setEndHoliday}
                      format="DD/MM/YYYY"
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                    />
                  </div>
                </LocalizationProvider>
              </div>
            </div>
            <div className="flex flex-col mt-5 mb-5">
              <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
              <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                <button
                  onClick={closeModalAddHoliday}
                  className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateHoliday()}
                  className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      {/* List */}
      {holiday.length > 0 ? (
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
                  Start Date
                </th>
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  End Date
                </th>
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItemsHoliday.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                >
                  <td className="px-3 py-6 border-b border-gray-200 text-left w-[25%]">
                    {index + 1}
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[25%] capitalize">
                    {item.name}
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[25%] capitalize">
                    {formatDate(item.startDate)}
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[45%] capitalize">
                    {formatDate(item.endDate)}
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                    <HiOutlineDotsHorizontal
                      className="text-[23px]"
                      onClick={() => {
                        setMoreOptions4(
                          moreOptions4 === item._id ? null : item._id
                        );
                      }}
                    />
                  </td>
                  {moreOptions4 === item._id && (
                    <div
                      className="absolute bg-white right-[7%] z-10 mt-[4%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                    >
                      <div className="absolute right-3 z-10  w-auto origin-top-right rounded-lg shadow-lg bg-white">
                        <div className="flex flex-col divide-y divide-gray-200">
                          {/* Edit */}
                          <div
                            className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setMoreOptions4(null);
                              setSelectedHoliday(item);
                              setNameHoliday(item.name || "");
                              setStartHoliday(
                                item.startDate ? dayjs(item.startDate) : null
                              );
                              setEndHoliday(
                                item.endDate ? dayjs(item.endDate) : null
                              );
                              setModalEditHoliday(true);
                            }}
                          >
                            <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                            <span>Edit</span>
                          </div>

                          {/* Delete */}
                          <div
                            onClick={() => {
                              setMoreOptions4(null);
                              verifyDeleteHoliday(item._id);
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
                  {/* Edit Job */}
                  <Modal
                    isOpen={modalEditHoliday}
                    onRequestClose={() => setModalEditHoliday(false)}
                    shouldCloseOnOverlayClick={false}
                    className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                    overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                  >
                    <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                      <div className="flex items-center mb-2">
                        <IoIosArrowRoundBack
                          className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                          onClick={closeModalEditHoliday}
                        />
                        <p className="text-[20px] font-bold ">Edit Holiday</p>
                      </div>
                      <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                    </div>
                    <div className="mt-[5%]">
                      <div className="w-full">
                        <div className="w-full">
                          <p>Name Holiday</p>
                          <input
                            type="text"
                            className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                            value={nameHoliday}
                            placeholder="Input Name Holiday"
                            onChange={(e) => {
                              setNameHoliday(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4 w-full mt-5">
                        <div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="w-full">
                              <p className="mb-2">Start Date</p>
                              <DatePicker
                                value={startHoliday}
                                onChange={setStartHoliday}
                                format="DD/MM/YYYY"
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                                className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                              />
                            </div>
                          </LocalizationProvider>
                        </div>
                        <div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="w-full">
                              <p className="mb-2">End Date</p>
                              <DatePicker
                                value={endHoliday}
                                onChange={setEndHoliday}
                                format="DD/MM/YYYY"
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                                className="border-gray-200 rounded-[5px] border-[1px] w-[97%] h-[40px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                              />
                            </div>
                          </LocalizationProvider>
                        </div>
                      </div>
                      <div className="flex flex-col mt-5 mb-5">
                        <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                        <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                          <button
                            onClick={closeModalEditHoliday}
                            className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditHoliday()}
                            className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal>
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
      {/* infor bottom */}
      <PaginationFooter
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={holiday.length}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};
export default SettingHoliday;
