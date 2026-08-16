import { forwardRef } from "react";
import { Flag, GripVertical } from "lucide-react";

const STATUS_COLOR = {
  todo: "var(--color-todo)",
  "in-progress": "var(--color-progress)",
  done: "var(--color-done)",
};

// forwardRef + spread props so @hello-pangea/dnd's Draggable can attach
// its ref/drag handle/style directly to the card's root element.
const TaskCard = forwardRef(function TaskCard(
  { task, milestoneTitle, isDragging, isPulsing, onClick, dragHandleProps, style, ...rest },
  ref
) {
  const statusColor = STATUS_COLOR[task.status] ?? STATUS_COLOR.todo;

  return (
    <div
      ref={ref}
      style={{ ...style, "--pulse-color": statusColor }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={`group relative bg-surface border border-border rounded-xl p-3.5 pl-4 cursor-pointer select-none
        transition-all duration-150 ease-out
        hover:border-ink-faint hover:shadow-md hover:-translate-y-0.5
        ${isDragging ? "shadow-lg rotate-1 scale-[1.02]" : "shadow-sm"}
        ${isPulsing ? "live-pulse" : ""}
      `}
      {...rest}
    >
      {/* status pin — the corkboard-pin motif that repeats from the column header */}
      <span
        className="absolute left-0 top-3.5 bottom-3.5 w-1 rounded-full"
        style={{ background: statusColor }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-ink leading-snug">
          {task.title}
        </p>
        <span
          {...dragHandleProps}
          className="shrink-0 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing -mr-1 -mt-0.5"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to move"
        >
          <GripVertical size={15} />
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-ink-soft mt-1.5 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        {milestoneTitle ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-faint bg-sunken rounded-full px-2 py-0.5 max-w-[60%] truncate">
            <Flag size={10} />
            {milestoneTitle}
          </span>
        ) : (
          <span />
        )}

        {task.assignedTo ? (
          <span
            title={task.assignedTo.name}
            className="w-6 h-6 rounded-full bg-brand-soft text-brand-dark text-[11px] font-bold flex items-center justify-center shrink-0"
          >
            {task.assignedTo.name?.[0]?.toUpperCase()}
          </span>
        ) : (
          <span className="w-6 h-6 rounded-full border border-dashed border-border" />
        )}
      </div>
    </div>
  );
});

export default TaskCard;
