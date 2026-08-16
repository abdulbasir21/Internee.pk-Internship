const VARIANTS = {
  primary:
    "bg-ink text-paper hover:bg-ink-light active:scale-[0.98] shadow-card disabled:bg-ink-soft/40",
  secondary:
    "bg-transparent text-ink border border-paper-line hover:border-ink/40 hover:bg-white active:scale-[0.98]",
  ghost:
    "bg-transparent text-ink-soft hover:text-ink hover:bg-black/[0.03] active:scale-[0.98]",
  danger:
    "bg-transparent text-clay hover:bg-clay-light active:scale-[0.98]",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-[15px] px-4 py-2.5 rounded-xl gap-2",
  lg: "text-base px-6 py-3.5 rounded-xl gap-2.5",
};

// One shared Button so every clickable action in the app feels like
// the same product — same easing, same disabled treatment, same
// pressed-down feedback.
export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center font-semibold
        transition-all duration-150 ease-out
        disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </Tag>
  );
}
