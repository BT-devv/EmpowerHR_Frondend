import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import Modal from "react-modal";
import apiRoutes from "../../apiRoutes";
import { useNavigate } from "react-router-dom";
import UsePermission from "../components/UsePermission";
import { CircularProgress } from "@mui/material";

// Icons
import { BiHome } from "react-icons/bi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { HiQrCode } from "react-icons/hi2";

const QRScanner = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("qr.read");

  const [progress, setProgress] = useState(false);

  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (error) {
      setCountdown(3);

      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const closeTimer = setTimeout(() => {
        setError(false);
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [error]);

  const sendToAPI = async (employeeID) => {
    setProgress(true);

    try {
      const response = await axios.post(apiRoutes.attendance.scannerQR, {
        qrData: { EmployeeID: employeeID },
      });
      setData(response.data.data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data from API", error);
    } finally {
      setProgress(false);
    }
  };

  const handleScan = (scannedData) => {
    if (scannedData && scannedData.length > 0) {
      const qrResult = scannedData[0].rawValue;

      let employeeID = null;
      try {
        const parsed = JSON.parse(qrResult);
        console.log("parsed result", parsed);
        employeeID = parsed.EmployeeID;
      } catch (error) {
        console.error("Error parsing scanned data:", error);
      }

      if (!employeeID) {
        setError(true);
        setData();
        return;
      }

      sendToAPI(employeeID);
      console.log(employeeID);
    }
  };

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  return (
    <div className="flex bg-[rgba(151,151,151,0.78)] w-screen h-screen">
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
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative w-[280px] h-[280px]">
          {/* Scanner */}
          <Scanner
            onScan={(result) => handleScan(result)}
            onError={(error) => console.error("Lỗi quét:", error)}
            constraints={{ facingMode: "environment" }}
            className="w-full h-full"
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20px] left-[-20px] w-[40px] h-[40px] border-t-4 border-l-4 border-white"></div>
            <div className="absolute top-[-20px] right-[-20px] w-[40px] h-[40px] border-t-4 border-r-4 border-white"></div>
            <div className="absolute bottom-[-20px] left-[-20px] w-[40px] h-[40px] border-b-4 border-l-4 border-white"></div>
            <div className="absolute bottom-[-20px] right-[-20px] w-[40px] h-[40px] border-b-4 border-r-4 border-white"></div>
          </div>
        </div>
        <Modal
          isOpen={error}
          onRequestClose={() => setError(false)}
          className="bg-white rounded-[30px] shadow-lg w-[35%] p-12 transition-all duration-500 overflow-y-auto no-scrollbar caret-transparent"
          overlayClassName="fixed inset-0 flex justify-center items-center"
        >
          <div className="flex flex-col justify-center items-center">
            <img alt="icon" src="src/assets/error.png" className=" w-[30%]" />
            <p className="mt-2 font-semibold text-red-500 text-[28px]">
              READING QR CODE ERROR
            </p>
            <p className="mt-5 font-semibold text-black text-[20px] text-center">
              PLEASE DO AS INSTRUCTED BELOW AND <br />
              TRY AGAIN AFTER{" "}
              <span className="mt-2 font-bold text-[25px] text-red-600">
                {countdown}
              </span>{" "}
              SECONDS
            </p>
          </div>
        </Modal>
        ;
        <div className="flex flex-col justify-center items-center w-[80%] md:w-[35%] h-[25%] bg-white rounded-2xl text-center p-4 mt-10 shadow-lg">
          <p>Đưa mã QR vào khu vực quét để điểm danh</p>
          <p>
            Truy cập <span className="text-green-600">Trang chủ</span> và nhấn{" "}
            <span className="text-green-600">QR icon</span> để lấy mã.
          </p>

          <div className="flex justify-center items-center space-x-5 mt-3">
            <div className="flex flex-col text-green-600 justify-center items-center">
              <BiHome className="w-[30px] h-[30px]" />
              <p>Home</p>
            </div>
            <IoIosArrowRoundForward className="w-[40px] h-[40px]" />
            <HiQrCode className="w-[30px] h-[30px]" />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-[300px] h-full bg-white flex flex-col items-center shadow-lg">
        <p className="bg-[#2EB67D] p-4 rounded-bl-[20px] rounded-br-[20px] text-white text-[30px] w-full max-h-[100px] text-center">
          REPORT
        </p>

        {data ? (
          <div className="relative flex flex-col items-center w-full mt-[35%] h-full transition-all">
            <img
              alt="icon"
              src="src/assets/avatar.png"
              className="w-[110px] rounded-full border-2 border-black absolute -top-14 z-10"
            />
            <div className="w-full h-[80px] bg-[#2EB67D] rounded-t-[50%] flex flex-col items-center justify-center relative"></div>

            <div className="h-full w-full bg-[#2EB67D]">
              <p className="text-[30px] font-semibold">{data.name} </p>
              <p className="font-semibold mt-5">
                ID: <span className="text-white">{data.employeeID}</span>
              </p>
              <p className="font-semibold mt-5">
                Check-in time:{" "}
                <span className="text-white">{data.checkIn} AM</span>
              </p>
              <p className="font-semibold">
                Check-out time:{" "}
                <span className="text-white">{data.checkOut} PM</span>
              </p>
              <div className="border-2 border-dashed border-black bg-white p-2 flex flex-col justify-center items-center w-[85%] mx-auto mt-[30%]">
                <p className="font-semibold text-center mt-[5%]">
                  You did a very good job today. !!Keep it up tomorrow!!
                </p>
                <p>💪💪💪</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center w-full">
            <div className="border-2 border-dashed border-[#2EB67D] p-4 flex flex-col justify-center items-center w-[85%] mx-auto">
              <img
                alt="icon"
                src="src\assets\QR.png"
                className="w-[100px] h-[100px]"
              />
              <p className="font-semibold text-center mt-[10%]">
                Please scan your QR code as instructed and your result will be
                shown here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
