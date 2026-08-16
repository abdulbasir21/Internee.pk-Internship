import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Wrap any page that requires login (and optionally a specific role).
// Not logged in -> bounce to /login and remember where they were headed.
// Wrong role -> bounce to home rather than showing a broken page.
export default function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireRole && role !== requireRole) {
    return <Navigate to="/" replace />
  }

  return children
}
