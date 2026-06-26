// src/pages/InternDashboard.jsx
//
// The intern's real workspace. From here an intern can:
// 1. View every task assigned to them, with deadlines clearly marked
// 2. Submit their work (a note or link) when a task is finished
// 3. Watch their progress ring update immediately as tasks are completed
//
// "Real-time" here means: every action (submit, refresh) immediately
// re-fetches tasks and recalculates progress, so the dashboard always
// reflects the latest state without needing a page reload.

import { useEffect, useState } from "react";
import { ClipboardList, Calendar, Send, RefreshCw, Inbox } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import StatusBadge from "../components/StatusBadge";
import ProgressRing from "../components/ProgressRing";

const TEAL_GRADIENT = "linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)";

export default function InternDashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTaskId, setOpenTaskId] = useState(null); // which task's submit box is expanded
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  }

  function isOverdue(task) {
    return task.status === "pending" && new Date(task.deadline) < new Date();
  }

  function openSubmitBox(task) {
    setOpenTaskId(task._id);
    setSubmissionText(task.submission || "");
  }

  async function handleSubmitWork(taskId) {
    if (!submissionText.trim()) return;
    setSubmitting(true);
    try {
      await api.put(`/tasks/${taskId}/submit`, { submission: submissionText });
      setOpenTaskId(null);
      setSubmissionText("");
      await loadTasks(); // refresh immediately so progress updates right away
    } finally {
      setSubmitting(false);
    }
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
  const overdueCount = tasks.filter(isOverdue).length;
  const pendingCount = totalTasks - doneTasks - overdueCount;

  const statusData = [
    { name: "Done", value: doneTasks, color: "#16A34A" },
    { name: "Pending", value: pendingCount, color: "#D97706" },
    { name: "Overdue", value: overdueCount, color: "#E0504F" },
  ].filter((d) => d.value > 0);

  // Sort: overdue first, then pending, then done - so what needs attention shows up top
  const sortedTasks = [...tasks].sort((a, b) => {
    const rank = (t) => (isOverdue(t) ? 0 : t.status === "pending" ? 1 : 2);
    return rank(a) - rank(b);
  });

  return (
    <DashboardShell
      roleLabel="Intern"
      icon={user?.name?.[0]?.toUpperCase() || "I"}
      name={user?.name}
      accentGradient={TEAL_GRADIENT}
      onLogout={logout}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-semibold text-ink-900 tracking-tight">My Tasks</h2>
          <p className="text-sm text-ink-700/60 mt-1">
            Everything assigned to you, in one place.
          </p>
        </div>
        <button
          onClick={loadTasks}
          className="flex items-center gap-2 text-sm text-ink-700/70 hover:text-ink-900 bg-white border border-ink-900/10 rounded-xl px-3 py-2 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* --- Progress overview --- */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="col-span-2 bg-white rounded-2xl shadow-card border border-ink-900/5 p-6 flex items-center gap-8">
          <ProgressRing percent={progressPercent} />
          <div className="flex-1 grid grid-cols-3 gap-4">
            <Stat label="Total tasks" value={totalTasks} />
            <Stat label="Completed" value={doneTasks} accent="text-good-600" />
            <Stat label="Overdue" value={overdueCount} accent={overdueCount > 0 ? "text-bad-600" : ""} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-ink-900/5 p-6">
          <h3 className="font-display font-semibold text-ink-900 mb-1 text-sm">Breakdown</h3>
          {totalTasks === 0 ? (
            <p className="text-xs text-ink-700/50 mt-6 text-center">No tasks yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={62} paddingAngle={2}>
                  {statusData.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(18,19,31,0.08)", fontSize: 13 }} />
                <Legend
                  verticalAlign="bottom"
                  height={20}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 11, color: "#7C7E91" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* --- Task list --- */}
      <div className="space-y-3">
        {sortedTasks.length === 0 && !loading && (
          <div className="bg-white rounded-2xl border border-dashed border-ink-900/15 p-12 text-center">
            <Inbox className="mx-auto text-ink-900/20" size={36} />
            <p className="mt-3 text-sm text-ink-700/60">
              No tasks assigned yet. Check back once your admin assigns your first task.
            </p>
          </div>
        )}

        {sortedTasks.map((task) => {
          const overdue = isOverdue(task);
          const isOpen = openTaskId === task._id;

          return (
            <div
              key={task._id}
              className={`bg-white rounded-2xl border p-5 transition-colors ${
                overdue ? "border-bad-500/30" : "border-ink-900/5 hover:border-ink-900/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ClipboardList size={16} className="text-teal-500" />
                    <h3 className="font-display font-semibold text-ink-900">{task.title}</h3>
                  </div>
                  {task.description && (
                    <p className="text-sm text-ink-700/70 mb-2 pl-6">{task.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 pl-6 text-xs text-ink-700/60">
                    <Calendar size={13} />
                    Due {new Date(task.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </div>

                  {task.submission && (
                    <div className="mt-3 pl-6 bg-good-50 border border-good-500/20 rounded-lg px-3 py-2">
                      <p className="text-xs font-medium text-good-600 mb-0.5">Your submission</p>
                      <p className="text-sm text-ink-900/80">{task.submission}</p>
                    </div>
                  )}
                </div>

                <StatusBadge status={task.status} overdue={overdue} />
              </div>

              {/* --- Submit work area --- */}
              {task.status === "pending" && (
                <div className="mt-4 pl-6">
                  {!isOpen ? (
                    <button
                      onClick={() => openSubmitBox(task)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors"
                    >
                      <Send size={14} />
                      Submit work
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        autoFocus
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Paste a link to your work, or describe what you finished..."
                        className="w-full text-sm rounded-lg border border-ink-900/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSubmitWork(task._id)}
                          disabled={submitting || !submissionText.trim()}
                          className="text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                          style={{ background: TEAL_GRADIENT }}
                        >
                          {submitting ? "Submitting..." : "Submit and mark done"}
                        </button>
                        <button
                          onClick={() => setOpenTaskId(null)}
                          className="text-sm text-ink-700/60 hover:text-ink-900 px-3 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}

function Stat({ label, value, accent = "" }) {
  return (
    <div>
      <p className={`text-2xl font-display font-bold ${accent || "text-ink-900"}`}>{value}</p>
      <p className="text-xs text-ink-700/60 mt-0.5">{label}</p>
    </div>
  );
}
