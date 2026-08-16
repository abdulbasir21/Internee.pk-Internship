import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Loader";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Role comes back from the API response, not chosen up front —
      // one shared form routes admins and interns differently after.
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/projects");
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't sign you in. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-canvas">
      <div className="w-full max-w-sm fade-in-up">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center mb-4">
            <LayoutGrid size={20} strokeWidth={2.5} />
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-ink-soft mt-1.5">
            Sign in to see what your team's moving on.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <Field label="Email">
            <Input
              type="email"
              required
              autoFocus
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="w-4 h-4" /> : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-6">
          New here?{" "}
          <Link to="/signup" className="text-brand font-semibold hover:underline">
            Create an intern account
          </Link>
        </p>
      </div>
    </div>
  );
}
