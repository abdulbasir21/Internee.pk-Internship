import { useEffect, useState, useCallback } from "react";
import { FolderKanban, Users, ListTodo, Plus } from "lucide-react";
import { projectsApi, tasksApi, usersApi } from "../services/api";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import StatsCard from "../components/admin/StatsCard";
import ProjectTable from "../components/admin/ProjectTable";
import ProjectForm from "../components/admin/ProjectForm";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const loadProjects = useCallback(() => {
    setLoadingProjects(true);
    return projectsApi
      .list()
      .then(({ data }) => data.projects ?? data.data ?? [])
      .then((list) => {
        setProjects(list);
        return list;
      })
      .catch(() => {
        setError("Couldn't load projects. Try refreshing.");
        return [];
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  // Interns list — see services/api.js note: this endpoint isn't
  // documented in the backend's PROGRESS.md, so a failure here degrades
  // gracefully (empty list, member-picking disabled) rather than
  // breaking the whole dashboard.
  useEffect(() => {
    usersApi
      .listInterns()
      .then(({ data }) => setInterns(data.users ?? data.interns ?? data.data ?? []))
      .catch(() => setInterns([]));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Total task count isn't exposed as a single number anywhere in
  // PROGRESS.md, so it's derived client-side: one tasks-list call per
  // project, summed. Fine at intern-tool scale (same assumption the
  // backend makes about pagination — see PROGRESS.md §7).
  useEffect(() => {
    if (loadingProjects) return;
    if (projects.length === 0) {
      setTaskCounts({});
      setLoadingStats(false);
      return;
    }
    let cancelled = false;
    setLoadingStats(true);
    Promise.all(
      projects.map((p) =>
        tasksApi
          .list(p._id)
          .then(({ data }) => [p._id, (data.tasks ?? data.data ?? []).length])
          .catch(() => [p._id, 0])
      )
    ).then((pairs) => {
      if (cancelled) return;
      setTaskCounts(Object.fromEntries(pairs));
      setLoadingStats(false);
    });
    return () => {
      cancelled = true;
    };
  }, [projects, loadingProjects]);

  const totalTasks = Object.values(taskCounts).reduce((a, b) => a + b, 0);

  const handleCreateProject = async ({ name, description, memberIds }) => {
    const { data } = await projectsApi.create({
      name,
      description,
      memberIds,
    });
    const created = data.project ?? data.data;
    if (created) {
      setProjects((prev) => [created, ...prev]);
    } else {
      loadProjects();
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">
              Admin dashboard
            </h1>
            <p className="text-sm text-ink-soft mt-1.5">
              Set up projects, assign interns, and track milestones.
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus size={16} />
            New project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatsCard
            icon={<FolderKanban size={19} />}
            label="Total projects"
            value={projects.length}
            loading={loadingProjects}
          />
          <StatsCard
            icon={<Users size={19} />}
            label="Total interns"
            value={interns.length}
            loading={loadingProjects}
          />
          <StatsCard
            icon={<ListTodo size={19} />}
            label="Total tasks"
            value={totalTasks}
            loading={loadingProjects || loadingStats}
          />
        </div>

        {error && <p className="text-sm text-danger mb-4">{error}</p>}

        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            All projects
          </h2>
        </div>

        {loadingProjects ? (
          <div className="space-y-3 animate-pulse">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 bg-surface border border-border rounded-2xl" />
            ))}
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            taskCounts={taskCounts}
            onCreateClick={() => setFormOpen(true)}
          />
        )}
      </main>

      <ProjectForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateProject}
        interns={interns}
      />
    </div>
  );
}
