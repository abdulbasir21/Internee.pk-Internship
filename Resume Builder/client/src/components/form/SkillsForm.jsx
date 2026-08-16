import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import SectionCard from "../ui/SectionCard";
import Tag from "../ui/Tag";

const SUGGESTIONS = ["JavaScript", "Python", "React", "SQL", "Git", "Figma"];

export default function SkillsForm() {
  const { resume, addSkill, removeSkill } = useResume();
  const [draft, setDraft] = useState("");

  // Enter or comma commits the current draft as a skill chip — the
  // fastest way to enter a list of short items without extra clicks.
  const commit = () => {
    if (!draft.trim()) return;
    addSkill(draft);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && resume.skills.length) {
      removeSkill(resume.skills[resume.skills.length - 1]);
    }
  };

  const suggestionsToShow = SUGGESTIONS.filter(
    (s) => !resume.skills.some((existing) => existing.toLowerCase() === s.toLowerCase())
  );

  return (
    <SectionCard
      step={2}
      title="Skills"
      description="Type a skill and press Enter to add it."
    >
      <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-lg border border-paper-line bg-paper-raised px-3 py-2.5 transition-colors focus-within:border-moss focus-within:ring-2 focus-within:ring-moss/30">
        {resume.skills.map((skill) => (
          <Tag key={skill} onRemove={() => removeSkill(skill)} removeLabel="Remove skill">
            {skill}
          </Tag>
        ))}
        <input
          id="skills-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={resume.skills.length ? "" : "React, Node.js, SQL…"}
          className="min-w-[120px] flex-1 border-0 bg-transparent py-1 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none"
        />
      </div>

      {suggestionsToShow.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-ink-soft">Quick add:</span>
          {suggestionsToShow.slice(0, 5).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addSkill(s)}
              className="rounded-full border border-dashed border-paper-line px-3 py-1 text-[13px] text-ink-soft transition-colors hover:border-moss hover:text-moss"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
