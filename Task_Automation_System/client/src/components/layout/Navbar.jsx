import { useState } from "react";
import { CheckSquare, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

export default function Navbar({ notifications = [], notificationsLoading, onNotificationRead }) {
  const { user, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-ink-100 bg-surface/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2 font-display font-semibold text-ink-900">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500 text-white">
          <CheckSquare className="size-4.5" strokeWidth={2.25} />
        </span>
        <span className="hidden sm:inline">Basecamp</span>
      </div>

      <span className="hidden rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500 sm:inline">
        {role === "admin" ? "Admin" : "Intern"}
      </span>

      <div className="ml-auto flex items-center gap-1">
        <NotificationBell
          notifications={notifications}
          loading={notificationsLoading}
          onRead={onNotificationRead}
        />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-ink-100 transition-colors duration-150"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
              {initials}
            </span>
            <ChevronDown className="hidden size-3.5 text-ink-500 sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-pop)] p-1 animate-pop-in">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-medium text-ink-900">{user?.name}</p>
                <p className="truncate text-xs text-ink-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-sm text-overdue hover:bg-overdue-bg transition-colors duration-150"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
