import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Lock, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import logo from "../../../public/logo.png";

type Role = "employee" | "supervisor" | "director" | "finance" | "admin";

const ROLE_LABELS: Record<Role, string> = {
  employee:   "Employee",
  supervisor: "Supervisor",
  director:   "Director",
  finance:    "Finance",
  admin:      "Admin",
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [role,      setRole]      = useState<Role>("employee");
  const [remember,  setRemember]  = useState(false);
  const [showPwd,   setShowPwd]   = useState(false);
  const [error,     setError]     = useState("");
  const [status,    setStatus]    = useState<"idle" | "loading" | "success">("idle");
  const [tick,      setTick]      = useState(0);

  // Animated dots on the decorative border
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 1000);
    }, 1500);
  };

  // Corner marker component
  const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
    const base = "absolute w-5 h-5";
    const positions: Record<string, string> = {
      tl: "-top-[2px] -left-[2px]",
      tr: "-top-[2px] -right-[2px]",
      bl: "-bottom-[2px] -left-[2px]",
      br: "-bottom-[2px] -right-[2px]",
    };
    const borders: Record<string, string> = {
      tl: "border-t-2 border-l-2",
      tr: "border-t-2 border-r-2",
      bl: "border-b-2 border-l-2",
      br: "border-b-2 border-r-2",
    };
    return <div className={`${base} ${positions[pos]} ${borders[pos]} border-[#60a5fa]`} />;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(160deg, #001f3f 0%, #00355f 45%, #0a1f3c 100%)",
      }}
    >
      {/* Background grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(37,99,235,0.25)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(96,165,250,0.15)" }} />
      </div>

      {/* ── CARD ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-[440px]">

        {/* Outer border frame with animated corners */}
        <div className="relative p-[1px] rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(96,165,250,0.4), rgba(255,255,255,0.08), rgba(96,165,250,0.2))" }}>

          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          {/* Animated scan line */}
          <div
            className="absolute left-0 right-0 h-[1px] pointer-events-none"
            style={{
              top: `${20 + (tick % 5) * 15}%`,
              background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.3), transparent)",
              transition: "top 1.2s ease-in-out",
            }}
          />

          {/* Inner card */}
          <div
            className="rounded-2xl px-8 py-10 relative overflow-hidden"
            style={{ backgroundColor: "rgba(5,20,40,0.92)", backdropFilter: "blur(20px)" }}
          >

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col items-center mb-8 text-center">
              {/* Logo */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden"
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 0 1px rgba(96,165,250,0.3), 0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src={logo}
                  alt="Petty Cash System"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    t.style.display = "none";
                    const p = t.parentElement;
                    if (p) p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00355f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
                  }}
                />
              </div>

              <h1
                className="text-[22px] font-extrabold leading-tight tracking-tight"
                style={{ color: "#ffffff" }}
              >
                Petty Cash System
              </h1>
              <p className="text-[12px] font-semibold tracking-[0.18em] uppercase mt-1.5"
                style={{ color: "#60a5fa" }}>
                IT Finance Management
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mt-5 w-full">
                <div className="flex-1 h-px" style={{ background: "rgba(96,165,250,0.2)" }} />
                <span className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: "rgba(148,163,184,0.6)" }}>
                  Secure Access
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(96,165,250,0.2)" }} />
              </div>
            </div>

            {/* ── Form ──────────────────────────────────────────────────── */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Role selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: "rgba(148,163,184,0.8)" }}>
                  Role
                </label>
                <div className="grid grid-cols-5 gap-1 p-1 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRole(val)}
                      className="py-1.5 rounded-lg text-[11px] font-bold transition-all"
                      style={
                        role === val
                          ? { backgroundColor: "#1d4ed8", color: "#ffffff", boxShadow: "0 2px 8px rgba(29,78,216,0.4)" }
                          : { color: "rgba(148,163,184,0.7)", backgroundColor: "transparent" }
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="username"
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: "rgba(148,163,184,0.8)" }}>
                  Username
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(148,163,184,0.5)" }} />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    placeholder="Enter your ID or email"
                    autoComplete="username"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none transition-all"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#ffffff",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(96,165,250,0.6)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password"
                    className="text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: "rgba(148,163,184,0.8)" }}>
                    Password
                  </label>
                  <a href="#"
                    className="text-[11px] font-semibold transition-colors"
                    style={{ color: "#60a5fa" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#93c5fd")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#60a5fa")}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(148,163,184,0.5)" }} />
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl text-[13px] outline-none transition-all"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#ffffff",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(96,165,250,0.6)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "rgba(148,163,184,0.5)" }}>
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer" onClick={() => setRemember(v => !v)}>
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: remember ? "#1d4ed8" : "transparent",
                    border: `1.5px solid ${remember ? "#1d4ed8" : "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  {remember && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[12px]" style={{ color: "rgba(148,163,184,0.8)" }}>
                  Remember this workstation
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]"
                  style={{ backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status !== "idle"}
                className="w-full py-3 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all mt-2"
                style={
                  status === "success"
                    ? { backgroundColor: "#16a34a", color: "#ffffff" }
                    : { background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#ffffff",
                        boxShadow: "0 4px 16px rgba(29,78,216,0.4)" }
                }
              >
                {status === "idle"    && <><span>Sign In</span><ArrowRight size={16} /></>}
                {status === "loading" && <><Loader2 size={16} className="animate-spin" /><span>Authenticating…</span></>}
                {status === "success" && <><CheckCircle2 size={16} /><span>Access Granted</span></>}
              </button>
            </form>

            {/* ── Footer note ────────────────────────────────────────────── */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <ShieldCheck size={13} style={{ color: "rgba(96,165,250,0.6)" }} />
              <p className="text-[11px] text-center"
                style={{ color: "rgba(148,163,184,0.5)" }}>
                Authorized personnel only · IT Finance Department
              </p>
            </div>
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="flex justify-between items-center mt-4 px-1">
          <span className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "rgba(148,163,184,0.35)" }}>
            v2.4.0-PRO
          </span>
          <div className="flex items-center gap-3">
            {["Privacy","Terms","Support"].map((link) => (
              <a key={link} href="#"
                className="text-[10px] font-semibold uppercase tracking-widest transition-colors"
                style={{ color: "rgba(148,163,184,0.35)" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "rgba(96,165,250,0.7)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "rgba(148,163,184,0.35)")}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}