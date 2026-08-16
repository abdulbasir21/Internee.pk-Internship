export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-surface border border-border rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
