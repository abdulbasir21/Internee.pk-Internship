import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { generateResumePdf } from "../services/api";

// Why a Context instead of prop-drilling: the form lives on the left,
// the preview lives on the right, and both need the exact same state
// on every keystroke. A Context + one useState keeps that in one place
// instead of threading props through five component layers.

const ResumeContext = createContext(null);

let idCounter = 0;
// Small local ids so React can key/reorder list rows (experience,
// education). They never leave the browser — the API doesn't want them.
const makeId = () => `row-${++idCounter}-${Date.now()}`;

const emptyExperience = () => ({
  id: makeId(),
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
});

const emptyEducation = () => ({
  id: makeId(),
  degree: "",
  school: "",
  location: "",
  startDate: "",
  endDate: "",
  details: "",
});

const initialState = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
  },
  skills: [],
  experience: [],
  education: [],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [exportState, setExportState] = useState("idle"); // idle | loading | success | error
  const [exportError, setExportError] = useState("");

  // --- Personal info -----------------------------------------------
  const updatePersonalInfo = useCallback((field, value) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
    // Clear the error for this field the moment the user edits it —
    // re-validating on every keystroke would feel harsh before submit.
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // --- Skills ---------------------------------------------------------
  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setResume((prev) =>
      prev.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())
        ? prev
        : { ...prev, skills: [...prev.skills, trimmed] }
    );
  }, []);

  const removeSkill = useCallback((skill) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }, []);

  // --- Experience -------------------------------------------------
  const addExperience = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, emptyExperience()],
    }));
  }, []);

  const updateExperience = useCallback((id, field, value) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  }, []);

  const removeExperience = useCallback((id) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((row) => row.id !== id),
    }));
  }, []);

  // --- Education ----------------------------------------------------
  const addEducation = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, emptyEducation()],
    }));
  }, []);

  const updateEducation = useCallback((id, field, value) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  }, []);

  const removeEducation = useCallback((id) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((row) => row.id !== id),
    }));
  }, []);

  // --- Validation -----------------------------------------------------
  // Only name + email are required by the API — everything else is
  // free to be blank. Keeping this in one function is what "before
  // allowing export" checks against.
  const validate = useCallback(() => {
    const errors = {};
    const { name, email } = resume.personalInfo;
    if (!name.trim()) errors.name = "Enter your full name.";
    if (!email.trim()) errors.email = "Enter your email.";
    else if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [resume.personalInfo]);

  // --- Export ---------------------------------------------------------
  const exportPdf = useCallback(async () => {
    if (!validate()) {
      setExportState("error");
      setExportError("Fix the highlighted fields before exporting.");
      return;
    }
    setExportState("loading");
    setExportError("");
    try {
      await generateResumePdf(resume);
      setExportState("success");
    } catch (err) {
      setExportState("error");
      setExportError(err.message || "Something went wrong generating your PDF.");
    }
  }, [resume, validate]);

  const resetExportState = useCallback(() => {
    setExportState("idle");
    setExportError("");
  }, []);

  const value = useMemo(
    () => ({
      resume,
      fieldErrors,
      exportState,
      exportError,
      updatePersonalInfo,
      addSkill,
      removeSkill,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      exportPdf,
      resetExportState,
    }),
    [
      resume,
      fieldErrors,
      exportState,
      exportError,
      updatePersonalInfo,
      addSkill,
      removeSkill,
      addExperience,
      updateExperience,
      removeExperience,
      addEducation,
      updateEducation,
      removeEducation,
      exportPdf,
      resetExportState,
    ]
  );

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
