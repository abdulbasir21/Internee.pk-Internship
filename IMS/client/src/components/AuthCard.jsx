// src/components/AuthCard.jsx
//
// Shared visual shell for the login/signup pages so they all feel
// like one consistent product, not separately-styled forms.
// Renders the same dark, glassy backdrop used across every auth page.

export default function AuthCard({ icon, gradient, accentColor, title, subtitle, children, footer }) {
  const badgeBg = gradient || `linear-gradient(135deg, ${accentColor} 0%, ${accentColor} 100%)`;

  return (
    <div className="relative min-h-screen bg-ink-950 flex items-center justify-center px-4 overflow-hidden">
      {/* Background — grid + ambient glow, shared across all auth pages */}
      <div className="absolute inset-0 pointer-events-none bg-grid" style={{ backgroundSize: "48px 48px" }} />
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,86,217,0.22) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,158,117,0.18) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-[14px] mb-4"
            style={{ background: badgeBg, border: "0.5px solid rgba(127,119,221,0.4)" }}
          >
            {icon}
          </div>
          <p className="text-xs uppercase tracking-widest text-brand-400 font-semibold">
            Intern Tracker
          </p>
          <h1 className="text-xl font-display font-semibold text-white mt-1 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{subtitle}</p>}
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)" }}
        >
          {children}
        </div>

        {footer && (
          <div className="text-center mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
