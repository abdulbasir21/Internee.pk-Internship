import { Flag } from "lucide-react";
import MilestoneProgressBar from "./MilestoneProgressBar";
import EmptyState from "../ui/EmptyState";
import Card from "../ui/Card";

// Read-only in Part 1 — no create/edit affordance here on purpose.
// Milestone creation is an admin-only screen that ships in Part 2.
export default function MilestoneSidebar({ milestones, loading, pulsingIds }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-ink">
          Milestones
        </h2>
        <span className="text-xs font-mono text-ink-faint">
          {milestones.length}
        </span>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-32 bg-sunken rounded" />
              <div className="h-2 w-full bg-sunken rounded-full" />
            </div>
          ))}
        </div>
      ) : milestones.length === 0 ? (
        <EmptyState
          icon={<Flag size={18} />}
          title="No milestones yet"
          description="Milestones set by your admin will show up here with live progress."
        />
      ) : (
        <ul className="space-y-5">
          {milestones.map((m) => (
            <li
              key={m._id}
              className={`rounded-xl transition-shadow ${
                pulsingIds?.has(m._id) ? "live-pulse" : ""
              }`}
              style={{ "--pulse-color": "var(--color-brand)" }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="text-sm font-semibold text-ink truncate">
                  {m.title}
                </span>
                <span className="text-xs font-mono text-ink-faint shrink-0">
                  {m.doneTasks}/{m.totalTasks}
                </span>
              </div>
              <MilestoneProgressBar progress={m.progress} />
              {m.targetDate && (
                <p className="text-xs text-ink-faint mt-1.5">
                  Due {new Date(m.targetDate).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
