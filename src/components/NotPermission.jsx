import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

const NotPermission = () => {
  const navigate = useNavigate();
  const [dataUser, setUserData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    if (userId) {
      axios
        .get(apiRoutes.user.profile(userId), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(
            "Lỗi khi lấy thông tin người dùng:",
            error.response?.data || error.message
          );
        });
    } else {
      console.error("Token không chứa employeeID, vui lòng kiểm tra lại.");
    }
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#CCE0D8] relative overflow-hidden w-screen">
      {/* Shapes */}
      <div className="absolute top-[70%] left-[75%] h-[550px] w-[550px] bg-white opacity-70 rounded-3xl rotate-45"></div>
      <div className="absolute top-[-10%] left-[29%] h-[400px] w-[160px] bg-[#73FFC4] opacity-40 rounded-3xl rotate-45"></div>
      <div className="absolute top-[-10%] left-[-5%] h-[550px] w-[550px] bg-white opacity-70 rounded-3xl rotate-45"></div>

      {/* Text Content */}
      <div className="text-center relative z-10">
        <div className="text-left caret-transparent">
          <img
            alt="logo"
            src="src\assets\rocket.png"
            className="relative top-[80px] left-[80%]"
          />
          <h1 className="text-[#18533A] font-light text-[10px] md:text-7xl">
            Ooops...!
          </h1>

          <p className="text-[#22855B] font-extrabold text-[130px] border-white [text-shadow:-2px_-2px_0_white,2px_-2px_0_white,-2px_2px_0_white,2px_2px_0_white,-2px_0px_0_white,2px_0px_0_white,0px_-2px_0_white,0px_2px_0_white] ml-[30%] mt-[-2%]">
            404
          </p>
        </div>
        <p className="text-lg md:text-xl text-gray-700 mt-4 font-bold caret-transparent">
          Page not found
        </p>
        <p className="text-[16px] text-[#6E6E6E] mt-4 font-light caret-transparent">
          {`Either this page doesn't exist or you don't have permission to access
          it.`}
        </p>
        <div className="flex items-center justify-center mt-[2%]">
          <button
            type="submit"
            className="mt-[3%] bg-[#808080] text-white outline-none w-fit text-[18px] focus:outline-none font-bold"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Back to my content
          </button>
        </div>
        <div className="text-[16px] text-[#6E6E6E] font-light mt-[10%]">
          <p>{`You're currently logged in as ${dataUser.emailCompany}`}</p>
          <p className="mt-2">
            You might need to{" "}
            <span
              className="text-[#50A3F2] underline cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              log in
            </span>{" "}
            with a different email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotPermission;
