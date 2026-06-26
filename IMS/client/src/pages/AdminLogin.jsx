// src/pages/AdminLogin.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, AlertCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-ink-950 flex items-center justify-center px-4 overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none bg-grid"
        style={{ backgroundSize: "48px 48px" }}
      />
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,86,217,0.22) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,158,117,0.18) 0%, transparent 70%)" }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-[14px] mb-4"
            style={{ background: "linear-gradient(135deg, #534AB7 0%, #3C3489 100%)", border: "0.5px solid rgba(127,119,221,0.4)" }}>
            <ShieldCheck size={20} color="#ffffff" />
          </div>
          <h1 className="text-xl font-display font-semibold text-white tracking-tight">Admin login</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Manage interns and tasks
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)" }}>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@company.com"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
                onFocus={e => e.target.style.border = "0.5px solid rgba(127,119,221,0.6)"}
                onBlur={e => e.target.style.border = "0.5px solid rgba(255,255,255,0.12)"}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
                onFocus={e => e.target.style.border = "0.5px solid rgba(127,119,221,0.6)"}
                onBlur={e => e.target.style.border = "0.5px solid rgba(255,255,255,0.12)"}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs rounded-xl px-3.5 py-2.5"
                style={{ background: "rgba(226,75,74,0.12)", border: "0.5px solid rgba(226,75,74,0.3)", color: "#F09595" }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm font-medium py-2.5 rounded-xl text-white transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{ background: "linear-gradient(135deg, #534AB7 0%, #3C3489 100%)", border: "0.5px solid rgba(127,119,221,0.4)" }}
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] mt-5" style={{ color: "rgba(255,255,255,0.4)" }}>
          Are you an intern?{" "}
          <Link
            to="/intern/login"
            className="font-medium transition-opacity hover:opacity-80"
            style={{ color: "#AFA9EC", borderBottom: "1px solid rgba(175,169,236,0.35)", paddingBottom: "1px" }}
          >
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
}