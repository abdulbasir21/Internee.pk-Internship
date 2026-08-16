// Single button component for the whole app so every action — primary,
// secondary, destructive — shares the same size scale, radius, and
// press feedback instead of drifting per-page.
const VARIANTS = {
  primary:
    "bg-brand text-white hover:bg-brand-dark shadow-sm shadow-brand/20",
  secondary:
    "bg-surface text-ink border border-border hover:bg-sunken",
  ghost: "bg-transparent text-ink-soft hover:bg-sunken hover:text-ink",
  danger: "bg-danger text-white hover:bg-red-600",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "text-base px-5 py-3 rounded-xl gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
