import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      console.error("API Error:", data.message || error.message);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
};

export const threadAPI = {
  getAll: (params) => api.get("/threads", { params }),
  getById: (id) => api.get(`/threads/${id}`),
  create: (data) => api.post("/threads", data),
  update: (id, data) => api.put(`/threads/${id}`, data),
  delete: (id) => api.delete(`/threads/${id}`),
};

export const replyAPI = {
  getByThreadId: (threadId) => api.get(`/replies/thread/${threadId}`),
  create: (data) => api.post("/replies", data),
  update: (id, data) => api.put(`/replies/${id}`, data),
  delete: (id) => api.delete(`/replies/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
};

export const tagAPI = {
  getAll: () => api.get("/tags"),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post("/tags", data),
};

export const voteAPI = {
  upvote: (data) => api.post("/votes/upvote", data),
  downvote: (data) => api.post("/votes/downvote", data),
  removeVote: (data) => api.delete("/votes", { data }),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
