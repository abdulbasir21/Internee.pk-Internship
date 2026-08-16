import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Inbox } from "lucide-react";
import TaskCard from "./TaskCard";
import EmptyState from "../ui/EmptyState";

const STATUS_META = {
  todo: { label: "To Do", color: "var(--color-todo)", soft: "bg-todo-soft" },
  "in-progress": {
    label: "In Progress",
    color: "var(--color-progress)",
    soft: "bg-progress-soft",
  },
  done: { label: "Done", color: "var(--color-done)", soft: "bg-done-soft" },
};

export default function KanbanColumn({
  status,
  tasks,
  milestonesById,
  pulsingIds,
  onTaskClick,
}) {
  const meta = STATUS_META[status];

  return (
    <div className="flex flex-col bg-sunken rounded-2xl min-h-[60vh] md:min-h-0 w-[85vw] shrink-0 snap-center md:w-auto md:shrink">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: meta.color }}
        />
        <h3 className="text-sm font-bold text-ink tracking-tight">
          {meta.label}
        </h3>
        <span
          className={`ml-auto text-xs font-mono font-medium text-ink-soft ${meta.soft} rounded-full px-2 py-0.5`}
        >
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-3 pb-3 space-y-2.5 overflow-y-auto scroll-thin transition-colors duration-150 rounded-b-2xl ${
              snapshot.isDraggingOver ? "bg-brand-soft/40" : ""
            }`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <EmptyState
                icon={<Inbox size={16} />}
                title={`No tasks yet in ${meta.label}`}
              />
            )}
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <TaskCard
                    ref={dragProvided.innerRef}
                    task={task}
                    milestoneTitle={
                      task.milestoneId
                        ? milestonesById[task.milestoneId]?.title
                        : null
                    }
                    isDragging={dragSnapshot.isDragging}
                    isPulsing={pulsingIds?.has(task._id)}
                    onClick={() => onTaskClick(task)}
                    dragHandleProps={dragProvided.dragHandleProps}
                    style={dragProvided.draggableProps.style}
                    {...dragProvided.draggableProps}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
