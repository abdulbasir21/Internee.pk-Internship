import axios from "axios";

// Single axios instance for every REST call. Keeping this separate from
// socket.js is intentional (see socket.js) — REST is the source of truth
// for writes, sockets only broadcast the result.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the JWT (if we have one) to every outgoing request. Reading it
// fresh from localStorage per-request (instead of caching it in a
// closure) means a login/logout in another tab is picked up immediately.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected/expired, force back to login rather than
// leaving the app stuck on a screen full of 401s.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (name, email, password) =>
    api.post("/auth/signup", { name, email, password }),
};

export const projectsApi = {
  list: () => api.get("/projects"),
  get: (id) => api.get(`/projects/${id}`),
  // Admin only — PROGRESS.md §2.
  create: (data) => api.post("/projects", data),
  updateMembers: (id, data) => api.patch(`/projects/${id}/members`, data),
};

// NOT in backend PROGRESS.md — there is no documented "list users" or
// "list interns" endpoint. Assumed REST convention (`GET /api/users?role=intern`)
// so the member-selector has something to call. This needs a matching route
// added on the backend (or swap the path below) before it will work for real.
export const usersApi = {
  listInterns: () => api.get("/users", { params: { role: "intern" } }),
};

export const tasksApi = {
  list: (projectId) => api.get(`/projects/${projectId}/tasks`),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/tasks`, data),
  update: (taskId, data) => api.patch(`/tasks/${taskId}`, data),
  remove: (taskId) => api.delete(`/tasks/${taskId}`),
};

export const milestonesApi = {
  list: (projectId) => api.get(`/projects/${projectId}/milestones`),
  // Admin only — PROGRESS.md §2. Note: creating a milestone does NOT emit
  // a socket event (only task create/update/delete that changes a linked
  // milestone's ratio does, per PROGRESS.md §3), so a board that's open
  // live won't see a brand-new milestone until it re-fetches (e.g. on
  // navigation/remount) — not a live-pulse case.
  create: (projectId, data) => api.post(`/projects/${projectId}/milestones`, data),
};

export default api;
