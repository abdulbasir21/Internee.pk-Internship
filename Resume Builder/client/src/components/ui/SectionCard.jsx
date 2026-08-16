import Card from "./Card";

// Every form section (Personal, Skills, Experience, Education) is a
// numbered step in a real sequence the user works through top to
// bottom, so the number is information here, not decoration.
export default function SectionCard({ step, title, description, action, children }) {
  return (
    <Card className="p-6 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex gap-3.5">
          <span className="font-mono mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[12px] font-medium text-paper">
            {step}
          </span>
          <div>
            <h2 className="font-display text-[19px] font-semibold leading-tight text-ink">{title}</h2>
            {description && <p className="mt-1 text-[14px] text-ink-soft">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
