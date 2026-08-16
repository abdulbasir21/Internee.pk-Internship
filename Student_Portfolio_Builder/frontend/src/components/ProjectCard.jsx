import SpecTag from "./SpecTag.jsx";

const entryNumber = (i) => String(i + 1).padStart(2, "0");

export default function ProjectCard({ project, index, editable, onEdit, onDelete }) {
  const cover = project.images?.[0];

  return (
    <article className="crop-marks group rounded-sm border-2 border-ink bg-white transition-transform hover:-translate-y-1">
      <span className="cm-tr" />
      <span className="cm-br" />

      {cover ? (
        <div className="aspect-[16/10] w-full overflow-hidden border-b-2 border-ink bg-line/40">
          <img src={cover} alt={project.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex aspect-[16/10] w-full items-center justify-center border-b-2 border-ink bg-blueprint/5">
          <span className="font-mono text-xs uppercase tracking-widest text-blueprint-dark/60">
            No image attached
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/45">
            Entry / {entryNumber(index)}
          </p>
          {project.role && (
            <p className="font-mono text-[11px] uppercase tracking-widest text-brass-dark">
              {project.role}
            </p>
          )}
        </div>

        <h3 className="mt-2 font-display text-xl font-medium leading-snug">{project.title}</h3>
        <p className="mt-2 text-sm text-ink/65 line-clamp-3">{project.description}</p>

        {project.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <SpecTag key={t}>{t}</SpecTag>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-line pt-4">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-blueprint hover:text-blueprint-dark"
            >
              Live demo ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-wide text-blueprint hover:text-blueprint-dark"
            >
              Source ↗
            </a>
          )}

          {editable && (
            <div className="ml-auto flex gap-3">
              <button
                onClick={() => onEdit(project)}
                className="font-mono text-xs uppercase tracking-wide text-ink/60 hover:text-ink"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(project)}
                className="font-mono text-xs uppercase tracking-wide text-red-600/70 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
