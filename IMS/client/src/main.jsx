// src/main.jsx
//
// This is the very first file that runs. It mounts the React app
// into the HTML page, wrapped with:
// - BrowserRouter: enables page navigation (routing)
// - AuthProvider: gives every page access to login state

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
