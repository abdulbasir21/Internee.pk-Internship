import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../ui/Loader";

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role, authLoading } = useAuth();

  if (authLoading) return <PageLoader label="Checking your session…" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}
