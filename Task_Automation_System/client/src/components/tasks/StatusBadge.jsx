import { Clock, Loader, CheckCircle2, AlertTriangle } from "lucide-react";

// The one place status → color/label/icon is defined, so every part of
// the app (cards, table rows, filters, stats) stays visually consistent.
export const STATUS_META = {
  pending: {
    label: "Pending",
    text: "text-pending",
    bg: "bg-pending-bg",
    rail: "bg-pending-rail",
    icon: Clock,
  },
  "in-progress": {
    label: "In progress",
    text: "text-progress",
    bg: "bg-progress-bg",
    rail: "bg-progress-rail",
    icon: Loader,
  },
  done: {
    label: "Done",
    text: "text-done",
    bg: "bg-done-bg",
    rail: "bg-done-rail",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Overdue",
    text: "text-overdue",
    bg: "bg-overdue-bg",
    rail: "bg-overdue-rail",
    icon: AlertTriangle,
  },
};

// A task is visually "overdue" if it's past due and not yet done — this
// derives that, since the backend status field only tracks the workflow.
export function effectiveStatus(task) {
  if (task.status === "done") return "done";
  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
  return isPastDue ? "overdue" : task.status;
}

export default function StatusBadge({ status, className = "" }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
        ${meta.bg} ${meta.text} ${className}`}
    >
      <Icon className="size-3.5" strokeWidth={2.25} />
      {meta.label}
    </span>
  );
}
