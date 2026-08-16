import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700 disabled:bg-brand-300",
  secondary:
    "bg-white text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200",
  danger:
    "bg-white text-overdue border border-overdue/30 hover:bg-overdue-bg active:bg-red-100",
};

const SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium
        transition-all duration-150 ease-out active:scale-[0.97]
        disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        Icon && <Icon className="size-4" />
      )}
      {children}
    </button>
  );
}
