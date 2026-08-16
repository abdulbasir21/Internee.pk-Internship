# Resume Builder API — Frontend Reference

Base URL (local dev): `http://localhost:5000`

## Endpoints

### `GET /health`
Quick check that the server is up.

**Response** `200`:
```json
{ "status": "ok" }
```

---

### `POST /api/generate-resume`
Generates a PDF resume from form data and returns the file directly.

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "personalInfo": {
    "name": "Jordan Lee",          // required
    "email": "jordan@example.com", // required, must be valid email
    "phone": "+1 (555) 123-4567",  // optional
    "location": "Austin, TX",      // optional
    "linkedin": "linkedin.com/in/jordanlee", // optional
    "summary": "Short paragraph about the candidate." // optional
  },
  "skills": ["JavaScript", "React", "Node.js"], // optional array of strings
  "experience": [
    {
      "title": "Software Engineering Intern", // optional
      "company": "BrightPath Analytics",       // optional
      "location": "Remote",                    // optional
      "startDate": "Jun 2025",                 // optional
      "endDate": "Aug 2025",                   // optional — omit for "Present"
      "description": ["Bullet one", "Bullet two"] // optional, string OR array of strings
    }
  ],
  "education": [
    {
      "degree": "B.S. in Computer Science",     // optional
      "school": "University of Texas at Austin",// optional
      "location": "Austin, TX",                 // optional
      "startDate": "Aug 2023",                  // optional
      "endDate": "May 2027",                    // optional
      "details": "GPA: 3.8/4.0"                 // optional
    }
  ]
}
```

Only `personalInfo.name` and `personalInfo.email` are required. Everything
else can be omitted entirely — the PDF just skips empty sections.

**On success — `200`:**
Returns the raw PDF file, not JSON.
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="<name>_resume.pdf"`

**On validation failure — `400`:**
```json
{
  "error": "Invalid resume data.",
  "details": ["personalInfo.email is required."]
}
```
`details` is an array — there can be more than one message.

**On server-side failure — `500`:**
```json
{ "error": "Failed to generate PDF resume." }
```

## Frontend usage example

```js
async function downloadResume(formData) {
  const res = await fetch("http://localhost:5000/api/generate-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const { error, details } = await res.json();
    throw new Error(details?.join(", ") || error);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
```

## Notes
- No auth, no cookies, no session — every request is self-contained.
- CORS is open, so this can be called from any frontend origin during dev.
- `experience[].description` and `education[].details` accept either a
  single string or an array of strings (rendered as bullet points).
