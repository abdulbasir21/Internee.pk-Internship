// The one card surface used across the whole form side of the app —
// consistent radius, border, and shadow so nothing looks bolted on.
export default function Card({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag
      className={`bg-paper-raised border border-paper-line rounded-2xl shadow-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
