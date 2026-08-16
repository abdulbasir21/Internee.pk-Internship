// One Button, three visual intents. Every clickable action in the app
// should use this instead of a bare <button> so hover/press/disabled
// states stay consistent everywhere.
const VARIANTS = {
  primary: 'bg-ink text-paper-raised hover:bg-ink/90 active:bg-ink/95',
  gold: 'bg-gold text-white hover:bg-gold-dark active:bg-gold-dark',
  ghost: 'bg-transparent text-ink border border-line hover:border-ink hover:bg-white',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const sizes = {
    sm: 'text-sm px-3.5 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  }

  return (
    <Component
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium
        transition-all duration-150 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Component>
  )
}
