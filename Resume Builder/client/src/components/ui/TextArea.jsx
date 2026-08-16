export default function TextArea({ label, hint, error, id, rows = 3, className = "", ...props }) {
  return (
    <label htmlFor={id} className="block">
      {label && (
        <span className="mb-1.5 block text-[13px] font-semibold text-ink-light">{label}</span>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full resize-y rounded-lg border bg-paper-raised px-3.5 py-2.5 text-[15px] leading-relaxed text-ink
          placeholder:text-ink-soft/50 transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss
          ${error ? "border-clay focus:border-clay focus:ring-clay/20" : "border-paper-line hover:border-ink/25"}
          ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {hint && <span className="mt-1 block text-[13px] text-ink-soft">{hint}</span>}
    </label>
  );
}
