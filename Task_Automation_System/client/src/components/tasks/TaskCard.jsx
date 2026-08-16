import { Calendar } from "lucide-react";
import StatusBadge, { STATUS_META, effectiveStatus } from "./StatusBadge";
import StatusControl from "./StatusControl";

function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function TaskCard({ task, onStatusChange, updating }) {
  const status = effectiveStatus(task);
  const rail = STATUS_META[status]?.rail || STATUS_META.pending.rail;

  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] animate-fade-in-up">
      <span className={`absolute inset-y-0 left-0 w-1 ${rail}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <h3 className="font-display font-semibold text-ink-900 leading-snug">{task.title}</h3>
        <StatusBadge status={status} className="shrink-0" />
      </div>
      {task.description && (
        <p className="px-5 text-sm text-ink-500 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-1.5 px-5 text-xs text-ink-500">
        <Calendar className="size-3.5" />
        Due {formatDate(task.dueDate)}
      </div>
      <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-1">
        <StatusControl
          status={task.status}
          disabled={updating}
          onChange={(next) => onStatusChange(task._id, next)}
        />
      </div>
    </div>
  );
}
