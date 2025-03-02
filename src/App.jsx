import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Employee from "./pages/Employee";
import Attendance from "./pages/Attendance";
import Overtime from "./pages/Overtime";
import ForgotPass from "./pages/ForgotPass";
import RecieveOTP from "./pages/RecieveOTP";
import ResetPass from "./pages/ResetPass";
import Absence from "./pages/Absence";
import NotPermission from "./pages/NotPermission";

// import Payroll from "./pages/Payroll";
import QRScanner from "./pages/QRScanner";
import Comingsoon from "./components/Comingsoon";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/not-permission" />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/recieveotp" element={<RecieveOTP />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/message"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/job"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidates"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/myreferrals"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/carrersite"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute>
              <Employee />
            </PrivateRoute>
          }
        />
        <Route
          path="/qrscanner"
          element={
            <PrivateRoute>
              <QRScanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/projectmanagement"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/overtime"
          element={
            <PrivateRoute>
              <Overtime />
            </PrivateRoute>
          }
        />
        <Route
          path="/absense"
          element={
            <PrivateRoute>
              <Absence />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Comingsoon />
            </PrivateRoute>
          }
        />

        <Route path="/not-permission" element={<NotPermission />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
