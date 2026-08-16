// Small circular loader built from a single conic-gradient div — no
// icon library needed, and it inherits currentColor so it matches
// whatever button or surface it sits on.
export default function Loader({ size = 18, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
