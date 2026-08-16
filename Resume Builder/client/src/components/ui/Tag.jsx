export default function Tag({ children, onRemove, removeLabel = "Remove" }) {
  return (
    <span className="group inline-flex items-center gap-1.5 rounded-full bg-moss-light py-1.5 pl-3.5 pr-2 text-[13.5px] font-medium text-moss-dark animate-fadeUp">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${removeLabel} ${children}`}
          className="grid h-4 w-4 place-items-center rounded-full text-moss-dark/60 transition-colors hover:bg-moss-dark/15 hover:text-moss-dark"
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
