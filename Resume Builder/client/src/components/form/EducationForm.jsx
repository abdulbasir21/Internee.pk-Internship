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

export default function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <SectionCard
      step={4}
      title="Education"
      description="Degrees, bootcamps, or relevant coursework."
      action={
        <Button variant="secondary" size="sm" icon={<PlusIcon />} onClick={addEducation}>
          Add school
        </Button>
      }
    >
      {resume.education.length === 0 ? (
        <button
          type="button"
          onClick={addEducation}
          className="w-full rounded-xl border border-dashed border-paper-line py-8 text-[14px] text-ink-soft transition-colors hover:border-moss hover:bg-moss-light/30 hover:text-moss-dark"
        >
          + Add your school
        </button>
      ) : (
        <div className="flex flex-col gap-5">
          {resume.education.map((row, i) => (
            <div
              key={row.id}
              className="animate-fadeUp rounded-xl border border-paper-line bg-paper/60 p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-wide text-ink-soft">
                  School {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEducation(row.id)}
                  aria-label="Remove school"
                  className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-clay-light hover:text-clay"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <Input
                  id={`edu-degree-${row.id}`}
                  label="Degree"
                  placeholder="B.S. in Computer Science"
                  value={row.degree}
                  onChange={(e) => updateEducation(row.id, "degree", e.target.value)}
                />
                <Input
                  id={`edu-school-${row.id}`}
                  label="School"
                  placeholder="University of Texas at Austin"
                  value={row.school}
                  onChange={(e) => updateEducation(row.id, "school", e.target.value)}
                />
                <Input
                  id={`edu-location-${row.id}`}
                  label="Location"
                  placeholder="Austin, TX"
                  value={row.location}
                  onChange={(e) => updateEducation(row.id, "location", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3.5">
                  <Input
                    id={`edu-start-${row.id}`}
                    label="Start"
                    placeholder="Aug 2023"
                    value={row.startDate}
                    onChange={(e) => updateEducation(row.id, "startDate", e.target.value)}
                  />
                  <Input
                    id={`edu-end-${row.id}`}
                    label="End"
                    placeholder="May 2027"
                    value={row.endDate}
                    onChange={(e) => updateEducation(row.id, "endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3.5">
                <TextArea
                  id={`edu-details-${row.id}`}
                  label="Details"
                  rows={2}
                  placeholder="GPA: 3.8/4.0, Dean's List"
                  value={row.details}
                  onChange={(e) => updateEducation(row.id, "details", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
