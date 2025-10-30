import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
};

export const threadAPI = {
  getAll: (params) => api.get("/threads", { params }),
  getById: (id) => api.get(`/threads/${id}`),
  create: (data) => api.post("/threads", data),
};

export const replyAPI = {
  getByThreadId: (threadId) => api.get(`/replies/thread/${threadId}`),
  getById: (id) => api.get(`/replies/${id}`),
  create: (data) => api.post("/replies", data),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
};

export const tagAPI = {
  getAll: () => api.get("/tags"),
  create: (data) => api.post("/tags", data),
};

export const voteAPI = {
  // Original methods (kept for backward compatibility)
  voteThread: (threadId, value) =>
    api.post(`/votes/thread/${threadId}`, { value }),
  voteReply: (replyId, value) => api.post(`/votes/reply/${replyId}`, { value }),

  // New dedicated methods for thread voting
  upvoteThread: (threadId) => api.post(`/votes/thread/${threadId}/upvote`),
  downvoteThread: (threadId) => api.post(`/votes/thread/${threadId}/downvote`),

  // New dedicated methods for reply voting
  upvoteReply: (replyId) => api.post(`/votes/reply/${replyId}/upvote`),
  downvoteReply: (replyId) => api.post(`/votes/reply/${replyId}/downvote`),
};

// Repost endpoints
export const repostAPI = {
  // Create a repost
  create: (data) => api.post("/reposts", data),

  // Get reposts by user
  getByUserId: (userId, params) =>
    api.get(`/reposts/user/${userId}`, { params }),

  // Get reposts for a thread
  getByThreadId: (threadId, params) =>
    api.get(`/reposts/thread/${threadId}`, { params }),

  // Delete a repost
  delete: (id) => api.delete(`/reposts/${id}`),
};

// Follow API endpoints
export const followAPI = {
  // Follow a user
  followUser: (followingId) => api.post("/follows", { followingId }),

  // Unfollow a user
  unfollowUser: (followingId) => api.delete(`/follows/${followingId}`),

  // Get followers of a user
  getFollowers: (userId, params) =>
    api.get(`/follows/${userId}/followers`, { params }),

  // Get users that a user is following
  getFollowing: (userId, params) =>
    api.get(`/follows/${userId}/following`, { params }),

  // Check if current user is following target user
  checkFollowing: (targetUserId) => api.get(`/follows/${targetUserId}/check`),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
