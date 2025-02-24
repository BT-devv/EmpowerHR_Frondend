import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Employee from "./pages/Employee";
// import Dashboard from "./pages/Dashboard";
import Comingsoon from "./components/Comingsoon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Comingsoon />} />
        <Route path="/message" element={<Comingsoon />} />
        <Route path="/calendar" element={<Comingsoon />} />
        <Route path="/job" element={<Comingsoon />} />
        <Route path="/candidates" element={<Comingsoon />} />
        <Route path="/myreferrals" element={<Comingsoon />} />
        <Route path="/carrersite" element={<Comingsoon />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/payroll" element={<Comingsoon />} />
        <Route path="/projectmanagement" element={<Comingsoon />} />
        <Route path="/checkincheckout" element={<Comingsoon />} />
        <Route path="/overtime" element={<Comingsoon />} />
        <Route path="/absense" element={<Comingsoon />} />
        <Route path="/settings" element={<Comingsoon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
