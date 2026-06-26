// src/pages/InternSignup.jsx
//
// Lets a new intern create their own account (name, email, password).
// No admin needed - after signup, they are logged straight in.
// Visually this matches InternLogin (teal accent) so the whole signup → login
// → dashboard journey feels like one continuous product.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, AlertCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";

export default function InternSignup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/intern/signup", form);
      login(res.data.user, res.data.token);
      navigate("/intern/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      icon={<UserPlus className="text-white" size={20} />}
      gradient="linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)"
      title="Create your account"
      subtitle="Start tracking your tasks in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/intern/login"
            className="font-medium transition-opacity hover:opacity-80"
            style={{ color: "#5DCAA5", borderBottom: "1px solid rgba(93,202,165,0.35)", paddingBottom: "1px" }}
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Full name
          </label>
          <input
            type="text"
            className="input-dark"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jordan Lee"
            required
            onFocus={(e) => (e.target.style.border = "0.5px solid rgba(93,202,165,0.6)")}
            onBlur={(e) => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Email
          </label>
          <input
            type="email"
            className="input-dark"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com"
            required
            onFocus={(e) => (e.target.style.border = "0.5px solid rgba(93,202,165,0.6)")}
            onBlur={(e) => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Password
          </label>
          <input
            type="password"
            className="input-dark"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
            onFocus={(e) => (e.target.style.border = "0.5px solid rgba(93,202,165,0.6)")}
            onBlur={(e) => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Department <span style={{ color: "rgba(255,255,255,0.3)" }}>(optional)</span>
          </label>
          <input
            type="text"
            className="input-dark"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="Engineering"
            onFocus={(e) => (e.target.style.border = "0.5px solid rgba(93,202,165,0.6)")}
            onBlur={(e) => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
          />
        </div>

        {error && (
          <div
            className="flex items-center gap-2 text-xs rounded-xl px-3.5 py-2.5"
            style={{ background: "rgba(226,75,74,0.12)", border: "0.5px solid rgba(226,75,74,0.3)", color: "#F09595" }}
          >
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full text-sm font-medium py-2.5 rounded-xl text-white transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)", border: "0.5px solid rgba(93,202,165,0.4)" }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
