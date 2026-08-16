export default function Card({ children, className = "", hover = false, as: As = "div", ...props }) {
  return (
    <As
      className={`bg-surface rounded-[var(--radius-card)] border border-ink-100
        shadow-[var(--shadow-card)] ${hover ? "transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}
