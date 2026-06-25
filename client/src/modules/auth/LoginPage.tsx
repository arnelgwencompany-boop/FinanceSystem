import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Lock, ArrowRight, Loader2, CheckCircle2,
  Eye, EyeOff, ChevronDown, ShieldCheck,
} from "lucide-react";
import logo from "../../../public/logo.png";

type Role = "employee" | "supervisor" | "director" | "finance" | "admin";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "employee",   label: "Employee"   },
  { value: "supervisor", label: "Supervisor" },
  { value: "director",   label: "Director"   },
  { value: "finance",    label: "Finance"    },
  { value: "admin",      label: "Admin"      },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState<Role>("employee");
  const [remember, setRemember] = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [status,   setStatus]   = useState<"idle" | "loading" | "success">("idle");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setStatus("loading");
     setTimeout(() => {
    //  SAVE USER (simulate backend)
    const user = {
      name: username,
      role: role,
      initials: username.slice(0, 2).toUpperCase(),
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "fake-token"); // simulate auth

    setStatus("success");

    setTimeout(() => navigate("/dashboard"), 1000);
  }, 1500);
  };

  // Shared input style
  const inputCls =
    "w-full pl-12 pr-4 py-4 rounded-xl text-[16px] bg-white border-2 border-slate-200 text-[#1a2e3f] placeholder:text-slate-400 outline-none transition-all focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-[460px] bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 8px 48px rgba(0,53,95,0.14), 0 2px 8px rgba(0,53,95,0.08)" }}
      >

        {/* Top accent bar */}
        <div className="h-2 w-full" style={{ background: "linear-gradient(90deg,#00355f,#2563eb,#60a5fa)" }} />

        {/* Header section */}
        <div
          className="flex flex-col items-center px-10 pt-10 pb-8"
          style={{ backgroundColor: "#00355f" }}
        >
          {/* Logo */}
          <div
            className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-5 overflow-hidden"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
          >
            <img
              src={logo}
              alt="Petty Cash System"
              className="w-14 h-14 object-contain"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.style.display = "none";
                const p = t.parentElement;
                if (p)
                  p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00355f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
              }}
            />
          </div>

          <h1 className="text-[26px] font-extrabold text-white tracking-tight">
            Petty Cash System
          </h1>
          <p className="text-[14px] font-medium mt-1.5" style={{ color: "#93c5fd" }}>
            IT Finance Management
          </p>
        </div>

        {/* Form section */}
        <div className="px-10 py-9">
          <h2 className="text-[22px] font-bold text-[#00355f] mb-1">Welcome back</h2>
          <p className="text-[15px] text-slate-500 mb-7">Sign in to your account to continue.</p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Role dropdown */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-[#1a2e3f]">Select Role</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full pl-12 pr-10 py-4 rounded-xl text-[16px] bg-white border-2 border-slate-200 text-[#1a2e3f] outline-none transition-all appearance-none cursor-pointer focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10"
                  style={{ fontWeight: 500 }}
                >
                  {ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-[15px] font-bold text-[#1a2e3f]">
                Username
              </label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Enter your ID or email"
                  autoComplete="username"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[15px] font-bold text-[#1a2e3f]">
                  Password
                </label>
                <a
                  href="#"
                  className="text-[14px] font-semibold text-[#2563eb] hover:text-[#00355f] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00355f] transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => setRemember((v) => !v)}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border-2"
                style={{
                  backgroundColor: remember ? "#00355f" : "transparent",
                  borderColor: remember ? "#00355f" : "#cbd5e1",
                }}
              >
                {remember && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[15px] font-medium text-slate-600">
                Remember this workstation
              </span>
            </label>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium"
                style={{ backgroundColor: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626" }}
              >
                <span className="text-lg">⚠</span>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={status !== "idle"}
              className="w-full py-4 rounded-xl text-[17px] font-bold flex items-center justify-center gap-2.5 transition-all mt-2"
              style={
                status === "success"
                  ? { backgroundColor: "#16a34a", color: "#fff", boxShadow: "0 4px 16px rgba(22,163,74,0.3)" }
                  : status === "loading"
                  ? { backgroundColor: "#1e40af", color: "#fff", opacity: 0.9 }
                  : { backgroundColor: "#00355f", color: "#fff", boxShadow: "0 4px 16px rgba(0,53,95,0.3)" }
              }
            >
              {status === "idle"    && <><span>Sign In</span><ArrowRight size={20} /></>}
              {status === "loading" && <><Loader2 size={20} className="animate-spin" /><span>Signing in…</span></>}
              {status === "success" && <><CheckCircle2 size={20} /><span>Access Granted</span></>}
            </button>
          </form>
        </div>

        {/* Footer note inside card */}
        <div
          className="flex items-center justify-center gap-2 px-10 py-5 border-t border-slate-100"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <ShieldCheck size={16} style={{ color: "#00355f" }} />
          <p className="text-[13px] font-medium text-slate-500 text-center">
            Authorized personnel only · IT Finance Department
          </p>
        </div>
      </div>

      {/* Below-card meta */}
      <div className="flex items-center gap-6 mt-6">
        {["Privacy Policy", "Terms of Service", "Support"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-[13px] font-medium text-slate-400 hover:text-[#00355f] transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
      <p className="text-[12px] text-slate-400 mt-2">v2.4.0-PRO</p>
    </div>
  );
}