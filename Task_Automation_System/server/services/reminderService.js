const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');

// Sends both the email and the in-app notification for one task/reminder type,
// then flips the matching reminderSent flag so it's never sent again.
async function sendReminder(task, flagName, label) {
  // assignedTo is populated by the caller, so we already have the intern's email
  const intern = task.assignedTo;
  const message = `Reminder: "${task.title}" is ${label} (due ${task.dueDate.toDateString()}).`;

  try {
    await sendEmail(intern.email, 'Task Reminder', message);
  } catch (err) {
    // Log and continue — a failed email shouldn't stop the in-app notification
    // or block reminders for other tasks in this run
    console.error(`Failed to email ${intern.email}:`, err.message);
  }

  await Notification.create({ userId: intern._id, message });

  task.reminderSent[flagName] = true;
  await task.save();
}

// Core check, run on a schedule. Kept as its own exported function so it can
// also be triggered manually/tested without waiting for the cron tick.
async function checkAndSendReminders() {
  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Only tasks that aren't finished yet need reminders
  const tasks = await Task.find({ status: { $ne: 'done' } }).populate('assignedTo', 'name email');

  for (const task of tasks) {
    if (!task.assignedTo) continue; // guard against orphaned tasks

    const due = new Date(task.dueDate);
    const isDueToday = due.toDateString() === now.toDateString();
    const isWithinOneDay = due <= oneDayFromNow && due > now;

    if (isWithinOneDay && !task.reminderSent.oneDayBefore) {
      await sendReminder(task, 'oneDayBefore', 'due in about 24 hours');
    }

    if (isDueToday && !task.reminderSent.onDueDate) {
      await sendReminder(task, 'onDueDate', 'due today');
    }
  }
}

// Runs every 15 minutes for reasonably fine-grained reminders without
// hammering the DB or the SMTP server
function startReminderCron() {
  cron.schedule('*/15 * * * *', () => {
    checkAndSendReminders().catch((err) =>
      console.error('Reminder cron run failed:', err.message)
    );
  });
  console.log('Reminder cron job scheduled (every 15 minutes)');
}

module.exports = { startReminderCron, checkAndSendReminders };
