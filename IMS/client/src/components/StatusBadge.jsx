// src/components/StatusBadge.jsx
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const styles = {
  done: {
    background: "rgba(34,197,94,0.10)",
    color: "#16A34A",
    border: "1px solid rgba(34,197,94,0.20)",
  },
  overdue: {
    background: "rgba(239,68,68,0.10)",
    color: "#DC2626",
    border: "1px solid rgba(239,68,68,0.20)",
  },
  pending: {
    background: "rgba(245,158,11,0.10)",
    color: "#B45309",
    border: "1px solid rgba(245,158,11,0.20)",
  },
};

export default function StatusBadge({ status, overdue }) {
  if (overdue) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={styles.overdue}
      >
        <AlertCircle size={11} />
        Overdue
      </span>
    );
  }

  if (status === "done") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={styles.done}
      >
        <CheckCircle2 size={11} />
        Done
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={styles.pending}
    >
      <Clock size={11} />
      Pending
    </span>
  );
}