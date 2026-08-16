<div align="center">

# 🌿 Fernwood
### Intern Resume Builder

Fill a form. Watch it turn into a resume live. Export a clean PDF.
No login. No database. No friction.

![React](https://img.shields.io/badge/React-19-1E2A38?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express-3B6E5E?style=flat-square&logo=node.js&logoColor=white)
![PDFKit](https://img.shields.io/badge/PDFKit-PDF%20Engine-C79A3D?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-5a5a5a?style=flat-square)

</div>

---

## ✨ What it is

**Fernwood** is a single-page resume builder built for interns and students who need a clean, professional resume fast. Type into a form on the left, watch a live "paper" preview build itself on the right, then hit **Export as PDF** — a Node.js backend draws the actual PDF with [PDFKit](https://pdfkit.org/), no HTML-to-PDF conversion, no headless browser.

Everything lives in memory for the session. No accounts, no database, no setup friction — just data in, resume out.

## 🧩 Features

- 📝 **Live preview** — every keystroke updates a styled, paper-like resume preview instantly
- ✅ **Minimal required fields** — only name and email; everything else is optional
- 🏷️ **Tag-style skill input** — type + Enter to add, with quick-add suggestions
- 💼 **Repeatable Experience & Education rows** — add or remove as many as you need
- 📄 **Real PDF generation** — server-side, programmatic, auto-paginating, no orphaned headings
- ⚡ **Zero setup** — no login, no database, no config files to touch
- 🎨 **A deliberate visual identity** — a custom "paper and ink" palette and type system, not default Tailwind

## 🖥️ Tech stack

| Layer | Stack |
|---|---|
| **Frontend** | React 19 (hooks only) · Vite · Tailwind CSS · plain `fetch` |
| **Backend** | Node.js · Express · [PDFKit](https://pdfkit.org/) · cors |
| **State** | Single React Context — no Redux/Zustand |
| **Data** | None persisted — fully stateless, in-memory only |

## 📁 Project structure

```
fernwood/
├── client/                      # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── form/            # PersonalInfoForm, SkillsForm, ExperienceForm, EducationForm
│       │   ├── preview/         # ResumePreview (template) + PreviewPanel (export UI)
│       │   ├── ui/               # Button, Card, Input, Tag, Loader, SectionCard...
│       │   └── Header.jsx
│       ├── context/
│       │   └── ResumeContext.jsx # single source of truth for form state
│       ├── services/
│       │   └── api.js            # the one function that talks to the backend
│       └── App.jsx
│
└── server/                      # Node.js + Express backend
    ├── routes/
    │   └── resumeRoutes.js       # maps the endpoint to its controller
    ├── controllers/
    │   └── resumeController.js   # HTTP layer: validate → generate → respond
    ├── services/
    │   └── pdfGenerator.js       # all PDFKit layout/drawing code
    ├── utils/
    │   └── validators.js         # pure input validation
    └── server.js
```

## 🚀 Getting started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd fernwood
```

### 2. Start the backend

```bash
cd server
npm install
npm start        # runs on http://localhost:5000
```

### 3. Start the frontend

```bash
cd client
npm install
npm run dev       # runs on http://localhost:5173
```

Open **`http://localhost:5173`** — the **Export as PDF** button needs the backend running on port `5000` to work.

## 🔌 API

**Base URL (dev):** `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Quick liveness check → `{ "status": "ok" }` |
| `POST` | `/api/generate-resume` | Takes resume JSON, returns a generated PDF file |

<details>
<summary><strong>POST /api/generate-resume — request body</strong></summary>

```json
{
  "personalInfo": {
    "name": "Jordan Lee",
    "email": "jordan.lee@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "Austin, TX",
    "linkedin": "linkedin.com/in/jordanlee",
    "summary": "Short professional summary..."
  },
  "skills": ["JavaScript", "Node.js", "React"],
  "experience": [
    {
      "title": "Software Engineering Intern",
      "company": "BrightPath Analytics",
      "startDate": "Jun 2025",
      "endDate": "Aug 2025",
      "description": ["Built a dashboard feature used by 200+ analysts"]
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",
      "school": "University of Texas at Austin",
      "startDate": "Aug 2023",
      "endDate": "May 2027"
    }
  ]
}
```

Only `personalInfo.name` and `personalInfo.email` are required — everything else can be omitted. Full reference in [`server/API.md`](./server/API.md).
</details>

## 🏗️ How it works

```
Type in the form
   │
   ▼
ResumeContext (shared state) ──► ResumePreview (live, styled preview)
   │
   ▼  Export as PDF
services/api.js → POST /api/generate-resume
   │
   ▼
Express validates again → PDFKit draws the PDF → buffered → sent back
   │
   ▼
Browser downloads the file automatically
```

No database. No auth. No file uploads. Just one clean round trip from form to PDF.

## 🛣️ Roadmap ideas

- [ ] Additional resume templates (the code already has a `TEMPLATES` registry ready for it)
- [ ] Optional accounts + saved resumes
- [ ] Automated test suite
- [ ] CI/CD + containerized deployment

## 📄 License

MIT — free to use, modify, and build on.

---

<div align="center">
<sub>Built with care, one section at a time. 🌿</sub>
</div>
