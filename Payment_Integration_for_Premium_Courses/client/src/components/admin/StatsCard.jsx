import Card from '../ui/Card'

// Reuses the same accent colors as PremiumBadge (gold = premium, forest =
// free) so the dashboard's stat row reads as one system with the catalog.
const ACCENTS = {
  ink: 'bg-ink/5 text-ink',
  gold: 'bg-gold-light/40 text-gold-dark',
  forest: 'bg-forest-light text-forest',
}

export default function StatsCard({ icon: Icon, label, value, accent = 'ink' }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ACCENTS[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
        <p className="mt-0.5 truncate font-display text-2xl font-medium text-ink">{value}</p>
      </div>
    </Card>
  )
}
