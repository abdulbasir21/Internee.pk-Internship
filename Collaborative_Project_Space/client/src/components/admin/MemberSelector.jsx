import { Check } from "lucide-react";

// Checkbox-style multi-select over a list of interns. Used both in
// ProjectForm (picking initial members on create) and ProjectManage
// (adding members to an existing project) — same visual, different
// caller owns what "selected" means.
export default function MemberSelector({ interns, selectedIds, onToggle, emptyLabel }) {
  if (interns.length === 0) {
    return (
      <p className="text-sm text-ink-faint py-3 text-center bg-sunken rounded-xl">
        {emptyLabel || "No interns available."}
      </p>
    );
  }

  return (
    <ul className="max-h-48 overflow-y-auto scroll-thin border border-border rounded-xl divide-y divide-border-soft">
      {interns.map((intern) => {
        const checked = selectedIds.includes(intern._id);
        return (
          <li key={intern._id}>
            <button
              type="button"
              onClick={() => onToggle(intern._id)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-sunken transition-colors duration-150"
            >
              <span
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-150 ${
                  checked
                    ? "bg-brand border-brand text-white"
                    : "border-border bg-surface text-transparent"
                }`}
              >
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink truncate">
                  {intern.name}
                </span>
                <span className="block text-xs text-ink-faint truncate">
                  {intern.email}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
