import { useResume } from "../../context/ResumeContext";
import SectionCard from "../ui/SectionCard";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5l.6 8.4a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } = useResume();

  return (
    <SectionCard
      step={3}
      title="Experience"
      description="Internships, part-time roles, or projects — most recent first."
      action={
        <Button variant="secondary" size="sm" icon={<PlusIcon />} onClick={addExperience}>
          Add role
        </Button>
      }
    >
      {resume.experience.length === 0 ? (
        <button
          type="button"
          onClick={addExperience}
          className="w-full rounded-xl border border-dashed border-paper-line py-8 text-[14px] text-ink-soft transition-colors hover:border-moss hover:bg-moss-light/30 hover:text-moss-dark"
        >
          + Add your first role
        </button>
      ) : (
        <div className="flex flex-col gap-5">
          {resume.experience.map((row, i) => (
            <div
              key={row.id}
              className="animate-fadeUp rounded-xl border border-paper-line bg-paper/60 p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-wide text-ink-soft">
                  Role {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeExperience(row.id)}
                  aria-label="Remove role"
                  className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-clay-light hover:text-clay"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <Input
                  id={`exp-title-${row.id}`}
                  label="Job title"
                  placeholder="Software Engineering Intern"
                  value={row.title}
                  onChange={(e) => updateExperience(row.id, "title", e.target.value)}
                />
                <Input
                  id={`exp-company-${row.id}`}
                  label="Company"
                  placeholder="BrightPath Analytics"
                  value={row.company}
                  onChange={(e) => updateExperience(row.id, "company", e.target.value)}
                />
                <Input
                  id={`exp-location-${row.id}`}
                  label="Location"
                  placeholder="Remote"
                  value={row.location}
                  onChange={(e) => updateExperience(row.id, "location", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3.5">
                  <Input
                    id={`exp-start-${row.id}`}
                    label="Start"
                    placeholder="Jun 2025"
                    value={row.startDate}
                    onChange={(e) => updateExperience(row.id, "startDate", e.target.value)}
                  />
                  <Input
                    id={`exp-end-${row.id}`}
                    label="End"
                    placeholder="Present"
                    value={row.endDate}
                    onChange={(e) => updateExperience(row.id, "endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3.5">
                <TextArea
                  id={`exp-desc-${row.id}`}
                  label="Highlights"
                  hint="One line per bullet point."
                  rows={3}
                  placeholder={"Built a dashboard used by 40+ analysts\nCut report generation time by 30%"}
                  value={row.description}
                  onChange={(e) => updateExperience(row.id, "description", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
