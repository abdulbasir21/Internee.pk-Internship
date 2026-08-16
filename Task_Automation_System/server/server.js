require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startReminderCron } = require('./services/reminderService');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ success: true, message: 'Intern Task Manager API is running' }));

// Catch-all 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Last-resort error handler — keeps the error response format consistent
// even for errors thrown outside a controller's own try/catch
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  startReminderCron(); // begin the hourly/15-min reminder checks
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
