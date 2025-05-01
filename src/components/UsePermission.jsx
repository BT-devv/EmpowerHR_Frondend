import { useState, useEffect } from "react";
import axios from "axios";
import apiRoutes from "../../apiRoutes";

const UsePermission = (requiredPermission) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const roleId = decoded.role;

      try {
        const res = await axios.get(apiRoutes.role.getRole, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const roles = res.data || [];
        const role = roles.find((r) => r._id === roleId);
        const permissions = role?.permissions || [];

        const match = permissions.some((p) => p.name === requiredPermission);
        setHasPermission(match);
      } catch (err) {
        setHasPermission(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [requiredPermission]);

  return { hasPermission, loading };
};

export default UsePermission;
