import { useCallback, useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import * as api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import TaskCard from "../components/tasks/TaskCard";
import { SkeletonCard } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

export default function InternDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      // GET /tasks already returns only this intern's own tasks — the
      // backend filters by the logged-in user, no query params needed.
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

  useEffect(() => {
    loadTasks();
    loadNotifications();
  }, [loadTasks, loadNotifications]);

  const handleStatusChange = async (taskId, status) => {
    setUpdatingId(taskId);
    const previous = tasks;
    // Update optimistically so the control feels instant, then reconcile.
    setTasks((t) => t.map((task) => (task._id === taskId ? { ...task, status } : task)));
    try {
      await api.updateTaskStatus(taskId, status);
    } catch {
      setTasks(previous);
    } finally {
      setUpdatingId(null);
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

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Hey {user?.name?.split(" ")[0]},
          </h1>
          <p className="mt-1 text-sm text-ink-500">Here's what's on your plate right now.</p>
        </div>

        {tasksLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)]">
            <EmptyState
              icon={ClipboardCheck}
              title="No tasks yet"
              description="Your admin hasn't assigned you anything yet — check back soon."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                updating={updatingId === task._id}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
