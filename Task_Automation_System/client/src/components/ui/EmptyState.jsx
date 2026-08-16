export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center animate-fade-in-up">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        {Icon && <Icon className="size-6" strokeWidth={1.75} />}
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-display font-semibold text-ink-900">{title}</p>
        {description && <p className="text-sm text-ink-500 max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  );
}
