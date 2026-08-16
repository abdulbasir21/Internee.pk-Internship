import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// --- Local storage helpers for the private edit key ---
// The edit key is generated once by the server when a portfolio is
// created and never appears in the public URL. Keeping it in
// localStorage lets the same browser return to /editor/:id and keep
// editing without a login system.
const keyFor = (portfolioId) => `showcase:editKey:${portfolioId}`;

export function saveEditKey(portfolioId, editKey) {
  localStorage.setItem(keyFor(portfolioId), editKey);
}

export function getEditKey(portfolioId) {
  return localStorage.getItem(keyFor(portfolioId));
}

function authHeaders(portfolioId) {
  const key = getEditKey(portfolioId);
  return key ? { "x-edit-key": key } : {};
}

// --- Portfolios ---
export const createPortfolio = (payload) => api.post("/portfolios", payload).then((r) => r.data);

export const getPublicPortfolio = (slug) =>
  api.get(`/portfolios/slug/${slug}`).then((r) => r.data);

export const getEditorPortfolio = (portfolioId) =>
  api
    .get(`/portfolios/${portfolioId}/editor`, { headers: authHeaders(portfolioId) })
    .then((r) => r.data);

export const updatePortfolio = (portfolioId, payload) =>
  api
    .put(`/portfolios/${portfolioId}`, payload, { headers: authHeaders(portfolioId) })
    .then((r) => r.data);

// --- Projects ---
export const createProject = (portfolioId, formData) =>
  api
    .post(`/portfolios/${portfolioId}/projects`, formData, {
      headers: { ...authHeaders(portfolioId), "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const updateProject = (portfolioId, projectId, formData) =>
  api
    .put(`/projects/${projectId}`, formData, {
      headers: { ...authHeaders(portfolioId), "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const deleteProject = (portfolioId, projectId) =>
  api
    .delete(`/projects/${projectId}`, { headers: authHeaders(portfolioId) })
    .then((r) => r.data);

export default api;
