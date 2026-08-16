require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socketHandler');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');

const app = express();

// Standard middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// taskRoutes and milestoneRoutes define their own full paths
// (/projects/:id/tasks, /tasks/:id, /projects/:id/milestones) so they're
// mounted directly under /api rather than a narrower prefix.
app.use('/api', taskRoutes);
app.use('/api', milestoneRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Real-time Kanban API is running' });
});

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Generic error handler — catches anything thrown/passed to next(err)
// that individual controllers didn't already handle themselves.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Unexpected server error' });
});

// Socket.IO needs the raw HTTP server (not the Express app) so it can
// hijack the upgrade handshake for websocket connections alongside
// Express's normal HTTP request handling.
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
