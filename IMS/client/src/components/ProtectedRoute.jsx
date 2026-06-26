// src/components/ProtectedRoute.jsx
//
// Wraps a page and only shows it if the right type of user is logged in.
// Example: <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
// If no admin is logged in, it redirects back to the admin login page.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    // Send them to the correct login page based on what role this route needed
    return <Navigate to={role === "admin" ? "/admin/login" : "/intern/login"} replace />;
  }

  return children;
}
