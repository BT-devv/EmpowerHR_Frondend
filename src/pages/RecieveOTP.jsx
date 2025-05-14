import logo from "../assets/logoapp.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

// icon
import { IoIosArrowRoundBack } from "react-icons/io";

const RecieveOPT = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(false);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpBorder, setOtpBorder] = useState(false);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    let isValid = true;

    let emailVerify = localStorage.getItem("emailVerify");
    let otpFinal = otp.join("");

    if (otp.includes("")) {
      setOtpError("OTP is required. Please enter all 6 digits.");
      isValid = false;
      setOtpBorder(true);
    } else {
      setOtpError("");
      setOtpBorder(false);
    }
    if (!isValid) {
      return;
    }
    setProgress(true);

    try {
      const response = await axios.post(apiRoutes.user.verify, {
        emailCompany: emailVerify,
        otp: otpFinal,
      });
      const { success, message } = response.data;
      if (success) {
        Swal.fire({
          text: message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/resetpass");
        }, 2000);
      } else {
        Swal.fire({
          text: message,
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
          showConfirmButton: false,
          timerProgressBar: true,
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
            navigate("/forgotpass");
          }}
        />
        {/* Logo */}
        <div className="flex items-center justify-center caret-transparent">
          <img alt="logo" src={logo} className="h-[80px]" />
        </div>
        {/* Welcome Back */}
        <h2 className="mt-[5%] text-[36px] font-bold flex items-center justify-center caret-transparent">
          Verification OTP
        </h2>
        <div className="flex space-x-4 justify-center items-center mt-[3%]">
          {otp.map((val, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              className={`text-black text-center text-[25px] bg-[rgba(195,176,176,0.4)] h-[85px] rounded-[12px] w-[57px] cursor-text outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] focus:border-2 hover:border-2 ${
                otpBorder ? "border-[2px] border-red-500" : ""
              }`}
            />
          ))}
        </div>
        {otpError && (
          <p className="text-red-500 text-[15px] mt-[2%] caret-transparent">
            {otpError}
          </p>
        )}
        <div className="flex flex-col items-center justify-center">
          <div className="mt-[3%] w-[62%]">
            <p className="text-[#7C838A]">
              It looks like you haven’t received the OTP yet. Please check your
              email inbox, including the spam folder. If the code still hasn’t
              arrived, you can request a new one after 30 seconds or tap
              <span className="text-[#2EB67D] cursor-pointer border-b-[2px] border-[#2EB67D] ">
                {` Resend OTP `}
              </span>
              to receive a new code.
            </p>
          </div>
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

export default RecieveOPT;
