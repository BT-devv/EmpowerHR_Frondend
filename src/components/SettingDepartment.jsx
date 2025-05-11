import PaginationFooter from "./PaginationFooter";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import { CircularProgress } from "@mui/material";

// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
const SettingDepartment = () => {
  const [moreOptions2, setMoreOptions2] = useState(null);
  const [selectedDepart, setSelectedDepart] = useState(null);
  const [modalAddDepart, setModalAddDepart] = useState(false);
  const [modalEditDepart, setModalEditDepart] = useState(false);

  const [errors1, setErrors1] = useState("");
  const [nameDepart, setNameDepart] = useState("");
  const [progress, setProgress] = useState(false);
  const [department, setDepartment] = useState([]);
  const [errors, setErrors] = useState("");

  const closeModalAddDepart = () => {
    setModalAddDepart(false);
    setNameDepart("");
    setErrors1("");
  };

  const token = localStorage.getItem("token");

  // Add Department
  const handleCreateDepart = async () => {
    let isValid = true;

    if (!nameDepart) {
      setErrors("Name Department is required.");
      isValid = false;
    } else {
      setErrors("");
    }

    if (!isValid) {
      return;
    }
    setProgress(true);
    try {
      const response = await axios.post(
        apiRoutes.department.createDepartment,
        {
          name: nameDepart,
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
          text: "Add Department Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchDepartment();
        setModalAddDepart(false);
      } else {
        Swal.fire({
          text: "Add Department Fail",
          icon: "error",
          timer: 2000,
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
  // Edit role
  const handleEditDepart = async () => {
    setProgress(true);
    try {
      const response = await axios.put(
        apiRoutes.department.updatedDepartment(selectedDepart._id),
        {
          name: nameDepart,
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
          text: "Edit Department Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchDepartment();
        setModalEditDepart(false);
      } else {
        Swal.fire({
          text: "Edit Department Fail",
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
  // Delete Department
  const verifyDeleteDepart = async (id) => {
    setProgress(true);
    try {
      const response = await axios.delete(
        apiRoutes.department.deleteDepartment(id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Department Successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        fetchDepartment();
      } else {
        Swal.fire({
          text: "Delete Department Fail",
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

  useEffect(() => {
    fetchDepartment();
  }, []);

  const closeModalEditDepart = () => {
    setModalEditDepart(false);
    setNameDepart("");
  };

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsDepartment = department.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
            List Department
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

        {/* Add Department */}
        <div
          onClick={() => setModalAddDepart(true)}
          className="flex items-center justify-center min-w-[150px] sm:min-w-[150px] h-[50px] caret-transparent text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
        >
          <p>Add Department</p>
        </div>
        <Modal
          isOpen={modalAddDepart}
          onRequestClose={() => setModalAddDepart(false)}
          shouldCloseOnOverlayClick={false}
          className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
          overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
        >
          <div className="flex flex-col mt-[-5%] ml-[-5%] ">
            <div className="flex items-center mb-2">
              <IoIosArrowRoundBack
                className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                onClick={closeModalAddDepart}
              />
              <p className="text-[20px] font-bold ">Add Department</p>
            </div>
            <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
          </div>
          <div className="mt-[5%]">
            <div>
              <p>Name Department</p>
              <input
                type="text"
                className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                  errors1 ? "border-[2px] border-red-500" : ""
                }`}
                value={nameDepart}
                placeholder="Input Name Department"
                onChange={(e) => {
                  setNameDepart(e.target.value);
                  setErrors1("");
                }}
              />
              {errors1 && (
                <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                  {errors1}
                </p>
              )}
            </div>
            <div className="flex flex-col mt-5">
              <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
              <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                <button
                  onClick={closeModalAddDepart}
                  className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateDepart()}
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
      {department.length > 0 ? (
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
              {currentItemsDepartment.map((item, index) => (
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
                  <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer">
                    <HiOutlineDotsHorizontal
                      className="text-[23px]"
                      onClick={() => {
                        setMoreOptions2(
                          moreOptions2 === item._id ? null : item._id
                        );
                      }}
                    />
                  </td>
                  {moreOptions2 === item._id && (
                    <div
                      className="absolute bg-white right-[7%] z-10 mt-[4%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                    >
                      <div className="absolute right-10 z-10 t-[-20px] w-auto origin-top-right rounded-lg shadow-lg bg-white">
                        <div className="flex flex-col divide-y divide-gray-200">
                          {/* Edit */}
                          <div
                            className="flex items-center px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setMoreOptions2(null);
                              setSelectedDepart(item);
                              setModalEditDepart(true);
                              setNameDepart(item.name);
                            }}
                          >
                            <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                            <span>Edit</span>
                          </div>

                          {/* Delete */}
                          <div
                            onClick={() => {
                              setMoreOptions2(null);
                              verifyDeleteDepart(item._id);
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
                  {/* Edit Depart */}
                  <Modal
                    isOpen={modalEditDepart}
                    onRequestClose={() => setModalEditDepart(false)}
                    shouldCloseOnOverlayClick={false}
                    className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                    overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                  >
                    <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                      <div className="flex items-center mb-2">
                        <IoIosArrowRoundBack
                          className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                          onClick={closeModalEditDepart}
                        />
                        <p className="text-[20px] font-bold ">Edit Role</p>
                      </div>
                      <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                    </div>
                    <div className="mt-[5%]">
                      <div>
                        <p>Name Department</p>
                        <input
                          type="text"
                          className={`border capitalize border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                          value={nameDepart}
                          onChange={(e) => {
                            setNameDepart(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-col mt-5">
                        <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                        <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                          <button
                            onClick={closeModalEditDepart}
                            className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditDepart()}
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
        totalItems={department.length}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};
export default SettingDepartment;
