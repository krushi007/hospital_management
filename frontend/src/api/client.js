import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE}/auth/token/refresh/`, {
            refresh,
          });
          localStorage.setItem("access_token", res.data.access);
          if (res.data.refresh)
            localStorage.setItem("refresh_token", res.data.refresh);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post("/auth/login/", data),
  register: (data) => api.post("/auth/register/", data),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (data) => api.patch("/auth/profile/", data),
  changePassword: (data) => api.post("/auth/change-password/", data),
  getUsers: (params) => api.get("/auth/users/", { params }),
};

// Department APIs
export const departmentAPI = {
  list: () => api.get("/departments/"),
  rooms: (params) => api.get("/departments/rooms", { params }),
  admit: (data) => api.post("/departments/admissions", data),
  admissions: (params) => api.get("/departments/admissions", { params }),
  discharge: (id) => api.post(`/departments/admissions/${id}/discharge/`),
};

// Room APIs
export const roomAPI = {
  list: (params) => api.get("/departments/rooms/", { params }),
  create: (data) => api.post("/departments/rooms/", data),
  update: (id, data) => api.put(`/departments/rooms/${id}/`, data),
  delete: (id) => api.delete(`/departments/rooms/${id}/`),
};

// Admission APIs
export const admissionAPI = {
  list: (params) => api.get("/departments/admissions/", { params }),
  create: (data) => api.post("/departments/admissions/", data),
  discharge: (id, data) =>
    api.post(`/departments/admissions/${id}/discharge/`, data || {}),
  delete: (id) => api.delete(`/departments/admissions/${id}/`),
};

// Doctor APIs
export const doctorAPI = {
  list: (params) => api.get("/doctors/", { params }),
  get: (id) => api.get(`/doctors/${id}/`),
  getMe: () => api.get("/doctors/me/"),
  create: (data) => api.post("/doctors/", data),
  update: (id, data) => api.put(`/doctors/${id}/`, data),
  delete: (id) => api.delete(`/doctors/${id}/`),
};

// Patient APIs
export const patientAPI = {
  list: (params) => api.get("/patients/", { params }),
  get: (id) => api.get(`/patients/${id}/`),
  getMe: () => api.get("/patients/me/"),
  create: (data) => api.post("/patients/", data),
  update: (id, data) => api.put(`/patients/${id}/`, data),
  delete: (id) => api.delete(`/patients/${id}/`),
};

// Appointment APIs
export const appointmentAPI = {
  list: (params) => api.get("/appointments/", { params }),
  get: (id) => api.get(`/appointments/${id}/`),
  create: (data) => api.post("/appointments/", data),
  updateStatus: (id, status) =>
    api.patch(`/appointments/${id}/update_status/`, { status }),
  requestAdmission: (id) => api.patch(`/appointments/${id}/request_admission/`),
  today: () => api.get("/appointments/today/"),
  delete: (id) => api.delete(`/appointments/${id}/`),
};

// Prescription APIs
export const prescriptionAPI = {
  list: (params) => api.get("/prescriptions/", { params }),
  get: (id) => api.get(`/prescriptions/${id}/`),
  create: (data) => api.post("/prescriptions/", data),
  analyze: (id) => api.post(`/prescriptions/${id}/analyze/`),
};

// Medical Report APIs
export const reportAPI = {
  list: (params) => api.get("/prescriptions/reports/", { params }),
  create: (data) => api.post("/prescriptions/reports/", data),
};

// Billing APIs
export const billingAPI = {
  listInvoices: (params) => api.get("/billing/", { params }),
  getInvoice: (id) => api.get(`/billing/${id}/`),
  createInvoice: (data) => api.post("/billing/", data),
  addPayment: (id, data) => api.post(`/billing/${id}/add_payment/`, data),
  listPayments: (params) => api.get("/billing/payments/", { params }),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats/"),
};

// AI APIs
export const aiAPI = {
  predictDisease: (symptoms) => api.post("/ai/disease-predict/", { symptoms }),
  getSymptoms: () => api.get("/ai/symptoms/"),
  analyzeRisk: (data) => api.post("/ai/risk-analysis/", data),
  analyzePrescription: (data) => api.post("/ai/prescription-analyze/", data),
};

// Pharmacy APIs
export const pharmacyAPI = {
  listMedicines: (params) => api.get("/pharmacy/medicines/", { params }),
  listOrders: (params) => api.get("/pharmacy/orders/", { params }),
  createFromPrescription: (prescriptionId) =>
    api.post("/pharmacy/orders/create_from_prescription/", {
      prescription_id: prescriptionId,
    }),
  dispense: (id) => api.post(`/pharmacy/orders/${id}/dispense/`),
  deleteOrder: (id) => api.delete(`/pharmacy/orders/${id}`),
};

export default api;
