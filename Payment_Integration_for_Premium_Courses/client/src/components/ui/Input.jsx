// A labeled text input with a consistent look across Login/Signup.
// `error` renders inline below the field in the interface's own voice —
// specific about what's wrong, not a generic "invalid input".
export default function Input({ label, id, error, className = '', ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-light">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink
          placeholder:text-ink-faint outline-none transition-colors
          ${error ? 'border-danger' : 'border-line focus:border-ink'}
          ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
