// src/context/AuthContext.jsx
//
// This keeps track of WHO is logged in (admin or intern) across the whole app,
// so every page can check "is someone logged in? what's their role?"
// without re-fetching that info every time.

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Try to load saved user info from the browser on first load,
  // so refreshing the page doesn't log the user out.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(userData, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so any component can simply do: const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
