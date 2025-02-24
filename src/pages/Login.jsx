import { useState } from "react";
import apiRoutes from "../../apiRoutes";
import logo from "../assets/logoapp.png";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

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
    try {
      const response = await axios.post(apiRoutes.auth.login, {
        email,
        password,
      });

      const { success, message, token } = response.data;

      if (success) {
        localStorage.setItem("token", token);
        Swal.fire({
          text: message,
          icon: "success",
        });
        localStorage.setItem("token", response.data.token);
        // alert(response.data.token);
        navigate("/dashboard");
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
      }
    }
  };

  return (
    <div className="flex bg-gray-600 w-screen h-screen overflow-hidden ">
      <div className="bg-gray-600 relative z-[1] w-[40%]">
        <div>
          <img
            alt="logo"
            src="src\assets\BlobsVector.png"
            className="absolute w-[400px] h-[480px] top-[60px] left-[50px] z-[1]"
          />
          <img
            alt="logo"
            src="src\assets\BlobsVector-1.png"
            className="absolute w-[520px] h-[500px] top-[40px] left-[150px] z-[2]"
          />
          <img
            alt="logo"
            src="src\assets\BlobsVector-2.png"
            className="absolute w-[480px] h-[400px] top-[280px] left-[30px] z-[3]"
          />
          <img
            alt="logo"
            src="src\assets\MainImage.png"
            className="absolute w-[350px] h-[500px] top-[80px] left-[120px] z-[4]"
          />
        </div>
      </div>
      <div className="bg-white rounded-tl-[25px] rounded-bl-[25px] z-[2] w-[60%]">
        {/* Logo */}
        <div className="flex items-center justify-center caret-transparent">
          <img alt="logo" src={logo} className="h-[70px] mt-[4%]" />
        </div>
        {/* Welcome Back */}
        <h2 className="mt-[65px] text-[36px] font-poppins font-bold flex items-center justify-center caret-transparent">
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
              className={`text-black bg-[rgba(176,186,195,0.4)] h-[50px] rounded-[12px] w-[70%] px-[15px] cursor-text outline-none focus:border-[#2EB67D] hover:border-[#2EB67D] shadow-[0px_3px_#888888] focus:border-2 hover:border-2 border-2 ${
                emailBorder ? "border-red-500" : "border-[#B0BAC3]"
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
                className={`text-black bg-[rgba(176,186,195,0.4)]  h-[50px] rounded-[12px] w-[70%] px-[15px] outline-none cursor-text hover:border-[#2EB67D] focus:border-[#2EB67D]  shadow-[0px_3px_#888888] focus:border-2 hover:border-2 border-2 ${
                  passwordBorder ? "border-red-500" : "border-[#B0BAC3]"
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
              className="mt-[3%] bg-[#2EB67D] outline-none w-[15%] text-[18px] focus:outline-none"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>

          <p className="text-customGreen text-[15px] mt-[2%] flex items-center justify-center caret-transparent">
            Forgot your password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
