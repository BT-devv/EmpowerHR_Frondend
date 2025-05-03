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
import QRScanner from "./pages/QRScanner";
import Setting from "./pages/Setting";
import NotPermission from "./components/NotPermission";
import Payroll from "./pages/Payroll";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/recieveotp" element={<RecieveOTP />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route path="/qrscanner" element={<QRScanner />} />
        <Route path="/notpermission" element={<NotPermission />} />

        {/* Protected Routes */}

        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="message" element={<Chat />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="overtime" element={<Overtime />} />
          <Route path="absence" element={<Absence />} />

          <Route path="employee" element={<Employee />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="settings" element={<Setting />} />

          <Route path="*" element={<NotPermission />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
