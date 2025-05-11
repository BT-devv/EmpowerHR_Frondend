import PaginationFooter from "./PaginationFooter";
import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
const SettingJobtitle = () => {
  const [moreOptions3, setMoreOptions3] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalAddJob, setModalAddJob] = useState(false);
  const [modalEditJob, setModalEditJob] = useState(false);
  const [department, setDepartment] = useState([]);
  const [jobTitle, setJobTitle] = useState([]);
  const [errors2, setErrors2] = useState("");
  const [errors4, setErrors4] = useState("");
  const [nameJob, setNameJob] = useState("");
  const [isDepartOpen, setIsDepartOpen] = useState(false);
  const [departName, setDepartName] = useState("Select Department");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [progress, setProgress] = useState(false);

  const closeModalEditJob = () => {
    setModalEditJob(false);
    setNameJob("");
  };
  // Get all department
  const fetchDepartment = () => {
    axios
      .get(apiRoutes.department.getAllDepartment)
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  };
  // Get all jobTitle
  const fetchJobtitle = () => {
    axios
      .get(apiRoutes.jobtitle.getAllJobtitle)
      .then((response) => {
        setJobTitle(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  };
  useEffect(() => {
    fetchDepartment();
    fetchJobtitle();
  }, []);

  // Add JobTitle
  const handleCreateJob = async () => {
    let isValid = true;

    if (!nameJob) {
      setErrors2("Name Job Title is required.");
      isValid = false;
    } else {
      setErrors2("");
    }

    if (!selectedDepartmentId) {
      setErrors4("Department is required.");
      isValid = false;
    } else {
      setErrors4("");
    }

    if (!isValid) {
      return;
    }
    setProgress(true);
    try {
      const response = await axios.post(
        apiRoutes.jobtitle.createJobtitle,
        { name: nameJob },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const jobtitleId = response.data._id;

        const assignResponse = await axios.post(
          apiRoutes.jobtitle.assignJobtitle,
          {
            departmentId: selectedDepartmentId,
            jobtitleId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (assignResponse.status === 200) {
          Swal.fire({
            text: "Add and assign Job Title successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
          fetchJobtitle();
          setModalAddJob(false);
        } else {
          Swal.fire({
            text: "Assign Job Title failed",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        }
      } else {
        Swal.fire({
          text: "Add Job Title failed",
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

  // Edit job
  const handleEditJob = async () => {
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.jobtitle.updatedJobtitle(selectedJob._id),
        {
          name: nameJob,
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
          text: "Edit Job Title Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchJobtitle();
        setModalEditJob(false);
      } else {
        Swal.fire({
          text: "Edit Job Title Fail",
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

  const token = localStorage.getItem("token");

  // Delete Joj
  const verifyDeleteJob = async (id) => {
    setProgress(true);

    try {
      const response = await axios.delete(
        apiRoutes.jobtitle.deleteJobtitle(id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Job Title Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        fetchJobtitle();
      } else {
        Swal.fire({
          text: "Delete Job Title Fail",
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
  const handleOptionClick1 = (option, id) => {
    setDepartName(option);
    setSelectedDepartmentId(id);
    setIsDepartOpen(false);
  };

  const closeModalAddJob = () => {
    setModalAddJob(false);
    setNameJob("");
    setErrors2("");
  };

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsJobTitle = jobTitle.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Dropdown selection of manager name
  const toggleDepartDropdown = () => setIsDepartOpen(!isDepartOpen);
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
          <p className="text-[#252C58] text-[20px] font-light">
            List Job Title
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
          <div className="h-[50px] w-full pl-12 rounded-[12px] border-2 bg-gray-200 border-gray-300 caret-transparent text-[#252C5880] text-[15px] flex items-center font-light">
            Filter
          </div>
        </div>

        {/* Add Jobtitle */}
        <div
          onClick={() => setModalAddJob(true)}
          className="flex items-center justify-center min-w-[150px] sm:min-w-[150px] h-[50px] caret-transparent text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
        >
          <p>Add Job Title</p>
        </div>
        {/* Add Role */}
        <Modal
          isOpen={modalAddJob}
          onRequestClose={() => setModalAddJob(false)}
          shouldCloseOnOverlayClick={false}
          className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
          overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
        >
          <div className="flex flex-col mt-[-5%] ml-[-5%] ">
            <div className="flex items-center mb-2">
              <IoIosArrowRoundBack
                className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                onClick={closeModalAddJob}
              />
              <p className="text-[20px] font-bold ">Add Job Title</p>
            </div>
            <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
          </div>
          <div className="mt-[5%]">
            <div className="flex space-x-4 w-full">
              <div className="mt-[1%] w-[60%]">
                <p>Department</p>
                <div className="space-x-5">
                  <div
                    className="relative inline-block text-left w-full"
                    // ref={dropdownRef}
                  >
                    <div className="relative">
                      <div
                        className="inline-flex w-full border-gray-200 border-1 h-[50px] items-center justify-between gap-x-1.5 rounded-[5px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                        onClick={toggleDepartDropdown}
                      >
                        <span className="text-[15px]">{departName}</span>
                        <IoIosArrowDown />
                      </div>
                    </div>
                    {isDepartOpen && (
                      <div className="absolute z-10 mt-2 w-[97%] bg-white rounded-md shadow-lg border border-gray-200">
                        <ul className="py-1">
                          {department.map((option, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleOptionClick1(option.name, option._id)
                              }
                              className="block px-4 py-2 text-[15px] text-gray-700 cursor-pointer hover:bg-gray-100"
                            >
                              {option.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {errors4 && (
                      <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                        {errors4}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p>Name Job Title</p>
                <input
                  type="text"
                  className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                    errors2 ? "border-[2px] border-red-500" : ""
                  }`}
                  value={nameJob}
                  placeholder="Input Name Job Title"
                  onChange={(e) => {
                    setNameJob(e.target.value);
                    setErrors2("");
                  }}
                />
                {errors2 && (
                  <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                    {errors2}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col mt-5 mb-5">
              <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
              <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                <button
                  onClick={closeModalAddJob}
                  className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateJob()}
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
      {jobTitle.length > 0 ? (
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItemsJobTitle.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                >
                  <td className="px-3 py-6 border-b border-gray-200 text-left w-[45%]">
                    {index + 1}
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[45%] capitalize">
                    {item.name}
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                    <HiOutlineDotsHorizontal
                      className="text-[23px]"
                      onClick={() => {
                        setMoreOptions3(
                          moreOptions3 === item._id ? null : item._id
                        );
                      }}
                    />
                  </td>
                  {moreOptions3 === item._id && (
                    <div
                      className="absolute bg-white right-[10%] z-10 mt-[4%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                    >
                      <div className="absolute right-3 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                        <div className="flex flex-col divide-y divide-gray-200">
                          {/* Edit */}
                          <div
                            className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setMoreOptions3(null);
                              setSelectedJob(item);
                              setModalEditJob(true);
                              setNameJob(item.name);
                            }}
                          >
                            <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                            <span>Edit</span>
                          </div>

                          {/* Delete */}
                          <div
                            onClick={() => {
                              setMoreOptions3(null);
                              verifyDeleteJob(item._id);
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
                    isOpen={modalEditJob}
                    onRequestClose={() => setModalEditJob(false)}
                    shouldCloseOnOverlayClick={false}
                    className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                    overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                  >
                    <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                      <div className="flex items-center mb-2">
                        <IoIosArrowRoundBack
                          className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                          onClick={closeModalEditJob}
                        />
                        <p className="text-[20px] font-bold ">Edit Role</p>
                      </div>
                      <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                    </div>
                    <div className="mt-[5%]">
                      <div>
                        <p>Name Job Title</p>
                        <input
                          type="text"
                          className={`border capitalize border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                          value={nameJob}
                          onChange={(e) => {
                            setNameJob(e.target.value);
                          }}
                        />
                      </div>

                      <div className="flex flex-col mt-5">
                        <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                        <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                          <button
                            onClick={closeModalEditJob}
                            className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditJob()}
                            className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                          >
                            Edit
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
        totalItems={jobTitle.length}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};
export default SettingJobtitle;
