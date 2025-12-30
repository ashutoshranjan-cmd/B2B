import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

// ---------------- REQUEST INTERCEPTOR ----------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE INTERCEPTOR ----------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ================= AUTH APIs =================
export const loginUser = (data) =>
  API.post("/users/login", data);

export const registerUser = (data) =>
  API.post("/users/register", data);

// ================= USER APIs =================
export const getCurrentUser = () =>
  API.get("/users/me");

// ================= PRODUCT APIs =================

export const getStoreProducts = (subdomain) =>
  API.get(`/products/store/${subdomain}`);


// ================= COMPANY APIs =================
export const createCompany = (data) =>
  API.post("/company", data);

export const getMyCompany = () =>
  API.get("/company/me");

export default API;
