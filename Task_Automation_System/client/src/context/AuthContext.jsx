import { createContext, useContext, useState, useCallback } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Hydrate synchronously from localStorage so a refresh doesn't
  // bounce the user through a flash of "logged out".
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      // Corrupt or stale localStorage value — don't crash the whole app.
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const persistSession = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async ({ email, password }) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const data = await api.login({ email, password });
      // The backend returns role separately from user — merge them so
      // the rest of the app can just read user.role in one place.
      const userWithRole = { ...data.user, role: data.role };
      persistSession(data.token, userWithRole);
      return userWithRole;
    } catch (err) {
      const message =
        err.response?.data?.message || "Couldn't sign in. Check your details and try again.";
      setAuthError(message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      // Role is always forced to "intern" server-side — signup can't create admins.
      const data = await api.signup({ name, email, password });
      const userWithRole = { ...data.user, role: data.role };
      persistSession(data.token, userWithRole);
      return userWithRole;
    } catch (err) {
      const message =
        err.response?.data?.message || "Couldn't create your account. Try again.";
      setAuthError(message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    authError,
    authLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
