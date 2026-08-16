import { useResume } from "../../context/ResumeContext";
import EmptyState from "../ui/EmptyState";

function SectionLabel({ children }) {
  return (
    <div className="mb-2.5 mt-6 flex items-center gap-3 first:mt-0">
      <h3 className="font-mono shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-moss-dark">
        {children}
      </h3>
      <span className="h-px flex-1 bg-paper-line" />
    </div>
  );
}

function DateRange({ start, end }) {
  if (!start && !end) return null;
  return (
    <span className="font-mono shrink-0 whitespace-nowrap text-[12px] text-ink-soft">
      {start || "—"} – {end || "Present"}
    </span>
  );
}

function Bullets({ text }) {
  const lines = (text || "").split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className="mt-1.5 space-y-1">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2 text-[13.5px] leading-relaxed text-ink-light">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ResumePreview() {
  const { resume } = useResume();
  const { personalInfo, skills, experience, education } = resume;

  const hasAnyContent =
    personalInfo.name ||
    personalInfo.email ||
    personalInfo.summary ||
    skills.length ||
    experience.length ||
    education.length;

  if (!hasAnyContent) {
    return (
      <EmptyState
        title="Your resume will appear here"
        description="Start with your name and email — the preview fills in live as you type."
      />
    );
  }

  const contactLine = [personalInfo.phone, personalInfo.email, personalInfo.location, personalInfo.linkedin].filter(
    Boolean
  );

  return (
    <div className="px-8 py-9 sm:px-12 sm:py-12">
      {/* Header */}
      <header>
        <h1 className="font-display text-[32px] font-semibold leading-tight text-ink sm:text-[36px]">
          {personalInfo.name || "Your Name"}
        </h1>
        {contactLine.length > 0 && (
          <p className="font-mono mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[12.5px] text-ink-soft">
            {contactLine.map((item, i) => (
              <span key={item} className="flex items-center gap-2.5">
                {item}
                {i < contactLine.length - 1 && <span className="text-paper-line">·</span>}
              </span>
            ))}
          </p>
        )}
        {personalInfo.summary && (
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-light">{personalInfo.summary}</p>
        )}
      </header>

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <SectionLabel>Skills</SectionLabel>
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-[13.5px] text-ink-light">
            {skills.map((skill, i) => (
              <span key={skill} className="flex items-center gap-2">
                {skill}
                {i < skills.length - 1 && <span className="text-gold">/</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <SectionLabel>Experience</SectionLabel>
          <div className="space-y-4">
            {experience.map((row) => {
              const hasContent = row.title || row.company || row.location || row.startDate || row.endDate || row.description;
              if (!hasContent) return null;
              return (
                <div key={row.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[14.5px] font-semibold text-ink">
                      {row.title || "Role title"}
                      {row.company && <span className="font-normal text-ink-soft"> · {row.company}</span>}
                    </p>
                    <DateRange start={row.startDate} end={row.endDate} />
                  </div>
                  {row.location && <p className="text-[12.5px] text-ink-soft">{row.location}</p>}
                  <Bullets text={row.description} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <SectionLabel>Education</SectionLabel>
          <div className="space-y-4">
            {education.map((row) => {
              const hasContent = row.degree || row.school || row.location || row.startDate || row.endDate || row.details;
              if (!hasContent) return null;
              return (
                <div key={row.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[14.5px] font-semibold text-ink">
                      {row.degree || "Degree"}
                      {row.school && <span className="font-normal text-ink-soft"> · {row.school}</span>}
                    </p>
                    <DateRange start={row.startDate} end={row.endDate} />
                  </div>
                  {row.location && <p className="text-[12.5px] text-ink-soft">{row.location}</p>}
                  {row.details && <p className="mt-1 text-[13.5px] leading-relaxed text-ink-light">{row.details}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
