import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

// Icons
import { BiHome } from "react-icons/bi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { HiQrCode } from "react-icons/hi2";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // Trạng thái hiện tại: "Chưa check-in", "Đã check-in", "Đã check-out"

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => handleScan(decodedText),
      (errorMessage) => console.log("Lỗi quét:", errorMessage)
    );

    return () => scanner.clear();
  }, []);

  const sendToAPI = async (employeeID) => {
    try {
      const response = await axios.post(apiRoutes.attendance.scannerQR, {
        qrData: { EmployeeID: employeeID },
      });

      const responseMessage = response.data.message || "Quét thành công!";
      setMessage(responseMessage);

      if (responseMessage.toLowerCase().includes("check-in")) {
        setStatus("Đã check-in");
      } else if (responseMessage.toLowerCase().includes("check-out")) {
        setStatus("Đã check-out");
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
      let employeeID = null;
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.EmployeeID) {
          employeeID = parsedData.EmployeeID;
        }
      } catch (error) {
        const match = data.match(/EmployeeID:\s*(\S+)/);
        if (match) {
          employeeID = match[1];
        }
        console.log(error);
      }

      if (!employeeID) {
        setMessage("Mã QR không hợp lệ!");
        return;
      }

      setScanResult(employeeID);
      if (status === "Đã check-out") {
        setMessage("Bạn đã check-in & check-out hôm nay, không thể quét nữa.");
        return;
      }

      sendToAPI(employeeID);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

      <div className="relative w-[280px] h-[280px]">
        <div id="reader"></div>
      </div>

      <div className="flex flex-col justify-center items-center w-[80%] md:w-[35%] h-[25%] bg-white rounded-2xl text-center p-4 mt-4 shadow-lg">
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

      {scanResult && (
        <p className="mt-4 text-lg font-semibold">
          <strong>Employee ID:</strong> {scanResult}
        </p>
      )}

      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
};

export default QRScanner;
