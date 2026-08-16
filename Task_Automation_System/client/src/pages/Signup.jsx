import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, CheckSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Field, Input } from "../components/ui/Input";
import Button from "../components/ui/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup, authLoading, authError } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Enter your full name.";
    if (!values.email) next.email = "Enter your email.";
    else if (!EMAIL_RE.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Choose a password.";
    else if (values.password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await signup(values);
      navigate("/dashboard", { replace: true });
    } catch {
      // authError from context already renders below
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-[var(--shadow-card)]">
            <CheckSquare className="size-5" strokeWidth={2.25} />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-900">Create your account</h1>
            <p className="mt-1 text-sm text-ink-500">For interns — admins are added by the team.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)] p-6"
        >
          <Field label="Full name" error={errors.name} htmlFor="name">
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jordan Lee"
              value={values.name}
              onChange={update("name")}
              error={!!errors.name}
            />
          </Field>

          <Field label="Email" error={errors.email} htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={update("email")}
              error={!!errors.email}
            />
          </Field>

          <Field label="Password" error={errors.password} hint={!errors.password ? "At least 8 characters." : undefined} htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={values.password}
              onChange={update("password")}
              error={!!errors.password}
            />
          </Field>

          {authError && (
            <p className="rounded-[var(--radius-control)] bg-overdue-bg px-3 py-2 text-sm text-overdue animate-fade-in-up">
              {authError}
            </p>
          )}

          <Button type="submit" icon={UserPlus} loading={authLoading} className="mt-1 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-500 hover:text-brand-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
