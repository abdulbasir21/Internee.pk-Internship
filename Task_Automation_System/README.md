<div align="center">

# 📋 Basecamp

### Intern Task Manager & Reminder System

A full-stack task management platform for admins and interns — assign tasks, track progress, and never miss a deadline with automatic reminders.

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## ✨ Overview

**Basecamp** is a two-role task manager built for small teams working with interns.

- 🧑‍💼 **Admins** create tasks, assign them to interns, track completion on a dashboard, and manage the full task list.
- 🎓 **Interns** sign up, see only their own tasks, and move them through **Pending → In Progress → Done**.
- ⏰ A background job automatically **emails and notifies interns** before a task is due — so nothing falls through the cracks.

No spreadsheets. No forgotten follow-ups. Just a clean, focused place to assign and track work.

---

## 🚀 Features

- 🔐 JWT authentication with bcrypt-hashed passwords
- 🛡️ Role-based access control (admin / intern) enforced on the backend
- ✅ Full task lifecycle — create, assign, update status, delete
- 📊 Admin dashboard with completion rate, overdue count, and per-intern stats
- 🔔 In-app notifications + automatic email reminders (24h before & on due date)
- 🎯 Ownership checks — interns can only act on their own tasks
- 🎨 Clean, responsive UI built with Tailwind CSS v4

---

## 🛠️ Tech Stack

| Layer         | Technology                                   |
|---------------|-----------------------------------------------|
| **Frontend**  | React 19, React Router v7, Axios, Tailwind CSS v4 |
| **Backend**   | Node.js, Express 4                            |
| **Database**  | MongoDB with Mongoose                         |
| **Auth**      | JWT + bcryptjs                                |
| **Scheduling**| node-cron                                     |
| **Email**     | Nodemailer                                    |

---

## 🗂️ Project Structure

```
basecamp/
├── client/                # React frontend
│   └── src/
│       ├── pages/          # Login, Signup, AdminDashboard, InternDashboard
│       ├── components/     # tasks, dashboard, notifications, layout, ui
│       ├── context/        # AuthContext — session state
│       └── services/       # api.js — all backend calls
│
└── server/                # Express backend
    ├── models/             # User, Task, Notification
    ├── routes/              # auth, tasks, dashboard, notifications, users
    ├── controllers/         # request handlers
    ├── middleware/          # JWT verification + role checks
    ├── services/            # reminder cron job + email service
    └── scripts/             # seedAdmin.js
```

---

## ⚙️ Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd basecamp

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**server/.env**
```env
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password
EMAIL_FROM=your_verified_sender@example.com

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_strong_password
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the admin account

```bash
cd server
npm run seed:admin
```

### 4. Run the app

```bash
# Backend
cd server && npm run dev

# Frontend (in a new terminal)
cd client && npm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:5000`.

---

## 🔑 Roles

| Role     | How they're created         | What they can do                                   |
|----------|-------------------------------|-----------------------------------------------------|
| **Admin**  | Seeded via `npm run seed:admin` | Create/assign/delete tasks, view all tasks, view dashboard stats |
| **Intern** | Self-signup                    | View own tasks, update own task status              |

---

## 📡 API Summary

| Method | Endpoint                  | Access              |
|--------|----------------------------|----------------------|
| POST   | `/api/auth/signup`         | Public               |
| POST   | `/api/auth/login`          | Public               |
| POST   | `/api/tasks`                | Admin                |
| GET    | `/api/tasks`                 | Admin / Intern       |
| GET    | `/api/tasks/:id`             | Admin, or assigned intern |
| PATCH  | `/api/tasks/:id/status`      | Intern (own task)    |
| DELETE | `/api/tasks/:id`             | Admin                |
| GET    | `/api/dashboard/stats`       | Admin                |
| GET    | `/api/notifications`         | Logged-in user       |
| PATCH  | `/api/notifications/:id/read`| Logged-in user       |
| GET    | `/api/users/interns`         | Admin                |

All protected routes require an `Authorization: Bearer <token>` header.

---

## 🧠 How Reminders Work

A `node-cron` job runs every 15 minutes and checks every unfinished task:

- **~24 hours before** the due date → sends an email + in-app notification
- **On the due date** → sends a second email + in-app notification

Each reminder type is tracked with its own flag, so an intern is never reminded twice for the same milestone.

---

## 📌 Roadmap

- [ ] Task editing (title, description, due date, reassignment)
- [ ] Pagination and server-side filtering
- [ ] Password reset flow
- [ ] Automated tests
- [ ] CI/CD + containerized deployment

---

<div align="center">

Built as part of an internship project at **Internee.pk** 🚀

</div>
