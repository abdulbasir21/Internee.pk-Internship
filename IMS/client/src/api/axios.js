// src/api/axios.js
//
// One shared axios setup for the whole app.
// It automatically attaches the login token to every request,
// so we don't have to repeat that code everywhere.

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change this later when you deploy the backend online
});

// Before every request, check if a token is saved in the browser,
// and attach it to the request header automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
