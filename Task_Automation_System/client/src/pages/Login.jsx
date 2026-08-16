import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, CheckSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Field, Input } from "../components/ui/Input";
import Button from "../components/ui/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, authLoading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.email) next.email = "Enter your email.";
    else if (!EMAIL_RE.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await login(values);
      const redirectTo = location.state?.from || (user.role === "admin" ? "/admin" : "/dashboard");
      navigate(redirectTo, { replace: true });
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
            <h1 className="font-display text-xl font-semibold text-ink-900">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-500">Sign in to Basecamp to see your tasks.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)] p-6"
        >
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

          <Field label="Password" error={errors.password} htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
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

          <Button type="submit" icon={LogIn} loading={authLoading} className="mt-1 w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          New intern?{" "}
          <Link to="/signup" className="font-medium text-brand-500 hover:text-brand-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
