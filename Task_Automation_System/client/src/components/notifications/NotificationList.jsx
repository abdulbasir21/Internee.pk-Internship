import { Bell } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import { SkeletonLine } from "../ui/Loader";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function NotificationList({ notifications, loading, onRead }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonLine className="h-3 w-3/4" />
            <SkeletonLine className="h-2.5 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="You're all caught up"
        description="New task assignments and reminders will show up here."
      />
    );
  }

  return (
    <ul className="max-h-80 overflow-y-auto divide-y divide-ink-100">
      {notifications.map((note) => (
        <li key={note._id}>
          <button
            onClick={() => !note.read && onRead(note._id)}
            className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-ink-50 transition-colors duration-150"
          >
            {!note.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />}
            <div className={`flex flex-col gap-0.5 ${note.read ? "pl-5" : ""}`}>
              <p className={`text-sm ${note.read ? "text-ink-500" : "text-ink-900 font-medium"}`}>
                {note.message}
              </p>
              <span className="text-xs text-ink-300">{timeAgo(note.createdAt)}</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
