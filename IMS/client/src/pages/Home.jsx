// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { ShieldCheck, User, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-ink-950 flex items-center justify-center px-4 overflow-hidden">

      {/* Background — grid + orbs */}
      <div
        className="absolute inset-0 pointer-events-none bg-grid"
        style={{ backgroundSize: "48px 48px" }}
      />
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,86,217,0.22) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,158,117,0.18) 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,86,217,0.12) 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 mb-5 text-[11px] font-medium tracking-widest uppercase"
          style={{
            background: "rgba(99,86,217,0.18)",
            border: "0.5px solid rgba(127,119,221,0.4)",
            color: "#AFA9EC",
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD]" />
          Intern Tracker
        </div>

        {/* Headline */}
        <h1 className="text-[28px] font-display font-medium leading-snug tracking-tight text-white mb-3">
          Track intern progress,<br />
          <span style={{
            background: "linear-gradient(135deg, #AFA9EC 0%, #5DCAA5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            without the spreadsheet.
          </span>
        </h1>

        <p className="text-sm leading-relaxed mb-8 mx-auto max-w-[300px]"
          style={{ color: "rgba(255,255,255,0.45)" }}>
          Assign tasks, submit work, and watch progress update in real time.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {[
            { num: "12k+", lbl: "Tasks tracked" },
            { num: "98%",  lbl: "On-time rate" },
            { num: "500+", lbl: "Teams using it" },
          ].map((s, i) => (
            <div key={s.lbl} className="flex items-center gap-6">
              {i > 0 && (
                <div className="self-stretch w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              )}
              <div className="text-center">
                <div className="text-lg font-medium text-white tracking-tight">{s.num}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-2.5">

          {/* Admin */}
          <Link
            to="/admin/login"
            className="flex items-center justify-between rounded-[14px] px-4 py-3.5 transition-transform hover:-translate-y-px group"
            style={{ background: "rgba(255,255,255,0.96)", border: "0.5px solid rgba(255,255,255,0.3)" }}
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(13,15,26,0.07)" }}>
                <ShieldCheck size={18} color="#0d0f1a" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-[#0d0f1a]">Admin login</span>
                <span className="block text-xs mt-0.5" style={{ color: "rgba(13,15,26,0.45)" }}>Manage interns and tasks</span>
              </span>
            </span>
            <ArrowRight size={16} color="#0d0f1a" style={{ opacity: 0.35 }} className="group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* Intern */}
          <Link
            to="/intern/login"
            className="flex items-center justify-between rounded-[14px] px-4 py-3.5 transition-transform hover:-translate-y-px group"
            style={{
              background: "linear-gradient(135deg, #534AB7 0%, #3C3489 100%)",
              border: "0.5px solid rgba(127,119,221,0.5)",
            }}
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}>
                <User size={18} color="#ffffff" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-white">Intern login</span>
                <span className="block text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>View tasks and track progress</span>
              </span>
            </span>
            <ArrowRight size={16} color="#ffffff" style={{ opacity: 0.45 }} className="group-hover:opacity-90 transition-opacity" />
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2.5 my-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>new here?</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Sign-up link */}
        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          New intern?{" "}
          <Link
            to="/intern/signup"
            className="font-medium hover:opacity-80 transition-opacity"
            style={{
              color: "#AFA9EC",
              borderBottom: "1px solid rgba(175,169,236,0.35)",
              paddingBottom: "1px",
            }}
          >
            Create an account →
          </Link>
        </p>

      </div>
    </div>
  );
}