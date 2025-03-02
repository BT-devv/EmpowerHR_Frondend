import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

// Icon
import { BiHome } from "react-icons/bi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { HiQrCode } from "react-icons/hi2";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        handleScan(decodedText);
      },
      (errorMessage) => {
        console.log("Lỗi quét:", errorMessage);
      }
    );

    return () => scanner.clear();
  }, []);

  const sendToAPI = async (employeeID, action) => {
    try {
      const response = await axios.post(apiRoutes.attendance.scannerQR, {
        qrData: { EmployeeID: employeeID },
        action,
      });

      const responseMessage = response.data.message || `${action} thành công!`;
      setMessage(responseMessage);
      alert(action);
      if (action === "check-in") {
        setIsCheckedIn(true);
      } else if (action === "check-out") {
        setIsCheckedOut(true);
      }
    } catch (error) {
      setMessage(
        "Lỗi khi gửi dữ liệu: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleScan = (data) => {
    if (data) {
      const employeeID = data.match(/EmployeeID:\s*(\S+)/)
        ? data.match(/EmployeeID:\s*(\S+)/)[1]
        : null;

      if (employeeID) {
        setScanResult(employeeID);

        if (!isCheckedIn) {
          sendToAPI(employeeID, "check-in");
        } else if (!isCheckedOut) {
          sendToAPI(employeeID, "check-out");
        } else {
          setMessage(
            "Bạn đã check-in & check-out hôm nay, không thể quét nữa."
          );
        }
      } else {
        setMessage("Mã QR không hợp lệ!");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-red-100">
      <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

      <div className="relative w-[280px] h-[280px]">
        <div id="reader"></div>
      </div>

      <div className="flex flex-col justify-center items-center w-[35%] h-[25%] bg-white rounded-[20px] text-[15px] mt-[2%]">
        <p>Show your QR code in the highlighted area of the scanning screen</p>
        <p>Your QR code can be generated in your mobile device:</p>
        <p>
          Access to your <span className="text-[#2EB67D]">Home page</span> and
          choose the <span className="text-[#2EB67D]">QR icon</span> on the{" "}
          <span className="text-[#2EB67D]">top left corner</span>
        </p>
        <div className="flex justify-center items-center space-x-5 mt-[2%]">
          <div className="flex flex-col text-[#2EB67D] justify-center items-center">
            <BiHome className="w-[30px] h-[30px]" />
            <p>Home</p>
          </div>
          <IoIosArrowRoundForward className="w-[40px] h-[40px] mt-[-10px]" />
          <HiQrCode className="w-[30px] h-[30px] mt-[-10px]" />
        </div>
      </div>

      {scanResult && (
        <p className="mt-4 text-lg font-semibold">
          <strong>Employee ID:</strong> {scanResult}
        </p>
      )}
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default QRScanner;
