// src/App.jsx
//
// This file defines all the URL routes in the app and which page each one shows.

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import InternLogin from "./pages/InternLogin";
import InternSignup from "./pages/InternSignup";
import AdminDashboard from "./pages/AdminDashboard";
import InternDashboard from "./pages/InternDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Public login pages */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/intern/login" element={<InternLogin />} />
      <Route path="/intern/signup" element={<InternSignup />} />

      {/* Protected pages - only reachable if the correct role is logged in */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/intern/dashboard"
        element={
          <ProtectedRoute role="intern">
            <InternDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
