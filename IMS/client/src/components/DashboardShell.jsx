// src/components/DashboardShell.jsx
import { LogOut, Sparkles } from "lucide-react";

export default function DashboardShell({ roleLabel, icon, name, accentGradient, onLogout, children }) {
  const gradient = accentGradient || "linear-gradient(135deg, #6356D6 0%, #4F44B0 100%)";

  return (
    <div className="min-h-screen flex" style={{ background: "#0F0E17" }}>
      {/* Sidebar */}
      <aside
        className="w-72 flex flex-col shrink-0 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1A1828 0%, #13121F 100%)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Ambient glow behind avatar area */}
        <div
          className="absolute top-0 left-0 w-full h-64 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% -10%, rgba(99,86,214,0.22) 0%, transparent 70%)` }}
        />

        {/* Brand */}
        <div className="relative px-7 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: gradient }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold leading-none" style={{ color: "rgba(255,255,255,0.3)" }}>
                Intern Tracker
              </p>
              <h1 className="text-[15px] font-semibold mt-1.5 leading-none text-white">{roleLabel}</h1>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 28px" }} />

        {/* Profile card */}
        <div className="relative px-5 py-6">
          <div
            className="rounded-2xl px-4 py-4 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md"
              style={{ background: gradient }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight truncate text-white">{name}</p>
              <p className="text-xs leading-tight mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{roleLabel}</p>
            </div>
            <div
              className="ml-auto w-2 h-2 rounded-full shrink-0"
              style={{ background: "#22C55E", boxShadow: "0 0 6px #22C55E" }}
            />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout */}
        <div className="px-7 py-7" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 text-sm transition-colors group"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <LogOut size={13} />
            </div>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 overflow-auto"
        style={{ background: "#F7F6FB" }}
      >
        <div className="max-w-5xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}