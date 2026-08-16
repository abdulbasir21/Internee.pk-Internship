export function Field({ label, error, hint, children, htmlFor }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-xs font-medium text-overdue animate-fade-in-up">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-500">{hint}</span>
      ) : null}
    </div>
  );
}

const baseControl = `w-full h-10 px-3 rounded-[var(--radius-control)] bg-white border text-sm
  text-ink-900 placeholder:text-ink-300 transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-brand-100`;

export function Input({ error, className = "", ...props }) {
  return (
    <input
      className={`${baseControl} ${error ? "border-overdue focus:border-overdue" : "border-ink-200 focus:border-brand-400"} ${className}`}
      {...props}
    />
  );
}

export function Select({ error, className = "", children, ...props }) {
  return (
    <select
      className={`${baseControl} ${error ? "border-overdue focus:border-overdue" : "border-ink-200 focus:border-brand-400"} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ error, className = "", ...props }) {
  return (
    <textarea
      className={`${baseControl} h-auto min-h-24 py-2 resize-y ${error ? "border-overdue focus:border-overdue" : "border-ink-200 focus:border-brand-400"} ${className}`}
      {...props}
    />
  );
}
