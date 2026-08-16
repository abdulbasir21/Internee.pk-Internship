import { Trash2 } from "lucide-react";
import StatusBadge, { STATUS_META, effectiveStatus } from "./StatusBadge";
import { Select } from "../ui/Input";
import { SkeletonRow } from "../ui/Loader";
import EmptyState from "../ui/EmptyState";
import { ClipboardList } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskTable({
  tasks,
  loading,
  interns = [],
  filters,
  onFilterChange,
  onDelete,
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-5 py-4">
        <h3 className="font-display font-semibold text-ink-900 mr-auto">All tasks</h3>
        <Select
          value={filters.intern}
          onChange={(e) => onFilterChange({ ...filters, intern: e.target.value })}
          className="!h-9 w-auto min-w-40"
          aria-label="Filter by intern"
        >
          <option value="">All interns</option>
          {interns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {intern.name}
            </option>
          ))}
        </Select>
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="!h-9 w-auto min-w-36"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks match these filters"
          description="Try a different intern or status, or create a new task above."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-ink-500 border-b border-ink-100">
                <th className="px-5 py-3 font-medium">Task</th>
                <th className="px-5 py-3 font-medium">Assigned to</th>
                <th className="px-5 py-3 font-medium">Due date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const status = effectiveStatus(task);
                const rail = STATUS_META[status]?.rail;
                return (
                  <tr
                    key={task._id}
                    className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`size-1.5 rounded-full ${rail}`} aria-hidden="true" />
                        <span className="font-medium text-ink-900">{task.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500">{task.assignedTo?.name || "Unassigned"}</td>
                    <td className="px-5 py-3 text-ink-500 font-mono-num">{formatDate(task.dueDate)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => onDelete(task._id)}
                        className="rounded-md p-1.5 text-ink-300 hover:text-overdue hover:bg-overdue-bg transition-colors duration-150"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
