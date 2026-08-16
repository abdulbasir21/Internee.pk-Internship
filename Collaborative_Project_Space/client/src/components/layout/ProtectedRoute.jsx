import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Wrap any page that requires a logged-in user. Pass `role` to also
// restrict it to a single role (e.g. the /admin placeholder).
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && userRole !== role) {
    // Logged in but wrong role — send them to the place that's actually
    // theirs rather than a dead end.
    return <Navigate to={userRole === "admin" ? "/admin" : "/projects"} replace />;
  }
  return children;
}
