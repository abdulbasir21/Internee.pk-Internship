import { useCallback, useEffect, useMemo, useState } from "react";
import { ListChecks, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import * as api from "../services/api";
import Navbar from "../components/layout/Navbar";
import StatsCard from "../components/dashboard/StatsCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import TaskForm from "../components/tasks/TaskForm";
import TaskTable from "../components/tasks/TaskTable";
import { SkeletonCard } from "../components/ui/Loader";
import { effectiveStatus } from "../components/tasks/StatusBadge";

const EMPTY_STATS = {
  totalTasks: 0,
  doneTasks: 0,
  completionRate: 0,
  overdueCount: 0,
  internSummary: [],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filters, setFilters] = useState({ intern: "", status: "" });

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const [interns, setInterns] = useState([]);
  const [internsLoading, setInternsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats({ ...EMPTY_STATS, ...data });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      // GET /tasks has no filter query params — admin gets every task
      // back and we filter client-side below.
      const data = await api.getTasks();
      setTasks(data);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  // Full intern roster for the "assign to" / "filter by intern" dropdowns.
  // Pulled from /users/interns (not from task stats), so a newly
  // registered intern shows up immediately even before they have any
  // tasks assigned.
  const loadInterns = useCallback(async () => {
    setInternsLoading(true);
    try {
      const data = await api.getInterns();
      setInterns(data.map((i) => ({ id: i._id, name: i.name })));
    } finally {
      setInternsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadTasks();
    loadNotifications();
    loadInterns();
  }, [loadStats, loadTasks, loadNotifications, loadInterns]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.intern && task.assignedTo?._id !== filters.intern) return false;
      if (filters.status && effectiveStatus(task) !== filters.status) return false;
      return true;
    });
  }, [tasks, filters]);

  // The breakdown chart needs per-status counts, which /dashboard/stats
  // doesn't provide directly — derive it from the full task list instead.
  const breakdown = useMemo(() => {
    const counts = { pending: 0, "in-progress": 0, done: 0, overdue: 0 };
    tasks.forEach((task) => {
      const status = effectiveStatus(task);
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  const handleCreate = async (values) => {
    setCreating(true);
    try {
      await api.createTask(values);
      await Promise.all([loadTasks(), loadStats()]);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (taskId) => {
    const previous = tasks;
    setTasks((t) => t.filter((task) => task._id !== taskId));
    try {
      await api.deleteTask(taskId);
      loadStats();
    } catch {
      setTasks(previous);
    }
  };

  const handleNotificationRead = async (id) => {
    setNotifications((n) => n.map((note) => (note._id === id ? { ...note, read: true } : note)));
    try {
      await api.markNotificationRead(id);
    } catch {
      // Non-critical — leave it marked read locally even if the sync fails.
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar
        notifications={notifications}
        notificationsLoading={notificationsLoading}
        onNotificationRead={handleNotificationRead}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink-900">Overview</h1>
          <p className="mt-1 text-sm text-ink-500">Track progress across every intern's tasks.</p>
        </div>

        {statsLoading ? (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Total tasks" value={stats.totalTasks} icon={ListChecks} tone="brand" />
            <StatsCard label="Completed" value={stats.completionRate} suffix="%" icon={CheckCircle2} tone="done" />
            <StatsCard label="Overdue" value={stats.overdueCount} icon={AlertTriangle} tone="overdue" />
            <StatsCard label="Active interns" value={stats.internSummary.length} icon={Users} tone="progress" />
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]">
          <TaskForm interns={interns} onCreate={handleCreate} creating={creating} />
          <ProgressChart breakdown={breakdown} />
        </div>

        <TaskTable
          tasks={filteredTasks}
          loading={tasksLoading}
          interns={interns}
          filters={filters}
          onFilterChange={setFilters}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
