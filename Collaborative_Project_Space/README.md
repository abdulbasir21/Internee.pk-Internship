<div align="center">

# 🗂️ Fieldwork

### Real-Time Project Collaboration & Kanban Tool

Built for teams of admins and interns — live task boards, auto-tracked milestones, zero-refresh sync.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## ✨ What is Fieldwork?

Fieldwork is a shared, real-time Kanban board built for a small team structure — one **admin** who creates projects, assigns interns, and sets milestones, and **interns** who work the board together.

Every task update — a drag, a create, an edit — is saved through a REST API and then **broadcast live over Socket.IO** to every open tab watching that board. Milestone progress isn't typed in by hand either; it's calculated automatically from real task completion, every time it changes.

> No manual refresh. No stale progress bars. Everyone sees the same board, in real time.

---

## 🚀 Features

- 🔐 **JWT authentication** with two roles — `admin` and `intern`
- 📋 **Live Kanban board** — To Do / In Progress / Done, with drag-and-drop
- ⚡ **Real-time sync** via Socket.IO — task and milestone changes appear instantly, everywhere
- 🎯 **Auto-computed milestone progress** — always derived from actual task status, never stale
- 🛡️ **Role & project-level authorization** — interns only see projects they're a member of
- 🧑‍💼 **Admin dashboard** — project creation, member management, milestone creation, overview stats
- 🎨 **Consistent design system** — Tailwind v4 tokens, a signature "live pulse" animation for real-time updates

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7, Axios, Tailwind CSS v4, @hello-pangea/dnd |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Real-time | Socket.IO |
| Auth | JWT + bcrypt |

---

## 🏗️ How It Works

```
 Browser (React)  ──REST──▶  Express Controller  ──▶  MongoDB
       ▲                            │
       │                            ▼
       └──────── Socket.IO broadcast (project room) ───────┘
```

Every write goes through REST and gets persisted first. Only *after* a successful save does the server broadcast the result to everyone in that project's Socket.IO room — including the tab that made the change. This keeps every viewer's board perfectly consistent with what's actually in the database.

---

## 📁 Project Structure

```
client/
  src/
    pages/           Login, Signup, MyProjects, ProjectBoard, AdminDashboard, ProjectManage
    components/
      board/          Kanban columns, task cards, task modal, milestone sidebar
      admin/          Project table, project form, member selector, milestone form
      ui/             Shared primitives (Button, Card, Input, Loader, EmptyState)
      layout/         Navbar, ProtectedRoute
    context/          AuthContext
    services/         api.js (REST), socket.js (Socket.IO)

server/
  index.js            Express + Socket.IO server setup
  config/             MongoDB connection
  models/             User, Project, Task, Milestone
  routes/             auth, projects, tasks, milestones
  controllers/        Route handler logic
  middleware/         protect, isAdmin, isProjectMember
  sockets/             All Socket.IO logic (rooms + broadcasts)
  utils/               Milestone progress calculator, validators
```

---

## 🔌 API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Intern signup |
| `POST` | `/api/auth/login` | Public | Login (admin or intern) |
| `GET` | `/api/projects` | Auth | List your projects |
| `POST` | `/api/projects` | Admin | Create a project |
| `GET` | `/api/projects/:id` | Member | Get project details |
| `PATCH` | `/api/projects/:id/members` | Admin | Add/remove members |
| `GET` | `/api/projects/:id/tasks` | Member | List tasks |
| `POST` | `/api/projects/:id/tasks` | Member | Create a task |
| `PATCH` | `/api/tasks/:id` | Member | Update / move a task |
| `DELETE` | `/api/tasks/:id` | Member | Delete a task |
| `GET` | `/api/projects/:id/milestones` | Member | List milestones with live progress |
| `POST` | `/api/projects/:id/milestones` | Admin | Create a milestone |

**Socket.IO events:** `join-project`, `leave-project` (emit) · `task:created`, `task:updated`, `task:deleted`, `milestone:updated` (listen)

---

## ⚙️ Getting Started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, CLIENT_URL, admin credentials
npm run seed:admin        # creates the one admin account
npm run seed:demo         # optional: sample project + tasks
npm run dev                # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL, VITE_SOCKET_URL
npm run dev                # starts on http://localhost:5173
```

Log in with the seeded admin account, or `demo.intern@example.com` / `demoPassword123` if you ran the demo seed.

---

## 🔒 Security

- Passwords hashed with **bcrypt**
- Stateless **JWT** verified on every request
- **Role-based** + **project-membership** authorization on every protected route
- No public admin-creation endpoint — admin accounts are seeded locally only

---

## 🧭 Known Limitations

- Admin member-picker depends on a `GET /api/users?role=intern` route not yet implemented on the backend
- No automated tests or CI yet
- No file/image upload
- No deployment config (Docker, CI/CD) yet

---

## 🛣️ Roadmap

- [ ] Add the missing "list interns" backend route
- [ ] Project editing (name/description)
- [ ] Live socket event on milestone creation
- [ ] Password reset & email verification
- [ ] Automated test suite + CI
- [ ] Docker + deployment config

---

<div align="center">

Built as part of the internship program at **Internee.pk** 🚀

</div>
