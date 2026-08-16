# Showcase — Intern Project Showcase Platform

A full-stack platform where interns can build a professionally designed,
shareable page presenting their internship projects to potential employers.

- **Frontend:** React (Vite) + Tailwind CSS — a dynamic portfolio editor
- **Backend:** Node.js + Express — REST API for portfolios & projects
- **Database:** MongoDB (Mongoose) — stores profiles, projects, images, tags
- **Extras:** image uploads (Multer), unique shareable links, no-login
  "edit key" ownership model

---

## Project structure

```
intern-showcase/
├── backend/          Express API + MongoDB models
│   ├── config/        DB connection
│   ├── controllers/    Route handlers
│   ├── middleware/    Auth (edit-key) + image upload
│   ├── models/         Portfolio, Project (Mongoose schemas)
│   ├── routes/          Express routers
│   ├── utils/            Slug + edit-key generators
│   └── server.js         Entry point
└── frontend/          React + Vite + Tailwind app
    └── src/
        ├── api/            Axios client
        ├── components/    Navbar, ProjectCard, ProjectFormModal, SpecTag
        └── pages/           Landing, Create, Editor, Public, NotFound
```

## How it works

1. **Create** — visitor enters name / role / bio and gets a portfolio with:
   - a public shareable slug (`/p/your-name`)
   - a private **edit key**, generated once, stored in the browser's
     `localStorage` and required (as an `x-edit-key` header) for every
     write operation. There's no email/password login — the key is your
     access token to your own showcase, in the same spirit as a private
     "edit link."
2. **Editor** — `/editor/:id` lets you update your profile and add, edit,
   or delete projects (title, description, tags, links, up to 6 images
   each, uploaded via Multer to `backend/uploads` and served statically).
3. **Public page** — `/p/:slug` renders a clean, read-only showcase of the
   profile and every project — this is the link you share with recruiters.

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env     # then edit MONGO_URI if needed
npm install
npm run dev                # nodemon, http://localhost:5000
```

Requires a running MongoDB instance — either local
(`mongodb://127.0.0.1:27017`) or a connection string from MongoDB Atlas.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`,
so both apps just need to be running side by side — no extra config.

### 3. Use it

Open `http://localhost:5173`, click **Build your showcase**, fill in your
profile, then add projects from the editor. Copy the shareable link at the
top of the editor to preview or send your public page.

## API reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/portfolios` | — | Create a portfolio, returns `slug` + `editKey` |
| GET | `/api/portfolios/slug/:slug` | — | Public portfolio + its projects |
| GET | `/api/portfolios/:id/editor` | `x-edit-key` | Editor view of a portfolio |
| PUT | `/api/portfolios/:id` | `x-edit-key` | Update profile fields |
| POST | `/api/portfolios/:portfolioId/projects` | `x-edit-key` | Create a project (multipart, field `images`) |
| PUT | `/api/projects/:id` | `x-edit-key` | Update a project |
| DELETE | `/api/projects/:id` | `x-edit-key` | Delete a project |

## Design system

The UI uses a "technical spec sheet / blueprint" visual language —
graph-paper grids, crop-mark corners on cards, and monospace catalog
labels — since every project is, in effect, a spec sheet of what an
intern built. Palette: paper white, ink navy, blueprint blue, and brass
accent. Display type is Fraunces, body is Public Sans, labels are
JetBrains Mono.
