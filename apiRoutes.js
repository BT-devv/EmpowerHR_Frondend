const API_BASE_URL = "http://localhost:3000/api";

const apiRoutes = {
  auth: {
    login: `${API_BASE_URL}/user/login`,
  },
  user: {
    profile: (employeeId) => `${API_BASE_URL}/user/${employeeId}`,
    getAll: `${API_BASE_URL}/user/users`,
    getNextEmployeeID: `${API_BASE_URL}/user/new-employee-id`,
    forgotPass: `${API_BASE_URL}/user/forgot-password`,
    verify: `${API_BASE_URL}/user/verify-otp`,
    resetPass: `${API_BASE_URL}/user/reset-password`,
    search: `${API_BASE_URL}/user/search`,
  },
  posts: {
    createUser: `${API_BASE_URL}/user/create-user`,
    updateUser: (employeeId) => `${API_BASE_URL}/user/${employeeId}`,
  },
  attendance: {
    scannerQR: `${API_BASE_URL}/user/scan-qr`,
    getAll: `${API_BASE_URL}/attendance`,
  },
  overtime: {
    request: `${API_BASE_URL}/overtime/request`,
    listPending: `${API_BASE_URL}/overtime/pending`,
    history: `${API_BASE_URL}/overtime/history`,
    updateStatus: `${API_BASE_URL}/overtime/update-status`,
  },
  absence: {
    request: `${API_BASE_URL}/absence/request`,
    listPending: `${API_BASE_URL}/absence/pending`,
    history: `${API_BASE_URL}/absence/history`,
    updateStatus: `${API_BASE_URL}/absence/approve`,
  },
};

export default apiRoutes;
