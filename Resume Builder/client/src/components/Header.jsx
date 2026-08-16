import { useResume } from "../context/ResumeContext";

function sectionsComplete(resume) {
  let n = 0;
  if (resume.personalInfo.name && resume.personalInfo.email) n++;
  if (resume.skills.length) n++;
  if (resume.experience.length) n++;
  if (resume.education.length) n++;
  return n;
}

export default function Header() {
  const { resume } = useResume();
  const complete = sectionsComplete(resume);

  return (
    <header className="sticky top-0 z-20 border-b border-paper-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-paper">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 2h10v12H3z" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-[19px] font-semibold tracking-tight text-ink">
            Fernwood
          </span>
          <span className="hidden rounded-full bg-gold-light px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold sm:inline-block">
            for interns
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-1.5 w-28 overflow-hidden rounded-full bg-paper-line">
              <div
                className="h-full rounded-full bg-moss transition-all duration-500 ease-out"
                style={{ width: `${(complete / 4) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[12px] text-ink-soft">{complete}/4</span>
          </div>
        </div>
      </div>
    </header>
  );
}
