import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import Modal from "react-modal";
import Swal from "sweetalert2";
import PaginationFooter from "../components/PaginationFooter";
import { Fragment } from "react";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
const SettingRole = () => {
  const [moreOptions1, setMoreOptions1] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalAddRole, setModalAddRole] = useState(false);
  const [modalEditRole, setModalEditRole] = useState(false);
  const [modalAddPermission, setModalAddPermission] = useState(false);
  const [progress, setProgress] = useState(false);
  const [dataRole, setDataRole] = useState([]);
  const [nameRole, setNameRole] = useState("");
  const [errors, setErrors] = useState("");
  const [namePermission, setNamePermission] = useState("");
  const [desPermission, setDesPermission] = useState("");
  const [expandedRoleId, setExpandedRoleId] = useState(null);
  const [modalAddDepart, setModalAddDepart] = useState(false);
  const [permission, setPermission] = useState([]);

  const [errors3, setErrors3] = useState("");
  const [errors5, setErrors5] = useState("");

  const token = localStorage.getItem("token");

  const isPermissionAssigned = (role, permId) => {
    return role.permissions.some((p) => p._id === permId);
  };

  const handleTogglePermission = async (roleId, permissionId, isActive) => {
    setProgress(true);

    try {
      const url = isActive
        ? apiRoutes.permission.unassignPermission
        : apiRoutes.permission.assignPermission;

      const response = await axios.post(
        url,
        { roleId, permissionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSnackMessage(
          isActive ? "Permission removed" : "Permission assigned"
        );
        setSnackSeverity("success");
        setSnackOpen(true);

        const refreshedData = await axios.get(apiRoutes.role.getRole);
        setDataRole(refreshedData.data);
      }
    } catch (error) {
      setSnackMessage("Failed to update permission");
      setSnackSeverity("error");
      setSnackOpen(true);
      console.log(error);
    } finally {
      setProgress(false);
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="left" />;
  };

  const closeModalAddPermission = () => {
    setModalAddPermission(false);
    setNamePermission("");
    setDesPermission("");
    setErrors3("");
    setErrors5("");
  };

  const closeModalEditRole = () => {
    setModalEditRole(false);
    setNameRole("");
  };
  const closeModalAddRole = () => {
    setModalAddRole(false);
    setNameRole("");
    setErrors("");
  };
  // Edit role
  const handleEditRole = async () => {
    setProgress(true);

    try {
      const response = await axios.put(
        apiRoutes.role.updateRole(selectedRole._id),
        {
          name: nameRole,
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
          text: "Edit Role Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchRole();
        setModalEditRole(false);
      } else {
        Swal.fire({
          text: "Edit Role Fail",
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
  // Delete role
  const verifyDeleteRole = async (id) => {
    setProgress(true);
    try {
      const response = await axios.delete(apiRoutes.role.deleteRole(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          text: "Delete Role Successfully",
          icon: "success",
          showConfirmButton: false,
          timerProgressBar: true,

          timer: 2000,
        });
        fetchRole();
      } else {
        Swal.fire({
          text: "Delete Role Fail",
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

  // Get all role
  const fetchRole = () => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRole(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  };
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
  // Add role
  const handleCreate = async () => {
    let isValid = true;

    if (!nameRole) {
      setErrors("Name Role is required.");
      isValid = false;
    } else {
      setErrors("");
    }

    if (!isValid) return;

    setProgress(true);

    try {
      const response = await axios.post(
        apiRoutes.role.createRole,
        {
          name: nameRole,
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
          text: "Add Role Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        fetchRole();
        setModalAddDepart(false);
      } else {
        Swal.fire({
          text: "Add Role Fail",
          icon: "error",
          showConfirmButton: false,
          timerProgressBar: true,
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
  // Add permission
  const handleCreatePermission = async () => {
    let isValid = true;

    if (!namePermission) {
      setErrors3("Name Permission is required.");
      isValid = false;
    } else {
      setErrors3("");
    }

    if (!desPermission) {
      setErrors5("Description Permission is required.");
      isValid = false;
    } else {
      setErrors5("");
    }

    if (!isValid) return;

    setProgress(true);

    try {
      const response = await axios.post(
        apiRoutes.permission.createPermission,
        {
          name: namePermission,
          description: desPermission,
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
          text: "Add Permission Successfully",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        fetchPermission();
        setModalAddPermission(false);
      } else {
        Swal.fire({
          text: "Add Permission Fail",
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

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataRole.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchRole();
    fetchPermission();
  }, []);

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
          <p className="text-[#252C58] text-[20px] font-light">List Role</p>
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

        {/* Add Role */}
        <div
          className="flex items-center justify-center min-w-[100px] sm:min-w-[120px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
          onClick={() => setModalAddRole(true)}
        >
          <p>Add Role</p>
        </div>
        {/* Add Permission */}
        <div
          className="flex items-center justify-center min-w-[130px] sm:min-w-[150px] h-[50px] text-white font-normal rounded-[12px] border-2 bg-[#2EB67D] border-gray-200 hover:border-[#2EB67D] focus:border-[#2EB67D] text-[15px]"
          onClick={() => setModalAddPermission(true)}
        >
          <p>Add Permission</p>
        </div>
        {/* Add Role */}
        <Modal
          isOpen={modalAddRole}
          onRequestClose={() => setModalAddRole(false)}
          shouldCloseOnOverlayClick={false}
          className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
          overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
        >
          <div className="flex flex-col mt-[-5%] ml-[-5%] ">
            <div className="flex items-center mb-2">
              <IoIosArrowRoundBack
                className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                onClick={closeModalAddRole}
              />
              <p className="text-[20px] font-bold ">Add Role</p>
            </div>
            <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
          </div>
          <div className="mt-[5%]">
            <div>
              <p>Name Role</p>
              <input
                type="text"
                className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                  errors ? "border-[2px] border-red-500" : ""
                }`}
                value={nameRole}
                placeholder="Input Name Role"
                onChange={(e) => {
                  setNameRole(e.target.value);
                  setErrors("");
                }}
              />
              {errors && (
                <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                  {errors}
                </p>
              )}
            </div>
            <div className="flex flex-col mt-5">
              <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
              <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                <button
                  onClick={closeModalAddRole}
                  className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreate()}
                  className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </Modal>
        {/* Add Permission */}
        <Modal
          isOpen={modalAddPermission}
          onRequestClose={() => setModalAddPermission(false)}
          shouldCloseOnOverlayClick={false}
          className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
          overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-50 flex justify-center items-center"
        >
          <div className="flex flex-col mt-[-5%] ml-[-5%] ">
            <div className="flex items-center mb-2">
              <IoIosArrowRoundBack
                className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                onClick={closeModalAddPermission}
              />
              <p className="text-[20px] font-bold ">Add Permission</p>
            </div>
            <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
          </div>
          <div className="mt-[5%]">
            <div className="flex space-x-4">
              <div>
                <p>Name Permission</p>
                <input
                  type="text"
                  className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                    errors3 ? "border-[2px] border-red-500" : ""
                  }`}
                  value={namePermission}
                  placeholder="Input Name Permission"
                  onChange={(e) => {
                    setNamePermission(e.target.value);
                    setErrors3("");
                  }}
                />
                {errors3 && (
                  <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                    {errors3}
                  </p>
                )}
              </div>
              <div>
                <p>Description Permission</p>
                <input
                  type="text"
                  className={`border border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light ${
                    errors5 ? "border-[2px] border-red-500" : ""
                  }`}
                  value={desPermission}
                  placeholder="Input Description Permission"
                  onChange={(e) => {
                    setDesPermission(e.target.value);
                    setErrors5("");
                  }}
                />
                {errors5 && (
                  <p className="text-red-500 text-[12px] mt-2 mb-2 caret-transparent">
                    {errors5}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col mt-5 mb-5">
              <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
              <div className="flex justify-end mr-[10px] mb-[-10%] mt-2">
                <button
                  onClick={closeModalAddPermission}
                  className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreatePermission()}
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
      {dataRole.length > 0 ? (
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
                  Permission
                </th>
                <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <Fragment key={item._id}>
                  <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]">
                    <td className="px-3 py-6 border-b border-gray-200 text-left w-[20%]">
                      {index + 1}
                    </td>
                    <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[40%] capitalize">
                      {item.name}
                    </td>

                    <td className="px-10 py-6 border-b border-gray-200 truncate text-left w-[40%]">
                      {item.permissions?.length + "+" || 0}
                    </td>
                    <td className="flex space-x-14 px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                      <HiOutlineDotsHorizontal
                        className="text-[23px]"
                        onClick={() => {
                          setMoreOptions1(
                            moreOptions1 === item._id ? null : item._id
                          );
                        }}
                      />
                      <IoIosArrowDown
                        className="text-xl cursor-pointer"
                        onClick={() =>
                          setExpandedRoleId(
                            expandedRoleId === item._id ? null : item._id
                          )
                        }
                      />
                    </td>
                    {moreOptions1 === item._id && (
                      <div
                        className="absolute bg-white right-[10%] z-10 mt-[-1%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
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
                                setMoreOptions1(null);
                                setSelectedRole(item);
                                setModalEditRole(true);
                                setNameRole(item.name);
                              }}
                            >
                              <FaRegAddressCard className="w-[20px] h-[20px] text-[#2EB67D] mr-3" />
                              <span>Edit</span>
                            </div>

                            {/* Delete */}
                            <div
                              onClick={() => {
                                setMoreOptions1(null);
                                verifyDeleteRole(item._id);
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

                    {/* Edit Role */}
                    <Modal
                      isOpen={modalEditRole}
                      onRequestClose={() => setModalEditRole(false)}
                      shouldCloseOnOverlayClick={false}
                      className="bg-white rounded-[20px] shadow-lg w-auto max-w-[80%] p-12 transition-all duration-500 max-h-[95%] overflow-y-auto no-scrollbar"
                      overlayClassName="fixed inset-0 bg-[#A8C1B7] bg-opacity-20 flex justify-center items-center"
                    >
                      <div className="flex flex-col mt-[-5%] ml-[-5%] ">
                        <div className="flex items-center mb-2">
                          <IoIosArrowRoundBack
                            className="w-[30px] h-[30px] mr-[1%] cursor-pointer "
                            onClick={closeModalEditRole}
                          />
                          <p className="text-[20px] font-bold ">Edit Role</p>
                        </div>
                        <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
                      </div>
                      <div className="mt-[5%]">
                        <div>
                          <p>Name Role</p>
                          <input
                            type="text"
                            className={`border capitalize border-gray-300 rounded-md p-3 w-full mt-2 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light`}
                            value={nameRole}
                            onChange={(e) => {
                              setNameRole(e.target.value);
                            }}
                          />
                        </div>
                        <div className="flex flex-col mt-5">
                          <div className="bg-gray-200 w-[150%] h-0.5 mt-[2%] mb-[1%] ml-[-20%]"></div>
                          <div className="flex justify-center mr-[10px] mb-[-10%] mt-2">
                            <button
                              onClick={closeModalEditRole}
                              className="mt-1 bg-white text-[#FF6262] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] "
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleEditRole()}
                              className="mt-1 bg-[#E7F7EF] text-[#097C44] w-[100px] h-[45px] rounded-[10px] border-[#C5C5C5] ml-[10px]"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </Modal>
                  </tr>
                  {expandedRoleId === item._id && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 bg-gray-50 border-b border-gray-300"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {permission.map((perm) => {
                            const assigned = isPermissionAssigned(
                              item,
                              perm._id
                            );
                            return (
                              <div
                                key={perm._id}
                                className="flex justify-between items-center border p-3 rounded bg-white"
                              >
                                <span className="text-sm">
                                  {perm.description}
                                </span>
                                <button
                                  onClick={() =>
                                    handleTogglePermission(
                                      item._id,
                                      perm._id,
                                      assigned
                                    )
                                  }
                                  className={`px-3 py-1 text-xs text-white rounded ${
                                    assigned ? "bg-red-500" : "bg-green-500"
                                  }`}
                                >
                                  {assigned ? "Inactive" : "Active"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
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
      <PaginationFooter
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={dataRole.length}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 5 }}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          onClose={handleSnackClose}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};
export default SettingRole;
