import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Employee from "./pages/Employee";
import Attendance from "./pages/Attendance";
import Overtime from "./pages/Overtime";
import ForgotPass from "./pages/ForgotPass";
import RecieveOTP from "./pages/RecieveOTP";
import ResetPass from "./pages/ResetPass";
import Absence from "./pages/Absence";
import Payroll from "./pages/Payroll";
import QRScanner from "./pages/QRScanner";
import Comingsoon from "./components/Comingsoon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/recieveotp" element={<RecieveOTP />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route path="/qrscanner" element={<QRScanner />} />

        {/* Protected Routes */}

        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Comingsoon />} />
          <Route path="message" element={<Comingsoon />} />
          <Route path="calendar" element={<Comingsoon />} />
          <Route path="overtime" element={<Overtime />} />
          <Route path="absense" element={<Absence />} />

          <Route path="employee" element={<Employee />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="attendance" element={<Attendance />} />
          {/* <Route path="qrscanner" element={<QRScanner />} /> */}

          <Route path="settings" element={<Comingsoon />} />

          {/* <Route path="*" element={<NotPermission />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
