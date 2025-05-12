import { useNavigate } from "react-router-dom";
import apiRoutes from "../../apiRoutes";
import { useState, useEffect } from "react";
import axios from "axios";
import UsePermission from "../components/UsePermission";
import { jwtDecode } from "jwt-decode";
import DashboardAdmin from "../components/DashbroadAdmin";
import DashboardEmployee from "../components/DashboardEmployee";

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("dashboard.read");
  const [roleData, setRoleData] = useState([]);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  // Get all role
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(apiRoutes.role.getRole, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          console.warn("Bạn không có quyền xem user.");
        }
      });
  }, []);

  const role = roleData.find((r) => r._id === decodedToken.role)?.name;

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;

  return (
    <>
      {role === "admin" || role === "HR" ? (
        <DashboardAdmin />
      ) : (
        <DashboardEmployee />
      )}
    </>
  );
};

export default Dashboard;
