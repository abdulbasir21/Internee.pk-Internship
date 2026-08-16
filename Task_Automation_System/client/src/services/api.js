import axios from "axios";

// Single axios instance so every request shares the same base URL,
// headers, and auth/error handling.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the backend says the session is no longer valid, clear it so the
// app falls back to the login screen instead of looping on 401s.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// The backend wraps every response as { success, ...payload }. These
// helpers unwrap to the specific key each endpoint actually returns, so
// every caller in the app gets plain data back — never the envelope.

// ---- Auth ---- returns { success, token, role, user } as-is: callers
// need all three fields, not just one key.
export const signup = (payload) =>
  api.post("/auth/signup", payload).then((res) => res.data);
export const login = (payload) =>
  api.post("/auth/login", payload).then((res) => res.data);

// ---- Tasks ----
export const getTasks = () =>
  api.get("/tasks").then((res) => res.data.tasks);
export const getTask = (id) =>
  api.get(`/tasks/${id}`).then((res) => res.data.task);
export const createTask = (payload) =>
  api.post("/tasks", payload).then((res) => res.data.task);
export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then((res) => res.data.task);
export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((res) => res.data);

// ---- Dashboard ----
export const getDashboardStats = () =>
  api.get("/dashboard/stats").then((res) => res.data.stats);

// ---- Users ----
// Full intern roster — independent of task assignment, so newly
// registered interns show up immediately in assign/filter dropdowns.
export const getInterns = () =>
  api.get("/users/interns").then((res) => res.data.interns);

// ---- Notifications ----
export const getNotifications = () =>
  api.get("/notifications").then((res) => res.data.notifications);
export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read`).then((res) => res.data.notification);

export default api;
