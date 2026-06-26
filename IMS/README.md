# Intern Progress Tracker (MERN)

A full-stack system to manage and track intern progress.
Built with MongoDB, Express, React, Node.js, Tailwind CSS, and lucide-react icons.

---

## What This Project Does

- **Admin** can log in, assign tasks to interns, see everyone's progress, and remove interns or tasks.
- **Intern** can create their own account (self-signup), log in on their own separate login page, **view all their tasks**, **submit their work** (a note or link) when finished, and watch their **progress update in real time** via a progress ring.
- All data (interns, tasks, submissions) is stored in MongoDB.
- The UI is built with Tailwind CSS and lucide-react icons - no plain inline styles, no TypeScript.

---

## Project Structure

```
intern-tracker/
├── backend/              -> Node + Express + MongoDB API
│   ├── models/           -> Database schemas (Admin, Intern, Task)
│   ├── routes/           -> API endpoints (CRUD logic)
│   ├── middleware/       -> Login/role protection (JWT)
│   ├── server.js         -> Main server file
│   └── .env.example      -> Copy this to .env and fill in your own values
│
└── frontend/             -> React app (Vite + Tailwind CSS)
    └── src/
        ├── pages/        -> Login pages, signup, and both dashboards
        ├── components/   -> Reusable pieces (DashboardShell, ProgressRing, StatusBadge, AuthCard, ProtectedRoute)
        ├── context/      -> Keeps track of who is logged in
        ├── api/          -> Connects to the backend
        └── index.css     -> Tailwind imports + small shared utility classes
```

---

## How to Run This Project (Step by Step)

### 1. Install MongoDB

You need MongoDB running somewhere. Easiest options:
- Install MongoDB Community Edition on your laptop, OR
- Create a free MongoDB Atlas cluster online (cloud-hosted, no install needed) and copy its connection string.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Then:
1. Copy `.env.example` and rename the copy to `.env`
2. Open `.env` and fill in:
   - `MONGO_URI` — your MongoDB connection string
   - `JWT_SECRET` — any long random text (used to sign login tokens)

Start the backend:
```bash
npm run dev
```

You should see:
```
Connected to MongoDB successfully.
Server is running on http://localhost:5000
```

### 3. Create Your First Admin Account

The app has no signup page on purpose (only one admin team usually exists).
Create your first admin using any API tool (Postman, Thunder Client, or even your browser's fetch console):

```
POST http://localhost:5000/api/admin/register
Body (JSON):
{
  "name": "Your Name",
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

After this works once, you can delete or stop using this route — you won't need it again unless you want a second admin.

### 4. Set Up the Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the link it shows (usually `http://localhost:3000`).

### 5. Try It Out

1. Go to the homepage, click **Intern login**, then click **Create an account** to sign up as a new intern (name, email, password).
2. You'll land on your dashboard — it'll be empty since no tasks are assigned yet.
3. Open a private/incognito window (or log out), go to **Admin login**, and log in with the admin account you created in Step 3.
4. From the Admin Dashboard, click **Assign task**, pick your new intern from the dropdown, give it a title and deadline.
5. Switch back to the intern's window/login and click **Refresh** — the new task appears, and the progress ring shows 0%.
6. As the intern, click **Submit work** on the task, type a short note (or paste a link), and submit. The task is marked done automatically and the progress ring updates immediately.
7. Log back in as Admin — you'll see the task marked "Done" in the "All tasks" table, along with the intern's submission text.

---

## How the Login/Security System Works (Plain English)

1. When someone logs in correctly, the backend creates a **JWT token** — think of it as a temporary digital ID card that proves "this person is logged in, and they are an admin/intern."
2. The frontend saves this token in the browser and attaches it to every future request automatically (see `src/api/axios.js`).
3. The backend checks this token on every protected route (see `backend/middleware/auth.js`) before allowing any action.
4. Passwords are never stored as plain text — they're scrambled using `bcryptjs` before being saved to the database.

---

## Notes on Deployment (For Later)

When you're ready to put this online:
- Deploy the backend somewhere like Render, Railway, or similar (anywhere that runs Node.js).
- Deploy the frontend somewhere like Vercel or Netlify.
- Update the `baseURL` in `frontend/src/api/axios.js` to point to your live backend URL instead of `localhost:5000`.
- Use MongoDB Atlas (cloud database) instead of a local MongoDB so your live backend can reach it.

---

## Possible Future Improvements

- Allow interns to upload files as part of task submission.
- Add a "forgot password" flow.
- Add email notifications when a new task is assigned or a deadline is near.
- Add charts/graphs to visualize intern progress over time.
