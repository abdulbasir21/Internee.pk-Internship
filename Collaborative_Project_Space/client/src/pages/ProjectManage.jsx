import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, X, Plus, Flag, UserPlus, ExternalLink } from "lucide-react";
import { projectsApi, milestonesApi, usersApi } from "../services/api";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import MemberSelector from "../components/admin/MemberSelector";
import MilestoneForm from "../components/admin/MilestoneForm";
import MilestoneProgressBar from "../components/board/MilestoneProgressBar";

export default function ProjectManage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [interns, setInterns] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addSelection, setAddSelection] = useState([]);
  const [addingMembers, setAddingMembers] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [milestoneFormOpen, setMilestoneFormOpen] = useState(false);

  const loadProject = useCallback(() => {
    return projectsApi
      .get(projectId)
      .then(({ data }) => setProject(data.project ?? data.data));
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      projectsApi.get(projectId),
      milestonesApi.list(projectId),
      usersApi.listInterns().catch(() => ({ data: {} })),
    ])
      .then(([projectRes, milestonesRes, internsRes]) => {
        if (cancelled) return;
        setProject(projectRes.data.project ?? projectRes.data.data);
        setMilestones(milestonesRes.data.milestones ?? milestonesRes.data.data ?? []);
        setInterns(
          internsRes.data.users ?? internsRes.data.interns ?? internsRes.data.data ?? []
        );
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this project. Try refreshing.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const members = project?.members ?? [];
  const memberIds = useMemo(() => new Set(members.map((m) => m._id)), [members]);
  const availableInterns = useMemo(
    () => interns.filter((i) => !memberIds.has(i._id)),
    [interns, memberIds]
  );

  const toggleAddSelection = (id) =>
    setAddSelection((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const handleAddMembers = async () => {
    if (addSelection.length === 0) return;
    setAddingMembers(true);
    setError("");
    try {
      await projectsApi.updateMembers(projectId, { add: addSelection });
      await loadProject();
      setAddSelection([]);
    } catch {
      setError("Couldn't add those members. Try again.");
    } finally {
      setAddingMembers(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    setRemovingId(userId);
    setError("");
    try {
      await projectsApi.updateMembers(projectId, { remove: [userId] });
      await loadProject();
    } catch {
      setError("Couldn't remove that member. Try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleCreateMilestone = async (data) => {
    const { data: res } = await milestonesApi.create(projectId, data);
    const created = res.milestone ?? res.data;
    if (created) {
      setMilestones((prev) => [...prev, created]);
    } else {
      milestonesApi
        .list(projectId)
        .then(({ data }) => setMilestones(data.milestones ?? data.data ?? []));
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Admin dashboard
        </button>

        {loading ? (
          <div className="space-y-5 animate-pulse">
            <div className="h-8 w-64 bg-surface border border-border rounded-lg" />
            <div className="h-40 bg-surface border border-border rounded-2xl" />
            <div className="h-40 bg-surface border border-border rounded-2xl" />
          </div>
        ) : !project ? (
          <p className="text-sm text-danger">{error || "Project not found."}</p>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
              <div>
                <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">
                  {project.name}
                </h1>
                {project.description && (
                  <p className="text-sm text-ink-soft mt-1 max-w-xl">
                    {project.description}
                  </p>
                )}
              </div>
              <Link to={`/projects/${projectId}`}>
                <Button variant="secondary">
                  <ExternalLink size={15} />
                  View board
                </Button>
              </Link>
            </div>

            {error && <p className="text-sm text-danger mb-4">{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Members */}
              <Card className="p-5">
                <h2 className="font-display text-lg font-semibold text-ink mb-4">
                  Members
                </h2>

                {members.length === 0 ? (
                  <EmptyState
                    icon={<UserPlus size={18} />}
                    title="No members yet"
                    description="Add interns to this project below."
                  />
                ) : (
                  <ul className="space-y-1.5 mb-5">
                    {members.map((m) => (
                      <li
                        key={m._id}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-sunken"
                      >
                        <span className="w-8 h-8 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center font-semibold text-xs shrink-0">
                          {m.name?.[0]?.toUpperCase() ?? "?"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink truncate">
                            {m.name}
                          </span>
                          <span className="block text-xs text-ink-faint truncate">
                            {m.email}
                          </span>
                        </span>
                        <button
                          onClick={() => handleRemoveMember(m._id)}
                          disabled={removingId === m._id}
                          className="text-ink-faint hover:text-danger hover:bg-danger-soft w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 disabled:opacity-50"
                          aria-label={`Remove ${m.name}`}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-4 border-t border-border-soft">
                  <p className="text-sm font-semibold text-ink mb-2">
                    Add interns
                  </p>
                  <MemberSelector
                    interns={availableInterns}
                    selectedIds={addSelection}
                    onToggle={toggleAddSelection}
                    emptyLabel={
                      interns.length === 0
                        ? "No interns found."
                        : "Everyone's already on this project."
                    }
                  />
                  {availableInterns.length > 0 && (
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={handleAddMembers}
                      disabled={addSelection.length === 0 || addingMembers}
                    >
                      <Plus size={15} />
                      {addingMembers
                        ? "Adding…"
                        : addSelection.length > 0
                        ? `Add ${addSelection.length} member${addSelection.length === 1 ? "" : "s"}`
                        : "Add selected"}
                    </Button>
                  )}
                </div>
              </Card>

              {/* Milestones */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Milestones
                  </h2>
                  <Button size="sm" onClick={() => setMilestoneFormOpen(true)}>
                    <Plus size={14} />
                    New
                  </Button>
                </div>

                {milestones.length === 0 ? (
                  <EmptyState
                    icon={<Flag size={18} />}
                    title="No milestones yet"
                    description="Create one to start tracking progress on this project's board."
                  />
                ) : (
                  <ul className="space-y-5">
                    {milestones.map((m) => (
                      <li key={m._id}>
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                          <span className="text-sm font-semibold text-ink truncate">
                            {m.title}
                          </span>
                          <span className="text-xs font-mono text-ink-faint shrink-0">
                            {m.doneTasks ?? 0}/{m.totalTasks ?? 0}
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
            </div>
          </>
        )}
      </main>

      <MilestoneForm
        open={milestoneFormOpen}
        onClose={() => setMilestoneFormOpen(false)}
        onSubmit={handleCreateMilestone}
      />
    </div>
  );
}
