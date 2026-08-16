import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import NotificationList from "./NotificationList";

export default function NotificationBell({ notifications, loading, onRead }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        className="relative flex size-9 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors duration-150"
      >
        <Bell className={`size-4.5 ${unreadCount > 0 ? "animate-ring-pop" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-overdue text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-pop)] animate-pop-in">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <h4 className="font-display font-semibold text-sm text-ink-900">Notifications</h4>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-brand-500">{unreadCount} new</span>
            )}
          </div>
          <NotificationList notifications={notifications} loading={loading} onRead={onRead} />
        </div>
      )}
    </div>
  );
}
