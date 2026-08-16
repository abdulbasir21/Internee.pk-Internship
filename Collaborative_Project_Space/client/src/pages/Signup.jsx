import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Loader";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // The API always forces role to 'intern' on signup regardless of
      // what's sent, so there's no role field on this form at all.
      await signup(form.name, form.email, form.password);
      navigate("/projects");
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't create your account. Try again."
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
            Join your team
          </h1>
          <p className="text-sm text-ink-soft mt-1.5">
            Create an intern account to get onto your projects.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <Field label="Full name">
            <Input
              required
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jordan Lee"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="w-4 h-4" /> : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
