import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`
});

// Add request interceptor for authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product related APIs
export const searchProduct = (query) =>
  API.get(`/products/search?q=${query}`);

export const getComparison = (id) =>
  API.get(`/products/compare/${id}`);

export const getSeller = (slug) =>
  API.get(`/seller/${slug}`);

export const getRandomProducts = () =>
  API.get("/products/random");

// Seller specific APIs
export const getSellerProducts = () =>
  API.get("/products/seller/me");

export const createProduct = (formData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);

// Dashboard APIs
export const getDashboardSummary = () =>
  API.get("/seller/dashboard/summary");

export const getDashboardAnalytics = (period = '30d') =>
  API.get(`/seller/dashboard/analytics?period=${period}`);

export const getDashboardActivity = (limit = 10) =>
  API.get(`/seller/dashboard/activity?limit=${limit}`);

// Company/Seller APIs
export const getMyCompany = () =>
  API.get("/company/me");

export const updateCompany = (data) =>
  API.put("/company/me", data);

export const createCompany = (data) =>
  API.post("/company", data);

export const comparedProductsPrice = (productId) =>
  API.get(`/products/compare/${productId}`);

export const submitInquiry = (payload) => {
  // return API.post("/inquiries", payload, {
  //   withCredentials: true,
  // });
  return API.post('/inquiries', payload);
};

export const getSellerInquiries = () => {
  // return API.get("/inquiries/seller", {
  //   withCredentials: true,
  // });
  return API.get('/inquiries/seller');
};

export const updateInquiryStatus = (id, status) => {
  // return API.put(
  //   `/inquiries/${id}/status`,
  //   { status },
  //   { withCredentials: true }
  // );

  return API.put(`/inquiries/${id}/status`, { status });
};
export const getProductById = (productId) =>
  API.get(`/products/${productId}`);  

export default API;
