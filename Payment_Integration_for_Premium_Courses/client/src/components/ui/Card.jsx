export default function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-card bg-paper-raised shadow-card border border-line/60 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
