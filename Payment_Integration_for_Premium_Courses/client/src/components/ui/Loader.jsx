// A full-area spinner used while something blocking is happening
// (checkout redirect, initial auth check) — not for list loading,
// which uses skeletons instead so the layout doesn't jump.
export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-light">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-line border-t-gold" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
