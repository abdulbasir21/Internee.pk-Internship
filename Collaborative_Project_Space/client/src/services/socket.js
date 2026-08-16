import { io } from "socket.io-client";

// Kept separate from api.js on purpose: REST calls are one-shot
// request/response, sockets are a long-lived connection with its own
// lifecycle (connect, join/leave rooms, disconnect). Mixing the two
// into one file makes it hard to reason about which one "owns" a given
// piece of state.
let socket = null;

// Lazily create a single shared socket connection. Board pages call this
// on mount and get back the same instance if one already exists, so
// switching boards doesn't tear down and reconnect the whole client.
export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export function joinProject(projectId) {
  getSocket().emit("join-project", projectId);
}

export function leaveProject(projectId) {
  getSocket().emit("leave-project", projectId);
}
