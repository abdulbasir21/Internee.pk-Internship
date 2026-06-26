// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Users, ClipboardList, CheckCircle2, Plus, Trash2, ExternalLink, X } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../components/DashboardShell";
import StatusBadge from "../components/StatusBadge";

const BRAND_GRADIENT = "linear-gradient(135deg, #6356D6 0%, #4F44B0 100%)";

const card = {
  background: "#FFFFFF",
  borderRadius: 18,
  border: "1px solid rgba(18,19,31,0.07)",
  boxShadow: "0 1px 4px rgba(18,19,31,0.04), 0 4px 16px rgba(18,19,31,0.03)",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", deadline: "", intern: "" });

  useEffect(() => { loadInterns(); loadTasks(); }, []);

  async function loadInterns() { const res = await api.get("/interns"); setInterns(res.data); }
  async function loadTasks() { const res = await api.get("/tasks"); setTasks(res.data); }

  async function handleCreateTask(e) {
    e.preventDefault(); setMessage("");
    try {
      await api.post("/tasks", taskForm);
      setMessage("Task created and assigned.");
      setTaskForm({ title: "", description: "", deadline: "", intern: "" });
      setShowTaskForm(false); loadTasks();
    } catch (err) { setMessage(err.response?.data?.message || "Failed to create task."); }
  }

  async function handleDeleteIntern(id) {
    if (!window.confirm("Remove this intern?")) return;
    await api.delete(`/interns/${id}`); loadInterns();
  }
  async function handleDeleteTask(id) {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`); loadTasks();
  }

  const doneCount = tasks.filter(t => t.status === "done").length;
  const overdueCount = tasks.filter(t => t.status === "pending" && new Date(t.deadline) < new Date()).length;
  const pendingCount = tasks.length - doneCount - overdueCount;

  const statusData = [
    { name: "Done", value: doneCount, color: "#22C55E" },
    { name: "Pending", value: pendingCount, color: "#F59E0B" },
    { name: "Overdue", value: overdueCount, color: "#EF4444" },
  ].filter(d => d.value > 0);

  const tasksPerIntern = interns
    .map(i => ({ name: i.name.split(" ")[0], tasks: tasks.filter(t => t.intern?._id === i._id || t.intern === i._id).length }))
    .sort((a, b) => b.tasks - a.tasks).slice(0, 8);

  return (
    <DashboardShell roleLabel="Admin" icon={user?.name?.[0]?.toUpperCase() || "A"} name={user?.name} accentGradient={BRAND_GRADIENT} onLogout={logout}>

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#12131F", letterSpacing: "-0.4px", margin: 0 }}>Overview</h2>
          <p style={{ fontSize: 13, color: "#8C8FA8", marginTop: 4 }}>Manage interns and track task progress.</p>
        </div>
        <button
          onClick={() => setShowTaskForm(s => !s)}
          style={{ background: BRAND_GRADIENT, color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, cursor: "pointer", boxShadow: "0 4px 14px rgba(99,86,214,0.35)" }}
        >
          <Plus size={15} /> Assign task
        </button>
      </div>

      {message && (
        <div style={{ marginBottom: 20, background: "rgba(99,86,214,0.07)", border: "1px solid rgba(99,86,214,0.18)", color: "#5046C8", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 500 }}>
          {message}
        </div>
      )}

      {/* ── Stat cards — 1 col mobile, 3 col desktop ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<Users size={17} />} label="Total interns" value={interns.length} accent="#6356D6" accentBg="rgba(99,86,214,0.09)" />
        <StatCard icon={<ClipboardList size={17} />} label="Tasks assigned" value={tasks.length} accent="#0EA5E9" accentBg="rgba(14,165,233,0.09)" />
        <StatCard icon={<CheckCircle2 size={17} />} label="Completed" value={doneCount} accent="#22C55E" accentBg="rgba(34,197,94,0.09)" valueColor="#16A34A" />
      </div>

      {/* ── Charts — stacked on mobile, side by side on desktop ── */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div style={{ ...card, padding: "24px 28px" }} className="md:col-span-2">
            <p style={{ fontSize: 14, fontWeight: 700, color: "#12131F", margin: 0 }}>Tasks per intern</p>
            <p style={{ fontSize: 12, color: "#8C8FA8", marginTop: 3, marginBottom: 20 }}>Workload distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tasksPerIntern} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F0EEF9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8C8FA8" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8C8FA8" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(99,86,214,0.05)" }} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="tasks" fill="#6356D6" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ ...card, padding: "24px 28px" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#12131F", margin: 0 }}>Task status</p>
            <p style={{ fontSize: 12, color: "#8C8FA8", marginTop: 3, marginBottom: 4 }}>Across all tasks</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3}>
                  {statusData.map(d => <Cell key={d.name} fill={d.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={7} formatter={value => <span style={{ fontSize: 11, color: "#8C8FA8" }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Assign task form ── */}
      {showTaskForm && (
        <div style={{ ...card, padding: "24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#12131F", margin: 0 }}>Assign a new task</p>
              <p style={{ fontSize: 12, color: "#8C8FA8", marginTop: 3 }}>Fill in the details and choose an intern.</p>
            </div>
            <button type="button" onClick={() => setShowTaskForm(false)} style={{ background: "rgba(18,19,31,0.06)", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#8C8FA8" }}>
              <X size={14} />
            </button>
          </div>
          <form onSubmit={handleCreateTask}>
            {/* 1 col mobile, 2 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Task title">
                <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required style={inputStyle} placeholder="e.g. Write weekly report" />
              </FormField>
              <FormField label="Assign to">
                <select value={taskForm.intern} onChange={e => setTaskForm({ ...taskForm, intern: e.target.value })} required style={inputStyle}>
                  <option value="">Select an intern…</option>
                  {interns.map(i => <option key={i._id} value={i._id}>{i.name} ({i.email})</option>)}
                </select>
              </FormField>
              <FormField label="Deadline">
                <input type="date" value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })} required style={inputStyle} />
              </FormField>
              <FormField label="Description (optional)">
                <input value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} style={inputStyle} placeholder="Brief notes…" />
              </FormField>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
              <button type="submit" style={{ background: BRAND_GRADIENT, color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Create task
              </button>
              <button type="button" onClick={() => setShowTaskForm(false)} style={{ background: "none", border: "none", color: "#8C8FA8", fontSize: 13, cursor: "pointer", padding: "9px 12px" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Interns table — scrollable on mobile ── */}
      <Section title="Interns" count={interns.length}>
        {interns.length === 0 ? <EmptyState text="No interns have signed up yet." /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 400 }}>
              <thead>
                <tr>{["Name", "Email", "Department", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#8C8FA8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {interns.map(i => (
                  <tr key={i._id} style={{ borderTop: "1px solid rgba(18,19,31,0.06)" }}>
                    <td style={{ padding: "13px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {i.name[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: "#12131F" }}>{i.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 0", color: "#5E6177" }}>{i.email}</td>
                    <td style={{ padding: "13px 0" }}>
                      <span style={{ background: "rgba(99,86,214,0.08)", color: "#5046C8", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>{i.department || "General"}</span>
                    </td>
                    <td style={{ padding: "13px 0", textAlign: "right" }}>
                      <button onClick={() => handleDeleteIntern(i._id)} style={{ background: "none", border: "none", color: "#DC2626", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ── Tasks table — scrollable on mobile ── */}
      <Section title="All tasks" count={tasks.length}>
        {tasks.length === 0 ? <EmptyState text="No tasks created yet. Assign your first task above." /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 560 }}>
              <thead>
                <tr>{["Task", "Intern", "Deadline", "Status", "Submission", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#8C8FA8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {tasks.map(t => {
                  const overdue = t.status === "pending" && new Date(t.deadline) < new Date();
                  return (
                    <tr key={t._id} style={{ borderTop: "1px solid rgba(18,19,31,0.06)" }}>
                      <td style={{ padding: "13px 0", fontWeight: 600, color: "#12131F" }}>{t.title}</td>
                      <td style={{ padding: "13px 0", color: "#5E6177" }}>{t.intern?.name || "Unknown"}</td>
                      <td style={{ padding: "13px 0", color: overdue ? "#DC2626" : "#5E6177", fontWeight: overdue ? 600 : 400 }}>{new Date(t.deadline).toLocaleDateString()}</td>
                      <td style={{ padding: "13px 0" }}><StatusBadge status={t.status} overdue={overdue} /></td>
                      <td style={{ padding: "13px 0", maxWidth: 160 }}>
                        {t.submission ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#6356D6", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <ExternalLink size={11} />{t.submission}
                          </span>
                        ) : <span style={{ color: "#C5C7D8" }}>—</span>}
                      </td>
                      <td style={{ padding: "13px 0", textAlign: "right" }}>
                        <button onClick={() => handleDeleteTask(t._id)} style={{ background: "none", border: "none", color: "#DC2626", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </DashboardShell>
  );
}

const inputStyle = { width: "100%", boxSizing: "border-box", height: 40, borderRadius: 10, border: "1px solid rgba(18,19,31,0.12)", background: "#FAFAFE", padding: "0 13px", fontSize: 13, color: "#12131F", outline: "none" };

function StatCard({ icon, label, value, accent, accentBg, valueColor }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(18,19,31,0.07)", boxShadow: "0 1px 4px rgba(18,19,31,0.04)", padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: accentBg, display: "flex", alignItems: "center", justifyContent: "center", color: accent, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color: valueColor || "#12131F", margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 12, color: "#8C8FA8", marginTop: 5 }}>{label}</p>
      </div>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(18,19,31,0.07)", boxShadow: "0 1px 4px rgba(18,19,31,0.04)", padding: "24px 28px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#12131F", margin: 0 }}>{title}</h3>
        <span style={{ background: "rgba(99,86,214,0.09)", color: "#6356D6", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8C8FA8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ text }) {
  return <div style={{ textAlign: "center", padding: "32px 0" }}><p style={{ fontSize: 13, color: "#B0B3C8", margin: 0 }}>{text}</p></div>;
}