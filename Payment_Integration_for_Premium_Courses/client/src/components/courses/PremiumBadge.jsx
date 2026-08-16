// Free and Premium are the one distinction a student needs to spot in
// half a second while scanning a grid, so the two badges use opposite
// visual weight on purpose: gold + filled for Premium, quiet + outlined
// for Free.
export default function PremiumBadge({ isFree, price }) {
  if (isFree) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-forest/30 bg-forest-light px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-forest">
        Free
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-white shadow-sm">
      Premium · ${price}
    </span>
  )
}
