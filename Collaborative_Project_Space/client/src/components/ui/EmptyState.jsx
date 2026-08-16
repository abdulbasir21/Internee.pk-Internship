export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      {icon && (
        <div className="w-11 h-11 rounded-full bg-sunken flex items-center justify-center text-ink-faint mb-3">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-ink-soft">{title}</p>
      {description && (
        <p className="text-sm text-ink-faint mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
