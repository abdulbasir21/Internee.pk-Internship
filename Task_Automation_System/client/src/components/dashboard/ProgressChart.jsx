import { STATUS_META } from "../tasks/StatusBadge";

export default function ProgressChart({ breakdown }) {
  const total = Object.values(breakdown).reduce((sum, n) => sum + n, 0);

  return (
    <div className="rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)] p-5 flex flex-col gap-4">
      <h3 className="font-display font-semibold text-ink-900">Task breakdown</h3>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
        {Object.entries(breakdown).map(([status, count]) => {
          if (!count) return null;
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div
              key={status}
              className={`h-full ${STATUS_META[status]?.rail} transition-all duration-500 ease-out first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${pct}%` }}
              title={`${STATUS_META[status]?.label}: ${count}`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(breakdown).map(([status, count]) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${STATUS_META[status]?.rail}`} />
            <span className="text-xs text-ink-500">{STATUS_META[status]?.label}</span>
            <span className="ml-auto text-xs font-semibold text-ink-900 font-mono-num">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
