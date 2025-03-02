import { useNavigate } from "react-router-dom";

const NotPermission = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#CCE0D8] relative overflow-hidden w-screen">
      {/* Shapes */}
      <div className="absolute top-[70%] left-[75%] h-[550px] w-[550px] bg-white opacity-70 rounded-3xl rotate-45"></div>
      <div className="absolute top-[-10%] left-[29%] h-[400px] w-[160px] bg-[#73FFC4] opacity-40 rounded-3xl rotate-45"></div>
      <div className="absolute top-[-10%] left-[-5%] h-[550px] w-[550px] bg-white opacity-70 rounded-3xl rotate-45"></div>

      {/* Text Content */}
      <div className="text-center relative z-10">
        <h1 className="text-[#18533A] font-light text-[10px] md:text-7xl">
          Ooops...!
        </h1>
        <p className="text-[#22855B] font-extrabold text-[130px] border-white [text-shadow:-2px_-2px_0_white,2px_-2px_0_white,-2px_2px_0_white,2px_2px_0_white,-2px_0px_0_white,2px_0px_0_white,0px_-2px_0_white,0px_2px_0_white] ml-[30%] mt-[-2%]">
          404
        </p>
        <p className="text-lg md:text-xl text-gray-700 mt-4 font-bold">
          Page not found
        </p>
        <p className="text-[16px] text-[#6E6E6E] mt-4">
          Either this page doesn't exist or you don't have permission to access
          it.
        </p>
        <p className="text-[16px] text-[#6E6E6E] mt-4">
          You might need to{" "}
          <span
            className="text-[#50A3F2] underline cursor-pointer"
            onClick={navigate("/")}
          >
            log in
          </span>{" "}
          with a email.
        </p>
      </div>
    </div>
  );
};

export default NotPermission;
