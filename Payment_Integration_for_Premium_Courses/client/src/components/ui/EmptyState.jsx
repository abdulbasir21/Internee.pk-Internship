// A blank state is an invitation to act, not a dead end — it always
// pairs a plain explanation with a way forward.
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      {icon && <div className="text-ink-faint">{icon}</div>}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-light">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
