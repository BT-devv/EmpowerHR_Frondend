import { useState } from "react";
import logo from "../assets/logoapp.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiRoutes from "../../apiRoutes";
import Swal from "sweetalert2";

// icon
import { IoIosArrowRoundBack } from "react-icons/io";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailBorder, setEmailBorder] = useState(false);

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  // button continue
  const handleContinue = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (!email) {
      setEmailError("EmailCompany is required.");
      isValid = false;
      setEmailBorder(true);
    } else {
      setEmailError("");
      setEmailBorder(false);
    }
    if (!isValid) {
      return;
    }

    localStorage.setItem("emailVerify", email);

    try {
      const response = await axios.post(apiRoutes.user.forgotPass, {
        emailCompany: email,
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
          navigate("/recieveotp");
        }, 2000);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response?.data?.message == "Email không tồn tại") {
        setEmailError("Email does not exist.");
        isValid = false;
        setEmailBorder(true);
      } else {
        Swal.fire({
          text: error.response?.data?.message,
          icon: "error",
          timer: 2000,
        });
      }
    }
  };

  return (
    <div className="flex bg-gray-600 w-screen h-screen overflow-hidden ">
      {/* Form */}
      <div className="bg-white rounded-tr-[25px] rounded-br-[25px] z-[2] w-[60%]">
        <IoIosArrowRoundBack
          className="w-[50px] h-[50px] ml-[1%] mt-[1%] cursor-pointer "
          onClick={() => {
            navigate("/");
          }}
        />
        {/* Logo */}
        <div className="flex items-center justify-center caret-transparent">
          <img alt="logo" src={logo} className="h-auto w-[25%] left-[15%]" />
        </div>
        {/* Welcome Back */}
        <h2 className="mt-[8%] text-[36px] font-bold flex items-center justify-center caret-transparent">
          Forgot your password ?
        </h2>
        <div className="mt-[3%]">
          <p className="text-gray-400 text-left ml-[15%] text-[15px] caret-transparent">
            Email
          </p>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            className={`text-black bg-[rgba(195,176,176,0.4)] h-[50px] rounded-[12px] w-[70%] px-[15px] cursor-text outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] focus:border-2 hover:border-2 ${
              emailBorder ? "border-[2px] border-red-500" : ""
            }`}
            onChange={(e) => {
              handleEmailChange(e);
              setEmail(e.target.value);
            }}
          ></input>
          {emailError && (
            <p className="text-red-500 text-[15px] mt-[10px] text-left ml-[17%] caret-transparent">
              {emailError}
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

export default ForgotPass;
