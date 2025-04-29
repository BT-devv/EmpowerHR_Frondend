import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import TabSelector from "../components/TabSelector";
import { Fragment } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import PaginationFooter from "../components/PaginationFooter";

// icon
import { CiSearch } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";

const Setting = () => {
  const [selectedTab, setSelectedTab] = useState("role");
  const [dataRole, setDataRole] = useState([]);
  const [dataRoleA, setDataRoleA] = useState([]);
  const [dataRoleE, setDataRoleE] = useState([]);
  const [permission, setPermission] = useState([]);
  const [department, setDepartment] = useState([]);
  const [jobTitle, setJobTitle] = useState([]);

  const [moreOptions1, setMoreOptions1] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalAddRole, setModalAddRole] = useState(false);
  const [modalEditRole, setModalEditRole] = useState(false);

  const [moreOptions2, setMoreOptions2] = useState(null);
  const [selectedDepart, setSelectedDepart] = useState(null);
  const [modalAddDepart, setModalAddDepart] = useState(false);
  const [modalEditDepart, setModalEditDepart] = useState(false);

  const [moreOptions3, setMoreOptions3] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalAddJob, setModalAddJob] = useState(false);
  const [modalEditJob, setModalEditJob] = useState(false);

  const [nameRole, setNameRole] = useState("");
  const [errors, setErrors] = useState("");

  const [errors1, setErrors1] = useState("");
  const [nameDepart, setNameDepart] = useState("");

  const [errors2, setErrors2] = useState("");
  const [nameJob, setNameJob] = useState("");

  // Page navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataRole.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemsPermission = permission.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentItemsDepartment = department.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentItemsJobTitle = jobTitle.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const closeModalAddRole = () => {
    setModalAddRole(false);
    setNameRole("");
    setErrors("");
  };

  const closeModalEditRole = () => {
    setModalEditRole(false);
    setNameRole("");
  };

  // Get all role
  useEffect(() => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRole(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all role admin
  useEffect(() => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRoleA(response.data[0].permissions);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all role employee
  useEffect(() => {
    axios
      .get(apiRoutes.role.getRole)
      .then((response) => {
        setDataRoleE(response.data[1].permissions);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all permission
  useEffect(() => {
    axios
      .get(apiRoutes.permission.getPermission)
      .then((response) => {
        setPermission(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all department
  useEffect(() => {
    axios
      .get(apiRoutes.department.getAllDepartment)
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  // Get all jobTitle
  useEffect(() => {
    axios
      .get(apiRoutes.jobtitle.getAllJobtitle)
      .then((response) => {
        setJobTitle(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  const moduleTitleMap = {
    user: "Dashboard",
    calendar: "Calendar",
    absence: "Absence report",
    overtime: "Overtime report",
    attendance: "Attendance",
    chat: "Chat",
  };

  const groupedData = {};

  currentItemsPermission.forEach((item) => {
    const [module] = item.name.split(".");
    const title = moduleTitleMap[module] || module;

    if (!groupedData[title]) {
      groupedData[title] = [];
    }
    groupedData[title].push(item);
  });

  // Add role
  const handleCreate = async () => {
    let isValid = true;

    if (!nameRole) {
      setErrors("Name Role is required.");
      isValid = false;
    } else {
      setErrors("");
    }

    if (!isValid) {
      return;
    }
    const token = localStorage.getItem("token");

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
        });

        setTimeout(() => {
          setModalAddRole(false);
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          text: "Add Role Fail",
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
  // Edit role
  const handleEditRole = async () => {
    const token = localStorage.getItem("token");

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
        });
        setTimeout(() => {
          setModalEditRole(false);
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          text: "Edit Role Fail",
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
  // Delete role
  const verifyDeleteRole = async (id) => {
    const token = localStorage.getItem("token");
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
          timer: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        Swal.fire({
          text: "Delete Role Fail",
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    }
  };

  const closeModalAddDepart = () => {
    setModalAddDepart(false);
    setNameDepart("");
    setErrors1("");
  };

  const closeModalEditDepart = () => {
    setModalEditDepart(false);
    setNameDepart("");
  };

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
    const token = localStorage.getItem("token");

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
        });

        setTimeout(() => {
          setModalAddDepart(false);
          window.location.reload();
        }, 2000);
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
        });
      }
    }
  };
  // Edit role
  const handleEditDepart = async () => {
    const token = localStorage.getItem("token");

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
        });
        setTimeout(() => {
          setModalEditDepart(false);
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          text: "Edit Department Fail",
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
  // Delete Department
  const verifyDeleteDepart = async (id) => {
    const token = localStorage.getItem("token");
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
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        Swal.fire({
          text: "Delete Department Fail",
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    }
  };

  const closeModalAddJob = () => {
    setModalAddJob(false);
    setNameJob("");
    setErrors2("");
  };

  const closeModalEditJob = () => {
    setModalEditJob(false);
    setNameJob("");
  };

  // Add Department
  const handleCreateJob = async () => {
    let isValid = true;

    if (!nameJob) {
      setErrors("Name Job Title is required.");
      isValid = false;
    } else {
      setErrors("");
    }

    if (!isValid) {
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        apiRoutes.jobtitle.createJobtitle,
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

      if (response.status === 201) {
        Swal.fire({
          text: "Add Job Title Successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          setModalAddJob(false);
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          text: "Add Job Title Fail",
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
  // Edit role
  const handleEditJob = async () => {
    const token = localStorage.getItem("token");

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
        });
        setTimeout(() => {
          setModalEditJob(false);
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          text: "Edit Job Title Fail",
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
  // Delete Department
  const verifyDeleteJob = async (id) => {
    const token = localStorage.getItem("token");
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
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        Swal.fire({
          text: "Delete Job Title Fail",
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.log("Failed to delete the profile: " + error.message);
    }
  };

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      <div className="bg-white ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-[70px] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] flex items-center">
        <TabSelector
          tabs={[
            { key: "role", label: "Setting Role" },
            { key: "permission", label: "Setting Permission" },
            { key: "department", label: "Setting Department" },
            { key: "job", label: "Setting Job Title" },
            { key: "notification", label: "Setting Notification" },
          ]}
          selectedTab={selectedTab}
          onTabSelect={(key) => setSelectedTab(key)}
          wrapperClassName="gap-10 md:gap-10 text-[#1C1C1C] ml-7"
        />
      </div>

      {selectedTab === "role" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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
                    <tr
                      key={item._id}
                      className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]"
                    >
                      <td className="px-3 py-6 border-b border-gray-200 text-left w-[20%]">
                        {index + 1}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 truncate text-left w-[40%] capitalize">
                        {item.name}
                      </td>

                      <td className="px-10 py-6 border-b border-gray-200 truncate text-left w-[40%]">
                        {item.name === "admin"
                          ? dataRoleA.length + "+"
                          : dataRoleE.length + "+"}
                      </td>
                      <td className="px-5 py-6 border-b border-gray-200 relative cursor-pointer ">
                        <HiOutlineDotsHorizontal
                          className="text-[23px]"
                          onClick={() => {
                            setMoreOptions1(
                              moreOptions1 === item._id ? null : item._id
                            );
                          }}
                        />
                      </td>
                      {moreOptions1 === item._id && (
                        <div
                          className="absolute bg-white right-[7%] z-10 mt-[4%] w-[200%] origin-top-right rounded-[20px] focus:outline-none "
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
        </div>
      )}

      {selectedTab === "permission" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap w-full items-center gap-x-4 px-4 py-6">
            <div>
              <p className="text-[#252C58] text-[20px] font-light">
                List Permission
              </p>
            </div>
          </div>
          {/* List */}
          {permission.length > 0 ? (
            <div className="overflow-x-auto mt-[20px] text-[14px] ml-[15px]">
              <table className="border-collapse bg-white overflow-hidden w-[calc(100vw-400px)] ">
                <thead>
                  <tr className="border-gray-300 border-t border-b-2 text-left">
                    <th className="px-3 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Permission
                    </th>
                    <th className="px-5 py-5 border-b border-gray-300 caret-transparent text-gray-500">
                      Sub-Permission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedData).map(
                    ([title, items], groupIndex) => (
                      <Fragment key={groupIndex}>
                        {items.map((item, itemIndex) => (
                          <Fragment key={item._id}>
                            <tr className="hover:bg-[rgba(0,84,232,0.03)] cursor-pointer text-[15px]">
                              {itemIndex === 0 ? (
                                <td className="px-3 py-6 text-left font-semibold text-[16px] w-[25%]">
                                  {title}
                                </td>
                              ) : (
                                <td className="px-3 py-6 w-[25%]" />
                              )}
                              <td className="px-5 py-6 truncate text-left w-[40%] capitalize">
                                {item.description}
                              </td>
                            </tr>
                            {itemIndex === items.length - 1 && (
                              <tr className="border-b border-gray-200">
                                <td></td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </Fragment>
                    )
                  )}
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
<<<<<<< HEAD
=======
          {/* infor bottom */}
          <PaginationFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={permission.length}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
>>>>>>> 4816786611cc56553a32ae39ab344f748160b6b8
        </div>
      )}

      {selectedTab === "department" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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
      )}
      {selectedTab === "job" && (
        <div className="flex flex-col bg-[#FFFFFF] w-[calc(100vw-340px)] h-auto ml-[3%] rounded-[15px] mt-[2%] items-start p-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
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

            {/* Add Role */}
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
                  <p className="text-[20px] font-bold ">Add Role</p>
                </div>
                <div className="bg-gray-200 w-[150%] h-0.5 mt-[1%] mb-[1%] ml-[-15%]"></div>
              </div>
              <div className="mt-[5%]">
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
                <div className="flex flex-col mt-5">
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
      )}
    </div>
  );
};

export default Setting;
