// All calls to the backend live in this one file. Every endpoint here
// matches PROGRESS.md exactly — see that file if the backend changes.
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Attach the student/admin JWT (if we have one) to every outgoing request.
// Public routes ignore the header; protected routes require it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---- Auth -----------------------------------------------------------
export const signup = (name, email, password) =>
  api.post('/api/auth/signup', { name, email, password }).then((res) => res.data)

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password }).then((res) => res.data)

// ---- Courses (public) -------------------------------------------------
export const getCourses = () => api.get('/api/courses').then((res) => res.data)

export const getCourseById = (id) => api.get(`/api/courses/${id}`).then((res) => res.data)

// ---- Payment (student only) -------------------------------------------
export const createCheckoutSession = (courseId) =>
  api.post('/api/payment/stripe/create-session', { courseId }).then((res) => res.data)

// ---- Courses (admin only, requires protect + isAdmin) ------------------
export const createCourse = (payload) =>
  api.post('/api/courses', payload).then((res) => res.data)

export const updateCourse = (id, payload) =>
  api.patch(`/api/courses/${id}`, payload).then((res) => res.data)

export const deleteCourse = (id) =>
  api.delete(`/api/courses/${id}`).then((res) => res.data)

// ---- Admin extras --------------------------------------------------------
export const getAdminOrders = () => api.get('/api/admin/orders').then((res) => res.data)

export default api
