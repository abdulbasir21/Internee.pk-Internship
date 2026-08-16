export function Field({ label, children, hint, error }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-semibold text-ink mb-1.5">
          {label}
        </span>
      )}
      {children}
      {hint && !error && (
        <span className="block text-xs text-ink-faint mt-1.5">{hint}</span>
      )}
      {error && (
        <span className="block text-xs text-danger mt-1.5">{error}</span>
      )}
    </label>
  );
}

const baseClasses =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

export function Input({ className = "", ...props }) {
  return <input className={`${baseClasses} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`${baseClasses} resize-none ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${baseClasses} ${className}`} {...props}>
      {children}
    </select>
  );
}
