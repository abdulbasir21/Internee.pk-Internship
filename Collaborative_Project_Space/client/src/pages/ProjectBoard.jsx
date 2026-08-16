import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import { ArrowLeft, Plus } from "lucide-react";
import { projectsApi, tasksApi, milestonesApi } from "../services/api";
import { getSocket, joinProject, leaveProject } from "../services/socket";
import Navbar from "../components/layout/Navbar";
import KanbanColumn from "../components/board/KanbanColumn";
import MilestoneSidebar from "../components/board/MilestoneSidebar";
import TaskFormModal from "../components/board/TaskFormModal";
import Button from "../components/ui/Button";
import { BoardSkeleton } from "../components/ui/Loader";

const COLUMNS = ["todo", "in-progress", "done"];

// Briefly mark an id as "pulsing" so its card can flash the live-update
// ring, then clear it — the ring is a one-shot cue, not a persistent state.
function usePulseSet() {
  const [ids, setIds] = useState(() => new Set());
  const add = useCallback((id) => {
    setIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1200);
  }, []);
  return [ids, add];
}

export default function ProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [pulsingTasks, pulseTask] = usePulseSet();
  const [pulsingMilestones, pulseMilestone] = usePulseSet();

  // Keep a ref to the current projectId reachable inside socket handlers
  // registered once per mount, without re-subscribing every render.
  const projectIdRef = useRef(projectId);
  projectIdRef.current = projectId;

  // ---- initial data fetch ----
  useEffect(() => {
    let cancelled = false;
    setLoadingBoard(true);
    setLoadingMilestones(true);
    setError("");

    Promise.all([projectsApi.get(projectId), tasksApi.list(projectId)])
      .then(([projectRes, tasksRes]) => {
        if (cancelled) return;
        setProject(projectRes.data.project ?? projectRes.data.data);
        setTasks(tasksRes.data.tasks ?? tasksRes.data.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this board. Try refreshing.");
      })
      .finally(() => {
        if (!cancelled) setLoadingBoard(false);
      });

    milestonesApi
      .list(projectId)
      .then(({ data }) => {
        if (!cancelled) setMilestones(data.milestones ?? data.data ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoadingMilestones(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // ---- socket connection + live updates ----
  useEffect(() => {
    const socket = getSocket();
    joinProject(projectId);
    setConnected(socket.connected);

    // These are the ONLY place task/milestone state changes after the
    // initial load. Drag/create/edit/delete all just call the REST API
    // and wait for the matching event here — one source of truth, so
    // this tab and every other tab watching the same board end up with
    // identical state instead of racing an optimistic update against it.
    const onTaskCreated = (task) => {
      setTasks((prev) => (prev.some((t) => t._id === task._id) ? prev : [...prev, task]));
      pulseTask(task._id);
    };
    const onTaskUpdated = (task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      pulseTask(task._id);
    };
    const onTaskDeleted = ({ id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    };
    const onMilestoneUpdated = (payload) => {
      setMilestones((prev) =>
        prev.map((m) => (m._id === payload.milestoneId ? { ...m, ...payload } : m))
      );
      pulseMilestone(payload.milestoneId);
    };
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("task:created", onTaskCreated);
    socket.on("task:updated", onTaskUpdated);
    socket.on("task:deleted", onTaskDeleted);
    socket.on("milestone:updated", onMilestoneUpdated);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Cleanup removes exactly the listeners this effect added and leaves
    // the room. Without this, navigating between boards (or React's
    // StrictMode double-invoke in dev) stacks up duplicate listeners and
    // every event fires the state update multiple times.
    return () => {
      socket.off("task:created", onTaskCreated);
      socket.off("task:updated", onTaskUpdated);
      socket.off("task:deleted", onTaskDeleted);
      socket.off("milestone:updated", onMilestoneUpdated);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      leaveProject(projectIdRef.current);
    };
  }, [projectId, pulseTask, pulseMilestone]);

  const tasksByStatus = useMemo(() => {
    const grouped = { todo: [], "in-progress": [], done: [] };
    for (const t of tasks) (grouped[t.status] ?? grouped.todo).push(t);
    return grouped;
  }, [tasks]);

  const milestonesById = useMemo(() => {
    const map = {};
    for (const m of milestones) map[m._id] = m;
    return map;
  }, [milestones]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // No local reordering here on purpose (see the socket effect above) —
    // just tell the server, and 'task:updated' will move the card for us.
    tasksApi
      .update(draggableId, { status: destination.droppableId })
      .catch(() => setError("Couldn't move that task. It's back where it started."));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };
  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmitTask = async (data) => {
    if (editingTask) {
      await tasksApi.update(editingTask._id, data);
    } else {
      await tasksApi.create(projectId, data);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await tasksApi.remove(taskId);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <button
          onClick={() => navigate("/projects")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-faint hover:text-ink mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          All projects
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">
                {loadingBoard ? "Loading…" : project?.name}
              </h1>
              <span
                className="flex items-center gap-1.5 text-xs font-medium text-ink-faint"
                title={connected ? "Live updates connected" : "Reconnecting…"}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connected ? "bg-done" : "bg-ink-faint"
                  }`}
                />
                {connected ? "Live" : "Connecting"}
              </span>
            </div>
            {project?.description && (
              <p className="text-sm text-ink-soft mt-1 max-w-xl">
                {project.description}
              </p>
            )}
          </div>
          <Button onClick={openCreateModal}>
            <Plus size={16} />
            Add task
          </Button>
        </div>

        {error && <p className="text-sm text-danger mb-4">{error}</p>}

        {loadingBoard ? (
          <BoardSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory lg:overflow-visible pb-2 -mx-1 px-1">
                {COLUMNS.map((status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    tasks={tasksByStatus[status]}
                    milestonesById={milestonesById}
                    pulsingIds={pulsingTasks}
                    onTaskClick={openEditModal}
                  />
                ))}
              </div>
            </DragDropContext>

            <MilestoneSidebar
              milestones={milestones}
              loading={loadingMilestones}
              pulsingIds={pulsingMilestones}
            />
          </div>
        )}
      </main>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitTask}
        onDelete={handleDeleteTask}
        task={editingTask}
        members={project?.members ?? []}
        milestones={milestones}
      />
    </div>
  );
}
