import { useState } from "react";
import apiRoutes from "../../apiRoutes";
import logo from "../assets/logoapp.png";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [emailBorder, setEmailBorder] = useState(false);
  const [passwordBorder, setPassWordBorder] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //Hide and show the password
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  const expiresIn = 3600 * 1000;
  const expiryTime = Date.now() + expiresIn;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
      setEmailBorder(true);
    } else {
      setEmailError("");
      setEmailBorder(false);
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
      setPassWordBorder(true);
    } else {
      setPasswordError("");
      setPassWordBorder(false);
    }

    if (!isValid) {
      return;
    }
    setProgress(true);
    try {
      const response = await axios.post(apiRoutes.auth.login, {
        emailCompany: email,
        password,
      });

      const { success, message, token } = response.data;

      if (success) {
        Swal.fire({
          text: message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        //Store token and expiryTime (1h)
        localStorage.setItem("token", token);
        localStorage.setItem("expiryTime", expiryTime);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        Swal.fire({
          text: message,
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response?.data?.message == "Invalid email format") {
        setEmailError("Invalid email format");
        isValid = false;
        setEmailBorder(true);
      } else if (error.response?.data?.message == "Invalid password length") {
        setPasswordError("Invalid password length");
        isValid = false;
        setPassWordBorder(true);
      } else if (error.response?.data?.message == "Account does not exist") {
        setEmailError("Account does not exist");
        isValid = false;
        setEmailBorder(true);
      } else if (error.response?.data?.message == "Incorrect Password") {
        setPasswordError("Incorrect Password");
        isValid = false;
        setPassWordBorder(true);
      } else if (
        error.response?.data?.message == "Account does not exist or is inactive"
      ) {
        Swal.fire({
          text: "Account does not exist or is inactive",
          icon: "error",
          timer: 2000,
        });
      }
    } finally {
      setProgress(false);
    }
  };

  return (
    <div className="flex md:flex-row bg-gray-600 w-screen h-screen">
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
      <div className="relative w-1/2 flex justify-center items-center">
        <img
          alt="logo"
          src="src/assets/BlobsVector.png"
          className="absolute w-[60%] h-auto top-[6%] left-[15%] z-[1]"
        />
        <img
          alt="logo"
          src="src/assets/BlobsVector-1.png"
          className="absolute w-[65%] h-auto top-[7%] left-[35%] z-[2]"
        />
        <img
          alt="logo"
          src="src/assets/BlobsVector-2.png"
          className="absolute w-[70%] h-auto top-[38%] left-[10%] z-[3]"
        />
        <img
          alt="logo"
          src="src/assets/MainImage.png"
          className="relative w-[50%] h-auto top-[-3%] left-[-5%] z-[4]"
        />
      </div>
      <div className="bg-white rounded-tl-[25px] rounded-bl-[25px] z-[2] w-[60%]">
        {/* Logo */}
        <div className="flex items-center justify-center caret-transparent">
          <img
            alt="logo"
            src={logo}
            className="h-auto w-[25%] mt-[4%] left-[15%]"
          />
        </div>
        {/* Welcome Back */}
        <h2 className="mt-[10%] text-[36px] font-poppins font-bold flex items-center justify-center caret-transparent">
          Welcome Back!
        </h2>
        {/* Form Fields */}
        <div className="mt-[2%]">
          {/* Email */}
          <div className="">
            <p className="text-gray-400 text-left ml-[15%] text-[15px] caret-transparent">
              Email
            </p>
            <input
              type="email"
              placeholder="Enter your Email here"
              value={email}
              className={`text-black bg-[rgba(176,186,195,0.4)] h-[50px] rounded-[12px] w-[70%] px-[15px] cursor-text outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] focus:border-2 hover:border-2 ${
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
          {/* Password */}
          <div className="mt-[3%]">
            <p className="text-[#7C838A] text-left ml-[15%] text-[15px] caret-transparent">
              Password
            </p>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your Password here"
                value={password}
                className={`text-black bg-[rgba(176,186,195,0.4)] h-[50px] rounded-[12px] w-[70%] px-[15px] outline-none cursor-text hover:border-[#2EB67D] focus:border-[#2EB67D] focus:border-2 hover:border-2 border-1 ${
                  passwordBorder ? "border-[2px] border-red-500" : ""
                }`}
                onChange={(e) => {
                  handlePasswordChange(e);
                  setPassword(e.target.value);
                }}
              ></input>

              {isPasswordVisible ? (
                <FaRegEyeSlash
                  onClick={togglePasswordVisibility}
                  className="absolute left-[80%] w-[19px] h-[15px] mt-[-30px] cursor-pointer"
                />
              ) : (
                <FaRegEye
                  onClick={togglePasswordVisibility}
                  className="absolute left-[80%] w-[19px] h-[15px] mt-[-30px] cursor-pointer "
                />
              )}
            </div>
            {passwordError && (
              <p className="text-red-500 text-[15px] mt-[10px] text-left ml-[17%] caret-transparent">
                {passwordError}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-[3%] bg-[#2EB67D] text-white outline-none w-fit text-[18px] focus:outline-none"
              onClick={handleSubmit}
            >
              LOGIN
            </button>
          </div>
          <div className="flex items-center justify-center ">
            <span
              className="text-customGreen text-[15px] w-fit mt-[2%] caret-transparent cursor-pointer"
              onClick={() => {
                navigate("/forgotpass");
              }}
            >
              Forgot your password?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
