import { useNavigate } from "react-router-dom";
import { Users, ListTodo, ChevronRight, FolderKanban } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

// Row-per-project admin view. A table on larger screens collapses to a
// stacked card list on mobile via CSS rather than two separate markups.
export default function ProjectTable({ projects, taskCounts, onCreateClick }) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <Card className="py-4">
        <EmptyState
          icon={<FolderKanban size={18} />}
          title="No projects yet"
          description="Create your first one to start assigning interns and tracking work."
          action={
            onCreateClick && (
              <Button size="sm" onClick={onCreateClick}>
                Create a project
              </Button>
            )
          }
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <ul className="divide-y divide-border-soft">
        {projects.map((p, i) => (
          <li key={p._id} style={{ animationDelay: `${i * 30}ms` }} className="fade-in-up">
            <button
              onClick={() => navigate(`/admin/projects/${p._id}`)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-sunken transition-colors duration-150 group"
            >
              <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center shrink-0">
                <FolderKanban size={17} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink truncate">
                  {p.name}
                </p>
                <p className="text-xs text-ink-faint truncate mt-0.5">
                  {p.description || "No description"}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs font-mono text-ink-faint">
                <span className="flex items-center gap-1.5" title="Members">
                  <Users size={13} />
                  {p.members?.length ?? 0}
                </span>
                <span className="flex items-center gap-1.5" title="Tasks">
                  <ListTodo size={13} />
                  {taskCounts[p._id] ?? "–"}
                </span>
              </div>

              <ChevronRight
                size={16}
                className="text-ink-faint shrink-0 group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
