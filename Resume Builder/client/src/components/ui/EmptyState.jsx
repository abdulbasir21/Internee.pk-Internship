// Hand-drawn-feeling line illustration of a blank page + pen, themed
// to match the "paper" signature of the app rather than a stock icon.
function BlankPageIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="30" y="14" width="60" height="82" rx="4" fill="#FFFFFF" stroke="#E4E0D6" strokeWidth="2" />
      <line x1="40" y1="32" x2="80" y2="32" stroke="#DCEAE4" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="44" x2="72" y2="44" stroke="#EDEAE1" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="54" x2="76" y2="54" stroke="#EDEAE1" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="64" x2="66" y2="64" stroke="#EDEAE1" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="78" x2="70" y2="78" stroke="#F3E7C9" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="88" x2="60" y2="88" stroke="#EDEAE1" strokeWidth="3" strokeLinecap="round" />
      <g transform="rotate(28 86 88)">
        <rect x="83" y="46" width="7" height="46" rx="3.5" fill="#C79A3D" />
        <path d="M83 46 h7 l-3.5 -10 z" fill="#1E2A38" />
      </g>
    </svg>
  );
}

export default function EmptyState({ title, description }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
      <BlankPageIllustration />
      <h3 className="mt-6 font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-[26ch] text-[15px] leading-relaxed text-ink-soft">{description}</p>
    </div>
  );
}
