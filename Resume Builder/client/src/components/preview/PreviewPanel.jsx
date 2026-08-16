import { useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import ResumePreview from "./ResumePreview";
import Button from "../ui/Button";
import Loader from "../ui/Loader";

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2v8m0 0l-3-3m3 3l3-3M3 12.5h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PreviewPanel() {
  const { exportState, exportError, exportPdf, resetExportState } = useResume();
  const isLoading = exportState === "loading";

  // A success state that never goes away starts to feel stale the next
  // time the user edits something — fade the confirmation back to idle.
  useEffect(() => {
    if (exportState !== "success") return;
    const timer = setTimeout(resetExportState, 4000);
    return () => clearTimeout(timer);
  }, [exportState, resetExportState]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wide text-ink-soft">Live preview</p>
          <p className="mt-0.5 font-display text-lg font-semibold text-ink">Fernwood template</p>
        </div>
        <Button
          variant="primary"
          onClick={exportPdf}
          disabled={isLoading}
          icon={isLoading ? <Loader size={16} /> : <DownloadIcon />}
        >
          {isLoading ? "Generating…" : "Export as PDF"}
        </Button>
      </div>

      {exportState === "error" && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-clay/30 bg-clay-light px-4 py-3 text-[13.5px] text-clay animate-fadeUp"
        >
          <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>{exportError}</span>
        </div>
      )}

      {exportState === "success" && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2.5 rounded-xl border border-moss/25 bg-moss-light px-4 py-3 text-[13.5px] text-moss-dark animate-fadeUp"
        >
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M5.5 8.2l1.8 1.8 3.2-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Your PDF downloaded successfully.</span>
        </div>
      )}

      {/* The "paper": a floating page with real page-edge shadow, the
          signature visual element of this design. */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-sm bg-paper/40 p-2 sm:p-6">
        <div className="mx-auto max-w-[640px] rounded-[2px] bg-paper-raised shadow-page ring-1 ring-black/[0.03]">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
