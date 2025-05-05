import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ClickOutside from "../components/ClickOutside";
import avatar from "../assets/avatar.png";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import FileUpload from "../components/FileUpload";

// icon
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlinePhoto } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  // fields
  const [fileInfos, setFileInfos] = useState({});

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedAva, setSelectedAva] = useState(null);
  const [isCredentialOpen, setIsCredentialOpen] = useState(false);

  const genderData = ["Male", "Female", "Other"];
  const [roleData, setRoleData] = useState([]);

  const token = localStorage.getItem("token");

  // edit form 1
  const [isEditing1, setIsEditing1] = useState(false);

  const [formData1, setFormData1] = useState(() => ({
    avatar: employee?.avatar || "",
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    alias: employee?.alias || "",
    status: employee?.status || "",
    dateOfBirth: employee?.dateOfBirth || "",
    idCardNumber: employee?.idCardNumber || "",
    gender: employee?.gender || "Male",
  }));
  const isFormChanged1 = () => {
    return (
      formData1.firstName !== employee.firstName ||
      formData1.lastName !== employee.lastName ||
      formData1.alias !== employee.alias ||
      formData1.status !== employee.status ||
      formData1.dateOfBirth !== employee.dateOfBirth ||
      formData1.idCardNumber !== employee.idCardNumber ||
      formData1.gender !== employee.gender
    );
  };
  useEffect(() => {
    if (employee) {
      setFormData1({
        avatar: employee.avatar || "",
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        alias: employee?.alias || "",
        status: employee?.status || "",
        idCardNumber: employee.idCardNumber || "",
        dateOfBirth: employee.dateOfBirth || "",
        gender: employee.gender || "Male",
      });
    }
  }, [employee]);

  const handleEditClick1 = () => {
    setIsEditing1(true);
  };

  const handleCancelClick1 = () => {
    setIsEditing1(false);
    setPreview(null);
    setFormData1({
      avatar: employee.avatar,
      firstName: employee.firstName,
      lastName: employee.lastName,
      alias: employee.alias,
      status: employee.status,
      idEmployee: employee.idEmployee,
      idCardNumber: employee.idCardNumber,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
    });
  };

  const handleSaveClick1 = async () => {
    if (!employee?._id) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    if (!selectedAva && !isFormChanged1()) {
      Swal.fire({
        text: "Không có thay đổi nào để cập nhật.",
        icon: "info",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        setIsEditing1(false);
      });
      return;
    }
    setLoading(true);
    try {
      if (selectedAva) {
        const formData = new FormData();
        formData.append("employeeID", employee.employeeID);
        formData.append("avatar", selectedAva);

        const uploadRes = await axios.post(
          apiRoutes.file.uploadfile,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadRes.data.updatedFields?.avatar) {
          setFormData1((prev) => ({
            ...prev,
            avatar: uploadRes.data.updatedFields.avatar,
          }));
        }
        console.log(uploadRes.data);
      }

      if (isFormChanged1()) {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          apiRoutes.posts.updateUser(employee._id),
          formData1,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          Swal.fire({
            text: response.data.message,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          setIsEditing1(false);
        } else {
          alert("Cập nhật thất bại: " + response.data.message);
        }
      } else {
        if (selectedAva) {
          Swal.fire({
            text: "Ảnh đại diện đã được cập nhật.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          setIsEditing1(false);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange1 = (e) => {
    setFormData1({ ...formData1, [e.target.name]: e.target.value });
  };

  // edit employee 2
  const [isEditing2, setIsEditing2] = useState(false);

  const [formData2, setFormData2] = useState(() => ({
    phoneNumber: employee?.phoneNumber || "",
    address: employee?.address || "",
    postcode: employee?.postcode || "",
    city: employee?.city || "",
    province: employee?.province || "",
    emailCompany: employee?.emailCompany || "",
    emailPersonal: employee?.emailPersonal || "",
  }));

  const isFormChanged2 = () => {
    return (
      formData2.phoneNumber !== employee.phoneNumber ||
      formData2.address !== employee.address ||
      formData2.postcode !== employee.postcode ||
      formData2.city !== employee.city ||
      formData2.province !== employee.province ||
      formData2.emailCompany !== employee.emailCompany ||
      formData2.emailPersonal !== employee.emailPersonal
    );
  };

  useEffect(() => {
    if (employee) {
      setFormData2({
        phoneNumber: employee?.phoneNumber || "",
        address: employee?.address || "",
        postcode: employee?.postcode || "",
        city: employee?.city || "",
        province: employee?.province || "",
        emailCompany: employee?.emailCompany || "",
        emailPersonal: employee?.emailPersonal || "",
      });
    }
  }, [employee]);

  const handleEditClick2 = () => {
    setIsEditing2(true);
  };

  const handleCancelClick2 = () => {
    setIsEditing2(false);
    setFormData2({
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      postcode: employee.postcode,
      city: employee.city,
      province: employee.province,
      emailCompany: employee.emailCompany,
      emailPersonal: employee.emailPersonal,
    });
  };

  const handleSaveClick2 = async () => {
    if (!employee?._id) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    if (!isFormChanged2()) {
      Swal.fire({
        text: "Không có thay đổi nào cần lưu.",
        icon: "info",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        setIsEditing2(false);
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(employee._id),
        formData2,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          showConfirmButton: false,
          timerProgressBar: true,

          timer: 2000,
        });
        setIsEditing2(false);
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange2 = (e) => {
    setFormData2({ ...setFormData2, [e.target.name]: e.target.value });
  };

  // edit employee 3
  const [isEditing3, setIsEditing3] = useState(false);

  const [formData3, setFormData3] = useState(() => ({
    bankName: employee?.bankName || "",
    bankAccountNumber: employee?.bankAccountNumber || "",
    bankAccountName: employee?.bankAccountName || "",
  }));

  const isFormChanged3 = () => {
    return (
      formData3.bankName !== employee.bankName ||
      formData3.bankAccountNumber !== employee.bankAccountNumber ||
      formData3.bankAccountName !== employee.bankAccountName
    );
  };

  useEffect(() => {
    if (employee) {
      setFormData3({
        bankName: employee.bankName || "",
        bankAccountNumber: employee.bankAccountNumber || "",
        bankAccountName: employee.bankAccountName || "",
      });
    }
  }, [employee]);

  const handleEditClick3 = () => {
    setIsEditing3(true);
  };

  const handleCancelClick3 = () => {
    setIsEditing3(false);
    setFormData3({
      bankName: employee.bankName,
      bankAccountNumber: employee.bankAccountNumber,
      bankAccountName: employee.bankAccountName,
    });
  };

  const handleSaveClick3 = async () => {
    if (!employee?.employeeID) {
      alert("Không tìm thấy ID nhân viên!");
      return;
    }
    if (!isFormChanged3()) {
      Swal.fire({
        text: "Không có thay đổi nào cần lưu.",
        icon: "info",
        showConfirmButton: false,
        timerProgressBar: true,

        timer: 1500,
      }).then(() => {
        setIsEditing2(false);
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        apiRoutes.posts.updateUser(employee._id),
        formData3,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: response.data.success ? "success" : "error",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          setIsEditing3(false);
        });
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange3 = (e) => {
    setFormData3({ ...formData3, [e.target.name]: e.target.value });
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.avatar) {
      await handleUpdate("avatar");
    }
    if (selectedFiles.photoID) {
      await handleUpdate("photoID");
    }
    if (selectedFiles.certificate) {
      await handleUpdate("certificate");
    }
    if (selectedFiles.graduationCertificate) {
      await handleUpdate("graduationCertificate");
    }
  };

  const [selectedFiles, setSelectedFiles] = useState({
    avatar: null,
    photoID: null,
    certificate: null,
    graduationCertificate: null,
    order: null,
  });

  const handleUpdate = async (fileType) => {
    const selectedFile = selectedFiles[fileType];
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("employeeID", employee.employeeID);
      formData.append(fileType, selectedFile);

      const uploadRes = await axios.post(apiRoutes.file.uploadfile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadRes.status === 200) {
        Swal.fire({
          text: `Tải lên ${fileType} thành công.`,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        setSelectedFiles({
          avatar: null,
          photoID: null,
          certificate: null,
          graduationCertificate: null,
          order: null,
        });
        setIsCredentialOpen(!isCredentialOpen);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        text: `Tải lên ${fileType} thất bại.`,
        icon: "error",
        showConfirmButton: true,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get data dropdown
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [roles] = await Promise.all([axios.get(apiRoutes.role.getRole)]);

        setRoleData(roles.data);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Dropdown selection of gender
  const toggleGenderDropdown = () => setIsGenderOpen(!isGenderOpen);

  useEffect(() => {
    const fetchFileInfos = async () => {
      const fields = [
        "graduationCertificate",
        "photoID",
        "certificate",
        "order",
      ];
      const fileData = {};

      for (const field of fields) {
        const fileId = employee?.[field];
        if (fileId) {
          try {
            const res = await axios.get(apiRoutes.file.file(fileId), {
              responseType: "blob",
            });

            const blobUrl = URL.createObjectURL(res.data);
            fileData[field] = blobUrl;
          } catch (error) {
            console.error(`❌ Error fetching ${field}:`, error);
          }
        }
      }
      setFileInfos(fileData);
    };
    if (employee) {
      fetchFileInfos();
    }
  }, [employee]);

  // Upload avatar
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedAva(file);
    setPreview(URL.createObjectURL(file));
  };

  // Format date of birth
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    axios(apiRoutes.user.profile(id), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setEmployee(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="flex flex-col bg-[#F5F6FA] w-auto h-full relative">
      {loading && (
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
      <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-full text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
        <div className="flex ml-[2%] mt-[2%] mb-[2%]">
          {isEditing1 ? (
            <div className="relative">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-[230px] h-[230px] object-cover border border-gray-300"
                />
              ) : (
                <button
                  onClick={handleChooseFile}
                  className="flex flex-col rounded-none border-[1px] w-[230px] h-[230px] bg-[#EAEAEA] border-gray-400 text-[#C5C5C5] text-[10px] justify-center items-center hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
                >
                  <HiOutlinePhoto className="w-[30px] h-[30px]" />
                  <p className="w-[150px] mt-[5px] text-[12px]">
                    Image: png, jpg, jpeg. Size Maximum: 1mb. Resolution:
                    500x500px.
                  </p>
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          ) : (
            <img
              alt="avatar"
              src={
                apiRoutes.file.avatar(employee.avatar)
                  ? apiRoutes.file.avatar(employee.avatar)
                  : avatar
              }
              className="w-[230px] h-[230px] object-cover border border-gray-300"
            />
          )}

          <div className="ml-[3%] w-full ">
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-bold ">Personal Information</p>
              {isEditing1 ? (
                <div className="flex space-x-2 mr-[3%]">
                  <IoBookmarkOutline
                    onClick={handleSaveClick1}
                    className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                  />
                  <IoCloseCircleOutline
                    onClick={handleCancelClick1}
                    className="w-[25px] h-[25px]  cursor-pointer hover:text-[#069855]"
                  />
                </div>
              ) : (
                <BiEdit
                  className="w-[25px] h-[25px] mr-[4%] text-[#069855] cursor-pointer"
                  onClick={handleEditClick1}
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-8">
              <div>
                <p className="w-fit text-[#828282]">ID Employee</p>
                {isEditing1 ? (
                  <input
                    readOnly
                    type="text"
                    value={employee.employeeID}
                    disabled
                    className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[6%] whitespace-nowrap"
                  ></input>
                ) : (
                  <p className="mt-[5%] font-bold ">{employee.employeeID}</p>
                )}
              </div>
              <div>
                <p className="text-[#828282]">First Name</p>
                {isEditing1 ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData1.firstName}
                    onChange={handleChange1}
                    className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[6%] "
                  />
                ) : (
                  <p className="w-fit font-bold mt-[5%]">
                    {employee.firstName}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[#828282] w-fit">Last Name</p>

                {isEditing1 ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData1.lastName}
                    onChange={handleChange1}
                    className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[6%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[5%]">{employee.lastName}</p>
                )}
              </div>
              <div>
                <p className="w-fit text-[#828282] whitespace-nowrap">Alias</p>
                {isEditing1 ? (
                  <input
                    type="text"
                    name="alias"
                    value={formData1.alias}
                    onChange={handleChange1}
                    className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[5%]"
                  />
                ) : (
                  <p className=" w-fit font-bold mt-[5%]">{employee.alias}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-x-3 mt-6">
              <div>
                <p className="w-fit text-[#828282] ">ID Card</p>
                {isEditing1 ? (
                  <input
                    type="text"
                    name="idCardNumber"
                    value={formData1.idCardNumber}
                    onChange={handleChange1}
                    className="border border-gray-300 rounded-md p-1 w-full font-bold mt-[5%]"
                  />
                ) : (
                  <p className=" w-fit font-bold mt-[5%]">
                    {employee.idCardNumber}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[#828282] mb-2">Date of Birth</p>
                {isEditing1 ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={
                        formData1.dateOfBirth
                          ? dayjs(formData1.dateOfBirth)
                          : null
                      }
                      onChange={(newDate) =>
                        setFormData1((prev) => ({
                          ...prev,
                          dateOfBirth: newDate ? newDate.toISOString() : "",
                        }))
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </LocalizationProvider>
                ) : (
                  <p className="mt-2 font-bold">
                    {formatDate(employee.dateOfBirth)}
                  </p>
                )}
              </div>
              <div>
                <p className="w-fit text-[#828282]">Gender</p>

                {isEditing1 ? (
                  <ClickOutside className="w-full" setIsOpen={setIsGenderOpen}>
                    <div className="relative">
                      <div
                        className="inline-flex w-[260px] border-gray-200 border-1 h-[42px] items-center justify-between gap-x-1.5 rounded-[8px] mt-[5px] pl-[15px] bg-white px-3 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-400 hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 cursor-pointer"
                        onClick={toggleGenderDropdown}
                      >
                        <span className="text-[15px]">{formData1.gender}</span>
                        <IoIosArrowDown />
                      </div>
                    </div>
                    {isGenderOpen && (
                      <div className="absolute z-10 mt-2 w-[260px] bg-white rounded-md shadow-lg border border-gray-200">
                        <ul className="py-1">
                          {genderData.map((option, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                setFormData1((prev) => ({
                                  ...prev,
                                  gender: option,
                                }));
                                setIsGenderOpen(false);
                              }}
                              className="block px-4 py-2 text-[15px] w-[260px] text-gray-700 cursor-pointer hover:bg-gray-100"
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </ClickOutside>
                ) : (
                  <p className="w-fit font-bold mt-[5%]">{employee.gender}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-fit text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
        <div className="ml-[2%] w-full">
          <div className="flex items-center justify-between mt-[2%]">
            <p className="text-[20px] font-bold">Contact Detail</p>
            {isEditing2 ? (
              <div className="flex space-x-2 mr-[4%]">
                <IoBookmarkOutline
                  onClick={handleSaveClick2}
                  className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                />
                <IoCloseCircleOutline
                  onClick={handleCancelClick2}
                  className="w-[25px] h-[25px] mr-[5%] cursor-pointer hover:text-[#069855]"
                />
              </div>
            ) : (
              <BiEdit
                className="w-[25px] h-[25px] mr-[5%] text-[#069855] cursor-pointer"
                onClick={handleEditClick2}
              />
            )}
          </div>
          <div>
            <div className="grid grid-cols-2 mt-[2%]">
              <div>
                <p className="text-[#828282]">Phone Number</p>

                {isEditing2 ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData2.phoneNumber}
                    onChange={handleChange2}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.phoneNumber == "" ? "--" : employee.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[#828282]">Email Company</p>

                {isEditing2 ? (
                  <input
                    type="text"
                    name="emailCompany"
                    value={formData2.emailCompany}
                    onChange={handleChange2}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.emailCompany == "" ? "--" : employee.emailCompany}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 mt-[3%]">
              <div>
                <p className="text-[#828282]">Address</p>
                {isEditing2 ? (
                  <input
                    type="text"
                    name="address"
                    value={formData2.address}
                    onChange={handleChange2}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.address == "" ? "--" : employee.address}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[#828282]">Email Person</p>
                {isEditing2 ? (
                  <input
                    type="text"
                    name="emailPersonal"
                    value={formData2.emailPersonal}
                    onChange={handleChange2}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.emailPersonal == ""
                      ? "--"
                      : employee.emailPersonal}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
              <div>
                <p className="text-[#828282]">Province</p>
                {isEditing2 ? (
                  <input
                    type="text"
                    name="province"
                    value={formData2.province}
                    onChange={handleChange2}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.province == "" ? "--" : employee.province}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-10">
                <div>
                  <p className="text-[#828282]">Postcode</p>
                  {isEditing2 ? (
                    <input
                      type="text"
                      name="postcode"
                      value={formData2.postcode}
                      onChange={handleChange2}
                      className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                    />
                  ) : (
                    <p className="w-fit font-bold mt-[2%]">
                      {employee.postcode == "" ? "--" : employee.postcode}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[#828282]">City</p>

                  {isEditing2 ? (
                    <input
                      type="text"
                      name="city"
                      value={formData2.city}
                      onChange={handleChange2}
                      className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                    />
                  ) : (
                    <p className="w-fit font-bold mt-[2%]">
                      {employee.city == "" ? "--" : employee.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
        <div className="ml-[2%] w-full">
          <div className="flex items-center justify-between mt-[2%]">
            <p className="text-[20px] font-bold">Bank Account</p>
            {isEditing3 ? (
              <div className="flex space-x-2 mr-[4%]">
                <IoBookmarkOutline
                  onClick={handleSaveClick3}
                  className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                />
                <IoCloseCircleOutline
                  onClick={handleCancelClick3}
                  className="w-[25px] h-[25px] cursor-pointer hover:text-[#069855]"
                />
              </div>
            ) : (
              <BiEdit
                className="w-[25px] h-[25px] mr-[5%] text-[#069855] cursor-pointer"
                onClick={handleEditClick3}
              />
            )}
          </div>
          <div>
            <div className="grid grid-cols-2 mt-[2%]">
              <div>
                <p className="text-[#828282] ">Bank Account Name</p>
                {isEditing3 ? (
                  <input
                    type="text"
                    name="bankName"
                    value={formData3.bankName}
                    onChange={handleChange3}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.bankName == "" ? "--" : employee.bankName}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[#828282]">Account Name</p>
                {isEditing3 ? (
                  <input
                    type="text"
                    name="bankAccountName"
                    value={formData3.bankAccountName}
                    onChange={handleChange3}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.bankAccountName == ""
                      ? "--"
                      : employee.bankAccountName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
              <div>
                <p className="text-[#828282]">Bank Account Number</p>
                {isEditing3 ? (
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData3.bankAccountNumber}
                    onChange={handleChange3}
                    className="border border-gray-300 rounded-md p-1 w-auto font-bold mt-[2%]"
                  />
                ) : (
                  <p className="w-fit font-bold mt-[2%]">
                    {employee.bankAccountNumber == ""
                      ? "--"
                      : employee.bankAccountNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
        <div className="ml-[2%]">
          <div className="flex items-center justify-between mt-[2%]">
            <p className="text-[20px] font-bold">Employee Access</p>
          </div>
          <div>
            <div className="grid grid-cols-4 mt-[2%]">
              <div>
                <p className="text-[#828282]">Employee Type</p>
                <p className="w-fit font-bold">{employee.employeeType}</p>
              </div>
              <div>
                <p className="text-[#828282]">Department</p>
                <p className="w-fit font-bold">{employee.department}</p>
              </div>
              <div>
                <p className="text-[#828282]">Position</p>
                <p className="w-fit font-bold">{employee.jobTitle}</p>
              </div>
              <div>
                <p className="text-[#828282]">Role</p>
                <p className="w-fit font-bold capitalize">
                  {roleData.find((r) => r._id === employee.role)?.name || "--"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 mt-[3%] mb-[3%]">
              <div>
                <p className="text-[#828282]">Joining Date</p>
                <p className="mt-2 font-bold">
                  {formatDate(employee.joiningDate) === "NaN/NaN/NaN"
                    ? "--"
                    : formatDate(employee.joiningDate)}
                </p>
              </div>
              <div>
                <p className="text-[#828282]">End Date</p>

                <p className="mt-2 font-bold">
                  {formatDate(employee.endDate) === "NaN/NaN/NaN"
                    ? "--"
                    : formatDate(employee.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[8px] w-[calc(100vw-340px)] h-auto text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)] mb-[2%]">
        <div className="mt-[2%] ml-[2%]">
          <div className="flex items-center justify-between">
            <p className="text-[20px] font-bold">Credential</p>
            <div className="flex items-center justify-center">
              {isCredentialOpen ? (
                <button
                  type="button"
                  className="ml-[-70%] bg-[#2EB67D] text-white outline-none w-fit text-[16px] caret-transparent focus:outline-none flex items-center"
                  onClick={() => {
                    if (isCredentialOpen) {
                      handleUploadFiles();
                    }
                  }}
                >
                  <GoPlus className="w-[25px] h-[25px] mr-2" />
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsCredentialOpen(!isCredentialOpen);
                  }}
                  className="ml-[-70%] bg-[#2EB67D] text-white outline-none w-fit text-[16px] caret-transparent focus:outline-none flex items-center"
                >
                  <GoPlus className="w-[25px] h-[25px] mr-2" />
                  Credential
                </button>
              )}
            </div>
          </div>
          {/* table*/}
          {isCredentialOpen ? (
            <div className="text-[14px] ml-[15px] border-l border-b border-r w-fit mb-5">
              <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden w-[calc(100vw-500px)] caret-transparent border-gray-200 border">
                <thead>
                  <tr className="bg-[#010101] text-left">
                    <th className="px-5 py-3 caret-transparent text-white font-normal">
                      Credential
                    </th>
                    <th className="px-1 py-3 caret-transparent text-white font-normal"></th>
                    <th className="px-5 py-3 caret-transparent text-white font-normal">
                      Documents
                    </th>
                    <th className="px-5 py-3 caret-transparent text-white font-normal">
                      Expiry day
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="cursor-pointer">
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">Photo ID</div>
                    </td>
                    <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                      <FileUpload
                        fileType="photoID"
                        selectedEmployee={employee}
                        setSelectedFile={(file) =>
                          setSelectedFiles((prev) => ({
                            ...prev,
                            photoID: file,
                          }))
                        }
                      />
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">
                        {" "}
                        {selectedFiles.photoID && (
                          <a
                            href={URL.createObjectURL(selectedFiles.photoID)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Preview Photo ID
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">--</div>
                    </td>
                  </tr>
                  <tr className="cursor-pointer">
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">Certificate</div>
                    </td>
                    <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                      <FileUpload
                        fileType="certificate"
                        selectedEmployee={employee}
                        setSelectedFile={(file) =>
                          setSelectedFiles((prev) => ({
                            ...prev,
                            certificate: file,
                          }))
                        }
                      />
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">
                        {selectedFiles.certificate && (
                          <a
                            href={URL.createObjectURL(
                              selectedFiles.certificate
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Preview Certificate
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">--</div>
                    </td>
                  </tr>
                  <tr className="cursor-pointer">
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">
                        Graduation Certificate
                      </div>
                    </td>
                    <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                      <FileUpload
                        fileType="graduationCertificate"
                        selectedEmployee={employee}
                        setSelectedFile={(file) =>
                          setSelectedFiles((prev) => ({
                            ...prev,
                            graduationCertificate: file,
                          }))
                        }
                      />
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">
                        {selectedFiles.graduationCertificate && (
                          <a
                            href={URL.createObjectURL(
                              selectedFiles.graduationCertificate
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Preview Graduation Certificate
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]  ">--</div>
                    </td>
                  </tr>
                  <tr className="cursor-pointer">
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px] ">Order</div>
                    </td>
                    <td className="px-1 py-2 border-b border-gray-200  text-[14px] text-[#252C58] w-[240px] ">
                      <FileUpload
                        fileType="order"
                        selectedEmployee={employee}
                        setSelectedFile={(file) =>
                          setSelectedFiles((prev) => ({
                            ...prev,
                            order: file,
                          }))
                        }
                      />
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]">
                        {selectedFiles.order && (
                          <a
                            href={URL.createObjectURL(selectedFiles.order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Preview Order
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200  text-[14px] text-[#252C58]">
                      <div className="text-left w-[240px]">--</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-[14px] ml-[15px] border-l border-b border-r w-fit mb-5">
              <table className="rounded-[5px] mt-[2%] bg-white overflow-hidden w-[calc(100vw-500px)] caret-transparent border-gray-200 border">
                <thead>
                  <tr className="bg-[#010101] text-left">
                    <th className="px-5 py-3 caret-transparent text-white font-normal">
                      Credential
                    </th>
                    <th className="px-1 py-3 caret-transparent text-white font-normal">
                      Upload Date
                    </th>
                    <th className="px-5 py-3 caret-transparent text-white font-normal">
                      Documents
                    </th>
                    <th className="px-5 py-3 caret-transparent text-white font-normal">
                      Expiry day
                    </th>
                    <th className="px-5 py-3 caret-transparent text-white font-normal">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "photoID", label: "Photo ID" },
                    { key: "certificate", label: "Certificate" },
                    {
                      key: "graduationCertificate",
                      label: "Graduation Certificate",
                    },
                    { key: "order", label: "Order" },
                  ]
                    .filter((field) => employee[field.key])
                    .map((field) => (
                      <tr key={field.key} className="cursor-pointer">
                        <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                          <div className="text-left w-[200px]">
                            {field.label}
                          </div>
                        </td>

                        <td className="px-1 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                          <div className="text-left w-[240px]">--</div>
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                          <div className="w-[200px]">
                            {fileInfos[field.key] && (
                              <a
                                href={apiRoutes.file.file(employee[field.key])}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download {field.label}
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                          <div className="text-left w-[200px]">--</div>
                        </td>

                        <td className="px-5 py-2 border-b border-gray-200 text-[14px] text-[#252C58]">
                          <div className="text-left w-[90px]">
                            <FaRegTrashCan className="w-[25px] h-[25px] text-red-400" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  {![
                    "photoID",
                    "certificate",
                    "graduationCertificate",
                    "order",
                  ].some((key) => employee[key]) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-gray-400 py-5 border-b border-gray-200 w-[calc(100vw-430px)] text-[15px]"
                      >
                        No file data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default EmployeeDetail;
