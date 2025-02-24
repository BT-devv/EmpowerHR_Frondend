const API_BASE_URL = "http://localhost:3000/api";

const apiRoutes = {
  auth: {
    login: `${API_BASE_URL}/user/login`,
  },
  user: {
    profile: (employeeId) => `${API_BASE_URL}/user/${employeeId}`,
    getAll: `${API_BASE_URL}/user/users`,
    getNextEmployeeID: `${API_BASE_URL}/user/new-employee-id`,
  },
  posts: {
    createUser: `${API_BASE_URL}/user/create-user`,
  },
};

export default apiRoutes;
