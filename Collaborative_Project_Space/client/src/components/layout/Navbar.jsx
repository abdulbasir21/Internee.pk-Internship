import { Link, useNavigate } from "react-router-dom";
import { LogOut, LayoutGrid } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          to={isAuthenticated ? (user.role === "admin" ? "/admin" : "/projects") : "/login"}
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
            <LayoutGrid size={16} strokeWidth={2.5} />
          </span>
          Fieldwork
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-semibold text-ink">
                {user.name}
              </span>
              <span className="text-xs text-ink-faint capitalize">
                {user.role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center font-semibold text-sm">
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-faint hover:text-danger hover:bg-danger-soft transition-colors duration-150"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
