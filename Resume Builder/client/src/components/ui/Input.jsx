// Labelled text input with room for an inline error. Used for every
// single-line field in every form section, so label/error placement
// only has to be right once.
export default function Input({
  label,
  hint,
  error,
  required,
  id,
  className = "",
  ...props
}) {
  return (
    <label htmlFor={id} className="block">
      {label && (
        <span className="mb-1.5 flex items-baseline gap-1 text-[13px] font-semibold text-ink-light">
          {label}
          {required && <span className="text-clay">*</span>}
        </span>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border bg-paper-raised px-3.5 py-2.5 text-[15px] text-ink
          placeholder:text-ink-soft/50 transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss
          ${error ? "border-clay focus:border-clay focus:ring-clay/20" : "border-paper-line hover:border-ink/25"}
          ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${id}-error`} className="mt-1 flex items-center gap-1 text-[13px] text-clay">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="mt-1 block text-[13px] text-ink-soft">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
