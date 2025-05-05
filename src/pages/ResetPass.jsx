import logo from "../assets/logoapp.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

// icon
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from "react";

const ResetPass = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPasswordBorder, setNewPasswordBorder] = useState(false);
  const [reNewPasswordError, setReNewPasswordError] = useState("");
  const [reNewPasswordBorder, setReNewPasswordBorder] = useState(false);

  const handleContinue = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (!newPassword) {
      setNewPasswordError("New Password is required.");
      isValid = false;
      setNewPasswordBorder(true);
    } else {
      setNewPasswordError("");
      setNewPasswordBorder(false);
    }
    if (!reNewPassword) {
      setReNewPasswordError("Re-enter Password is required.");
      isValid = false;
      setReNewPasswordBorder(true);
    } else {
      setReNewPasswordError("");
      setReNewPasswordBorder(false);
    }
    if (reNewPassword != newPassword) {
      setReNewPasswordError("New Password and Re-enter Password do not match!");
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    let emailVerify = localStorage.getItem("emailVerify");
    setProgress(true);

    try {
      const response = await axios.post(apiRoutes.user.resetPass, {
        emailCompany: emailVerify,
        newPassword,
      });

      const { success, message } = response.data;
      if (success) {
        Swal.fire({
          text: message,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,

          showConfirmButton: false,
        });
        localStorage.removeItem("emailVerify");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response?.status === 500) {
        Swal.fire({
          text: error.response?.data?.message,
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          text: "An unexpected error occurred. Please try again later.",
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

  return (
    <div className="flex bg-gray-600 w-screen h-screen overflow-hidden ">
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
      {/* Form */}
      <div className="bg-white rounded-tr-[25px] rounded-br-[25px] z-[2] w-[60%]">
        <IoIosArrowRoundBack
          className="w-[50px] h-[50px] ml-[1%] mt-[1%] cursor-pointer "
          onClick={() => {
            navigate("/recieveotp");
          }}
        />
        {/* Logo */}
        <div className="flex items-center justify-center caret-transparent">
          <img alt="logo" src={logo} className="h-[80px]" />
        </div>
        {/* Welcome Back */}
        <h2 className="mt-[5%] text-[36px] font-bold flex items-center justify-center caret-transparent">
          Reset Password
        </h2>
        <div className="mt-[3%]">
          <p className="text-gray-400 text-left ml-[15%] text-[15px] caret-transparent">
            Enter New Password
          </p>
          <input
            type="password"
            value={newPassword}
            className={`text-black bg-[rgba(195,176,176,0.4)] h-[50px] rounded-[12px] w-[70%] px-[15px] cursor-text outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] focus:border-2 hover:border-2 ${
              newPasswordBorder ? "border-[2px] border-red-500" : ""
            }`}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          ></input>
          {newPasswordError && (
            <p className="text-red-500 text-[15px] mt-[10px] text-left ml-[17%] caret-transparent">
              {newPasswordError}
            </p>
          )}
        </div>
        <div className="mt-[3%]">
          <p className="text-gray-400 text-left ml-[15%] text-[15px] caret-transparent">
            Re-enter New Password
          </p>
          <input
            type="password"
            value={reNewPassword}
            className={`text-black bg-[rgba(195,176,176,0.4)] h-[50px] rounded-[12px] w-[70%] px-[15px] cursor-text outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] focus:border-2 hover:border-2 ${
              reNewPasswordBorder ? "border-[2px] border-red-500" : ""
            }`}
            onChange={(e) => {
              setReNewPassword(e.target.value);
            }}
          ></input>
          {reNewPasswordError && (
            <p className="text-red-500 text-[15px] mt-[10px] text-left ml-[17%] caret-transparent">
              {reNewPasswordError}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="mt-[4%] text-white caret-transparent bg-[#2EB67D] outline-none w-[15%] text-[18px] focus:outline-none"
            onClick={handleContinue}
          >
            CONTINUE
          </button>
        </div>
      </div>
      {/* Background */}
      <div className="bg-gray-600 relative z-[1] w-[40%] flex justify-center items-center">
        <div>
          <img
            alt="logo"
            src="src\assets\BlobsVector.png"
            className="absolute w-[60%] h-auto top-[12%] left-[20%] scale-x-[-1] z-[1]"
          />
          <img
            alt="logo"
            src="src\assets\BlobsVector-1.png"
            className="absolute w-[65%] h-auto top-[10%] left-[-3%] z-[2] scale-x-[-1]"
          />
          <img
            alt="logo"
            src="src\assets\BlobsVector-2.png"
            className="absolute w-[70%] h-auto top-[45%] left-[10%] scale-x-[-1] z-[3]"
          />
          <img
            alt="logo"
            src="src\assets\MainImage.png"
            className="absolute w-[50%] h-auto top-[15%] left-[25%] scale-x-[-1] z-[4]"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
