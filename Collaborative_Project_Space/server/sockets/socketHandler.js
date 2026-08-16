const { Server } = require('socket.io');

// io is kept module-scoped so any controller can pull it via getIO()
// and broadcast after a successful DB write, without passing the socket
// server through every function call.
let io = null;

// Called once from index.js, right after the HTTP server is created.
// Sets up the connection lifecycle and the room-join handshake.
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    // Rooms pattern: a "room" is just a label Socket.IO uses to group
    // sockets. We name each room after its projectId, so broadcasting
    // "to everyone watching project X" is just io.to(`project:${X}`).
    // The client emits this once, right when it opens a project's board.
    socket.on('join-project', (projectId) => {
      if (!projectId) return;
      socket.join(`project:${projectId}`);
    });

    // Optional mirror of join-project, useful if the client navigates
    // away from a board and wants to stop receiving its updates.
    socket.on('leave-project', (projectId) => {
      if (!projectId) return;
      socket.leave(`project:${projectId}`);
    });

    socket.on('disconnect', () => {
      // Socket.IO automatically removes the socket from all rooms on
      // disconnect — nothing to clean up manually here.
    });
  });

  return io;
};

// Controllers call this to broadcast — they never touch `io` or room
// names directly, keeping all Socket.IO specifics in this one file.
// This is also WHY these emits live here instead of inline in each
// controller: if the room-naming convention ever changes, there's a
// single place to update it.
const emitToProject = (projectId, event, payload) => {
  if (!io) return; // guards against calling before initSocket ran (e.g. in tests)
  io.to(`project:${projectId}`).emit(event, payload);
};

module.exports = { initSocket, emitToProject };
