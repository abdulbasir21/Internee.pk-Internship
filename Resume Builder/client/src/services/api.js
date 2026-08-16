// All backend calls live in this one file — if the API base URL or
// endpoint shape ever changes, this is the only place to touch.

const API_BASE = "http://localhost:5000";

// Convert an "" | undefined value to undefined so the request body
// only ever contains fields the user actually filled in — the API
// treats missing fields as "skip this," which is what an intern with
// a half-finished resume actually wants.
const clean = (value) => (value === "" || value == null ? undefined : value);

function buildPayload(resume) {
  const { personalInfo, skills, experience, education } = resume;

  return {
    personalInfo: {
      name: personalInfo.name.trim(),
      email: personalInfo.email.trim(),
      phone: clean(personalInfo.phone),
      location: clean(personalInfo.location),
      linkedin: clean(personalInfo.linkedin),
      summary: clean(personalInfo.summary),
    },
    skills: skills.length ? skills : undefined,
    experience: experience.length
      ? experience.map(({ id, ...row }) => ({
          title: clean(row.title),
          company: clean(row.company),
          location: clean(row.location),
          startDate: clean(row.startDate),
          endDate: clean(row.endDate),
          // Textarea stores newline-separated bullets as one string;
          // the API wants each bullet as its own array entry.
          description: row.description
            ? row.description.split("\n").map((line) => line.trim()).filter(Boolean)
            : undefined,
        }))
      : undefined,
    education: education.length
      ? education.map(({ id, ...row }) => ({
          degree: clean(row.degree),
          school: clean(row.school),
          location: clean(row.location),
          startDate: clean(row.startDate),
          endDate: clean(row.endDate),
          details: clean(row.details),
        }))
      : undefined,
  };
}

// Reads a filename out of a Content-Disposition header, falling back
// to a sensible default if the backend ever omits it.
function filenameFromHeader(header, fallbackName) {
  const match = header?.match(/filename="?([^"]+)"?/);
  if (match) return match[1];
  const safe = fallbackName?.trim().replace(/\s+/g, "_") || "resume";
  return `${safe}_resume.pdf`;
}

export async function generateResumePdf(resume) {
  const payload = buildPayload(resume);

  let res;
  try {
    res = await fetch(`${API_BASE}/api/generate-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // fetch itself throws on network failure (server down, CORS, etc.)
    throw new Error("Can't reach the server. Check that the backend is running.");
  }

  if (!res.ok) {
    let message = "Failed to generate PDF resume.";
    try {
      const body = await res.json();
      message = body.details?.join(", ") || body.error || message;
    } catch {
      // response wasn't JSON — keep the default message
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const filename = filenameFromHeader(
    res.headers.get("Content-Disposition"),
    payload.personalInfo.name
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
